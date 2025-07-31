import type { SVGProps } from "react";
import { 
  Flame, 
  Droplets, 
  Weight, 
  HeartPulse, 
  UtensilsCrossed, 
  Gem, 
  LayoutDashboard,
  Sun,
  Moon,
  Rocket
} from 'lucide-react';

export const Icons = {
  Logo: (props: SVGProps<SVGSVGElement>) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        {...props}
    >
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
        <path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0-6 0"/>
    </svg>
  ),
  Dashboard: LayoutDashboard,
  Calories: Flame,
  Water: Droplets,
  Weight: Weight,
  Workout: HeartPulse,
  Diet: UtensilsCrossed,
  Subscription: Gem,
  Sun,
  Moon,
  Rocket
};
