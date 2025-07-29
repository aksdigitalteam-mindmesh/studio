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
    <Rocket {...props} />
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
};
