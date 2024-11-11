# Workout Tracker App

A React Native app for tracking workout mesocycles, built with Expo.

## Core Concepts

- **Mesocycle**: A training block (4-6 weeks) with programmed progression
- **Template**: Predefined workout splits (Upper/Lower, PPL, Full Body)
- **Progression**: Weight/rep schemes that progress throughout the mesocycle

## Project Structure

```
app/
├── (tabs)/                   # Tab-based navigation
│   ├── _layout.tsx          # Tab configuration
│   ├── index.tsx            # Home screen (mesocycle list)
│   └── workout.tsx          # Current workout view
├── template/                 # Template configuration
│   ├── [id].tsx             # Template details & configuration
│   └── [id]/
│       └── exercises.tsx     # Exercise selection for template
└── templates.tsx            # Template selection screen

constants/
├── exercises.ts             # Exercise library
└── templates.ts            # Workout templates/splits

store/
├── types.ts                # TypeScript types/interfaces
└── workoutStore.ts         # Zustand state management
```

## Data Flow

1. User selects a template (templates.tsx)
2. Configures weeks/days ([id].tsx)
3. Selects exercises per muscle group (exercises.tsx)
4. Creates mesocycle which generates workouts
5. Executes workouts and logs progress

## Key Technologies

- Expo Router for navigation
- NativeWind (v2) for styling
- Zustand for state management
- Expo for development/building

## Current Implementation Status

✅ Complete:

- Navigation structure
- Template selection
- Exercise selection UI
- Data layer foundation

🚧 In Progress:

- Workout generation
- Progress tracking

❌ Not Started:

- Workout execution view
- Calendar/schedule view

## Next Steps

1. Implement workout generation with progressive overload
2. Create workout execution view
3. Add progress tracking
4. Implement calendar view

## Development

```bash
# Install dependencies
npm install

# Start development server
npx expo start
```
