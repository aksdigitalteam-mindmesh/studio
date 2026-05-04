# Recreate Prompt: Fit-Pulse AI Fitness & Nutrition Coach

## Overview
Build "Fit-Pulse", a high-performance, mobile-first AI fitness and nutrition application. The app serves as a personal coach that generates custom 7-day workout and diet plans, tracks daily calories/macros/hydration, and monitors muscle fatigue using a proprietary recovery logic.

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + ShadCN UI
- **Icons**: Lucide React
- **Authentication**: Firebase Auth (Email/Password)
- **Database**: 
    - **Firestore**: For persistent user profiles and fitness goal limits.
    - **LocalStorage**: For high-frequency data like meal logs, water intake, and completed workout sessions.
- **AI Backend**: OpenAI API (`gpt-3.5-turbo-1106` for structured JSON text generation and `dall-e-3` for instructional exercise images).

## Core Application Logic & Features

### 1. Onboarding & Authentication
- **Multi-step Signup**: Collect Display Name, Age, Height (cm), Weight (kg), Target Weight, Gender, Medical Conditions, and Intensity Level (low, medium, high).
- **Goal Validation**: Users must select a primary goal (weight-loss, build-muscle, endurance). Validate that target weight is less than current for weight-loss, and greater for build-muscle.
- **Goal Update Limit**: Implement a Firestore-side check where users can only change their "Fitness Goal" twice per month.

### 2. The Dynamic Dashboard
- **KCAL Ring System**: A large central ring displaying "KCAL LEFT" (Formula: Goal - Eaten + Burned). Two smaller secondary rings for "EATEN" and "BURNED".
- **Hydration Tracker**: A grid of 8 clickable, animated water glass components with a wave-fill effect.
- **Macro Progress**: Slim horizontal progress bars for Carbs, Protein, and Fat with specific gram targets.
- **Daily Navigation**: A calendar strip to move between days, with "Today" and "Yesterday" labels.
- **Meal Logging**: Categories for Breakfast, Lunch, Dinner, and Snacks with recommended calorie ranges.

### 3. AI Programs (Premium Gated)
- **Workout Generator**: A form (Goals, Duration, Days/Week, Equipment, Intensity) that calls a server action. The AI must return a valid 7-day JSON schedule.
- **Instructional Media**: For every generated exercise, trigger a secondary call to DALL-E 3 to generate a "minimalist, vector-style instructional illustration" of the movement.
- **Diet Generator**: Generates a 7-day plan including meal names, descriptions, and full recipes (ingredients + instructions) with macro breakdowns.
- **Usage Tracker**: Implement a `useUsageTracker` hook that limits AI generations to 6 per week using localStorage timestamps.

### 4. Activity Hub & Guided Workouts
- **Guided Session**: A full-screen interactive view. 
    - **Exercise Mode**: Shows instructional image, reps/sets, and a "Next" button.
    - **Rest Mode**: A 30-second countdown timer with a skip option.
- **Fatigue System**: Upon workout completion, the user rates fatigue (Low, Medium, High). 
- **Fatigue Logic**:
    - Low: +30% fatigue to muscle groups trained.
    - Medium: +50%.
    - High: +70%.
    - All muscles recover -15% automatically every day.
- **Visualization**: A Radar Chart (Recharts) showing current fatigue levels across 10 major muscle groups.

### 5. Nutrition & Shopping
- **Recipe Book**: A searchable gallery of "Saved" recipes (from generated plans) and "Discoverable" starter recipes.
- **Shopping List**: An ingredient list where users can add items manually or auto-populate from an AI meal plan. Supports checking off and clearing items.
- **Calorie Tracker**: A dedicated page for logging foods with units (pieces, g, ml, etc.). Includes a "Goal Warning" dialog if a meal puts the user near or over their daily limit.

### 6. UI/UX Design Language
- **Typography**: `Space Grotesk` for all headlines/titles, `PT Sans` for body text.
- **Color Palette**:
    - Primary: High-vibrancy Blue (`#3b82f6`).
    - Accent: Orange/Yellow gradients for "Premium" elements.
    - Backgrounds: Clean white for Light mode, Deep Navy-Black (`#0b1120`) for Dark mode.
- **Components**: Rounded corners (`--radius: 1rem`), soft shadows, and glassmorphism for nav bars.
- **Theme**: Support for Light, Dark, and System modes with a dedicated toggle in the Profile.

## AI Prompt Instructions (System Messages)
- **Workout Plan**: "You are an expert trainer. Return ONLY a JSON object. Ensure each major muscle group is trained at least twice a week. Return exercise IDs using a flexible mapping."
- **Diet Plan**: "You are a nutritionist. Return ONLY a JSON object. Meals must strictly align with the user's calorie target and macro ratio."
- **Recovery**: "You are a physiotherapist. Analyze the list of fatigued muscles and provide 3-5 actionable tips (stretching, hydration, heat/cold)."

## Deployment & Config
- Use a centralized `openai.ts` client.
- Secure all API keys in `.env`.
- Ensure Next.js server actions have a timeout of at least 60 seconds for image generation.
