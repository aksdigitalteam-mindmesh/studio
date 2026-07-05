# Fit-Pulse AI Fitness & Nutrition Coach

**Fit-Pulse** is a high-performance, mobile-first web application designed to be your personal digital coach. It combines a fast, inbuilt workout engine with Gemini AI-powered nutrition and recovery advice to provide a holistic fitness experience.

## 🚀 Key Features

### 1. Dynamic Dashboard (The KCAL Ring)
- **Real-time Calorie Tracking**: A central "KCAL LEFT" ring system that calculates: `Goal - Eaten + Burned`.
- **Macro Progress**: Slim, color-coded progress bars for Carbs, Protein, and Fat.
- **Hydration Tracker**: Animated water glass components with a wave-fill effect to track your daily intake.
- **Daily Navigation**: Quickly switch between days to review past performance.

### 2. Activity Hub & Guided Workouts
- **Inbuilt Workout Engine**: Generates 7-day splits (Full Body, Push/Pull/Legs, or Upper/Lower) instantly using a local database of 20+ core exercises.
- **Interactive Guided Sessions**: A full-screen mode showing instructional GIFs (via ExerciseDB), reps, sets, and a rest timer.
- **Visual Feedback**: Real-time progress bars as you work through your sets.

### 3. Proprietary Fatigue System
- **Muscle-Specific Tracking**: Monitors fatigue across 10 major muscle groups (Chest, Biceps, Abs, Quads, etc.).
- **Smart Recovery Logic**:
    - **Accumulation**: Fatigue increases by 30%, 50%, or 70% based on your post-workout rating (Low/Medium/High).
    - **Passive Recovery**: All muscles recover by -15% automatically every 24 hours.
- **Radar Chart Visualization**: A holistic view of your body's recovery state using Recharts.

### 4. AI Nutrition & Recovery (Gemini Powered)
- **AI Diet Generator**: Creates personalized 7-day meal plans with full recipes, ingredients, and macro breakdowns.
- **AI Recovery Coach**: Analyzes your current fatigue levels and provides 3-5 actionable physiotherapy tips (stretching, hydration, etc.).
- **Smart Shopping List**: Auto-populates ingredients from your generated meal plans.

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + ShadCN UI (with Dark Mode support)
- **Database/Auth**: 
  - **Firebase Auth**: Secure Email/Password authentication.
  - **Cloud Firestore**: Persistent user profiles and fitness goals.
  - **LocalStorage**: High-frequency data (meal logs, hydration, fatigue) for offline-first performance.
- **AI/APIs**: 
  - **Google Gemini 1.5 Flash**: For diet plans and recovery logic.
  - **ExerciseDB (RapidAPI)**: For high-quality instructional exercise GIFs.
  - **Vercel Analytics**: Built-in performance monitoring.

## 📐 Business Logic

### Calorie Calculation
Uses the **Mifflin-St Jeor Equation** for BMR, adjusted by a TDEE multiplier (1.375) and specific goal offsets:
- **Weight Loss**: -300 to -700 kcal based on intensity.
- **Muscle Gain**: +300 to +700 kcal based on intensity.

### Goal Limits
- Users are limited to **2 Fitness Goal changes per month** (enforced via server-side Firestore logic) to ensure plan consistency.

## 📦 Getting Started

1. **Clone the repository**
2. **Setup Environment Variables**:
   Create a `.env` file with:
   ```env
   GEMINI_API_KEY=your_gemini_key
   EXERCISEDB_API_KEY=your_exercisedb_key
   ```
3. **Install Dependencies**:
   ```bash
   npm install
   ```
4. **Run Development Server**:
   ```bash
   npm run dev
   ```

---
*Fit-Pulse: Pulse your way to a stronger you.*