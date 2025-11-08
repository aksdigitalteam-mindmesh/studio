
'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
  useCallback,
} from 'react';
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile as updateFirebaseProfile,
  type User,
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { useFirebase } from '@/firebase';
import { Loader2 } from 'lucide-react';

interface UserProfile {
    uid: string;
    email?: string | null;
    displayName?: string | null;
    photoURL?: string | null;
    medicalConditions?: string;
    workoutDuration?: number;
    workoutDaysPerWeek?: number;
    age?: number;
    height?: number;
    weight?: number;
    fitnessGoal?: 'weight-loss' | 'build-muscle' | 'endurance';
    intensity?: 'beginner' | 'intermediate' | 'advanced';
    goalLastUpdated?: any; 
    goalUpdateCount?: number;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signUpWithEmail: (email: string, password: string, profileData?: Record<string, any>) => Promise<string | null>;
  signInWithEmail: (email: string, password: string) => Promise<string | null>;
  signOutUser: () => Promise<void>;
  updateUserProfile: (uid: string, data: Partial<UserProfile>) => Promise<string | null>;
  refreshProfile: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { auth, firestore } = useFirebase();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (user: User) => {
    const userDocRef = doc(firestore, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
        const data = userDoc.data() as UserProfile;
        // Convert Firestore Timestamp to Date if it exists
        if (data.goalLastUpdated && typeof data.goalLastUpdated.toDate === 'function') {
            data.goalLastUpdated = data.goalLastUpdated.toDate();
        }
        setProfile(data);
    } else {
        // If profile doesn't exist, create a shell
        const newProfile: UserProfile = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL
        };
        await setDoc(userDocRef, newProfile);
        setProfile(newProfile);
    }
  }, [firestore]);


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        await fetchProfile(user);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [auth, fetchProfile]);

  const refreshProfile = useCallback(() => {
    if (user) {
      fetchProfile(user);
    }
  }, [user, fetchProfile]);

  const signUpWithEmail = async (email: string, password: string, profileData: Record<string, any> = {}) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const newUser = userCredential.user;
        
        await updateFirebaseProfile(newUser, {
            displayName: profileData.displayName,
        });

        const userDocRef = doc(firestore, 'users', newUser.uid);
        const newProfileData: UserProfile = {
            uid: newUser.uid,
            email: newUser.email,
            displayName: profileData.displayName,
            medicalConditions: profileData.medicalConditions || '',
            workoutDuration: profileData.workoutDuration || 60,
            workoutDaysPerWeek: profileData.workoutDaysPerWeek || 4,
            age: profileData.age,
            height: profileData.height,
            weight: profileData.weight,
            fitnessGoal: profileData.fitnessGoal,
            intensity: profileData.intensity,
            goalUpdateCount: 0,
        };
        await setDoc(userDocRef, newProfileData);

        setUser(newUser);
        setProfile(newProfileData);
        return null;
    } catch (error: any) {
        console.error("Error signing up:", error);
        if (error.code === 'auth/email-already-in-use') {
            return "This email is already in use. Please try logging in.";
        }
        if (error.code === 'auth/configuration-not-found') {
            return "Authentication method not enabled. Please enable Email/Password sign-in in your Firebase console.";
        }
        return error.message || "An unknown error occurred.";
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
      try {
          await signInWithEmailAndPassword(auth, email, password);
          return null;
      } catch (error: any) {
          console.error("Error signing in:", error);
           if (error.code === 'auth/configuration-not-found') {
              return "Authentication method not enabled. Please enable Email/Password sign-in in your Firebase console.";
          }
          if (error.code === 'auth/email-already-in-use') {
            return "This email is already in use. Please try logging in.";
          }
          return error.message || "An unknown error occurred.";
      }
  };

  const signOutUser = async () => {
    await signOut(auth);
    setUser(null);
    setProfile(null);
  };
  
  const updateUserProfile = async (uid: string, data: Partial<UserProfile>) => {
    try {
        const userDocRef = doc(firestore, 'users', uid);
        let dataToUpdate = { ...data };

        // Special handling for fitnessGoal updates
        if (data.fitnessGoal) {
            const userDoc = await getDoc(userDocRef);
            const currentProfile = userDoc.data() as UserProfile;
            const now = new Date();
            let count = currentProfile.goalUpdateCount || 0;
            const lastUpdated = currentProfile.goalLastUpdated ? new Date(currentProfile.goalLastUpdated) : null;
            
            if(lastUpdated && now.getMonth() === lastUpdated.getMonth() && now.getFullYear() === lastUpdated.getFullYear()){
                if(count >= 2) {
                    return "You can only change your fitness goal twice a month.";
                }
                count++;
            } else {
                // It's a new month, so reset the count
                count = 1;
            }

            dataToUpdate = {
                ...dataToUpdate,
                goalUpdateCount: count,
                goalLastUpdated: serverTimestamp() // Use server timestamp
            };
        }

        await updateDoc(userDocRef, dataToUpdate);
        await fetchProfile(auth.currentUser!); // Refetch to get server-generated timestamp
        return null;
    } catch (error: any) {
        console.error("Error updating profile:", error);
        return error.message || "An unknown error occurred.";
    }
  }

  const value = {
    user,
    profile,
    loading,
    signUpWithEmail,
    signInWithEmail,
    signOutUser,
    updateUserProfile,
    refreshProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
