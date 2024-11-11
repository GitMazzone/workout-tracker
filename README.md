# Workout Tracker App

A React Native app for tracking workout mesocycles, built with Expo.

## Core Concepts

- **Mesocycle**: A training block (4-6 weeks) with programmed progression
- **Template**: Predefined workout splits (Upper/Lower, PPL, Full Body)
- **Progression**: Each exercise follows programmed progression:
  - Week 1: 3x8
  - Week 2: 3x10
  - Week 3: 4x8
  - Week 4: 4x10
  - Week 5+: Deload week if included

## Project Structure

```
app/
├── (tabs)/                   # Tab-based navigation
│   ├── _layout.tsx          # Tab configuration
│   ├── index.tsx            # Home screen (mesocycle list)
│   └── workout.tsx          # Current workout view & set logging
├── template/                 # Template configuration
│   ├── [id].tsx             # Template details & configuration
│   └── [id]/
│       └── exercises.tsx     # Exercise selection for template
└── templates.tsx            # Template selection screen

components/
└── SetCompletionModal.tsx    # Modal for logging sets/weights

constants/
├── exercises.ts             # Exercise library by muscle group
└── templates.ts            # Predefined workout templates

store/
├── types.ts                # TypeScript interfaces
└── workoutStore.ts         # State management & workout generation
```

## Features

✅ Implemented:

- Full navigation flow with tabs and modals
- Template selection and configuration
- Exercise selection with auto-fill capability
- Workout generation with progressive overload
- Set tracking (complete/skip) with weight/rep logging
- Persistent storage with Zustand
- Muscle group targeting system

🚧 In Progress:

- Weight progression suggestions
- Basic analytics/progress tracking

❌ Planned:

- Calendar view
- Exercise history
- Weight progression visualization
- Export/backup functionality

## Data Flow

1. Template Selection:
   - User picks a workout split template
   - Configures weeks (4-6) and days per week
2. Exercise Selection:

   - For each day, pick exercises per muscle group
   - Auto-fill option available for quick setup

3. Workout Generation:

   - Creates full mesocycle with progressive overload
   - Sets organized by exercise and muscle group

4. Workout Execution:
   - Shows current incomplete workout
   - Log weights and reps or skip sets
   - Tracks progress through mesocycle

## Development

```bash
# Start development server
npx expo start
```

## State Management

Using Zustand for:

- Mesocycle management
- Workout progression
- Set completion tracking
- Exercise selections

## Current Focus

1. Bug fixes in workout generation
2. Weight progression logic
3. Performance optimizations
4. User experience improvements
