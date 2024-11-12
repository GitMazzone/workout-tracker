# Workout Tracker App

A React Native & Expo app for tracking progressive overload workouts through mesocycles.

## Project State & Next Steps

We've just completed a major store refactor, breaking down the monolithic `workoutStore.ts` into:

```
store/workout/
├── types.ts               # Core type definitions
├── actions/
│   ├── mesocycle.ts      # Mesocycle management
│   ├── sets.ts           # Set operations (complete, skip, etc.)
│   └── workout.ts        # Workout navigation (next to implement)
├── utils/
│   ├── generateSets.ts   # Set generation logic
│   └── generateWorkouts.ts# Workout generation
└── index.ts              # Store composition
```

### Immediate Next Steps

1. **Workout Navigation** (Next Priority)

   - Add `setActiveWorkout` action to store
   - Implement navigation between workouts from calendar view
   - Add prev/next workout controls in workout view
   - Update workout view to show any workout, not just next incomplete

2. **Weight Progression**

   - Add weight suggestions based on previous workout performance
   - Show previous weights for same exercise in earlier workouts
   - Implement deload week logic

3. **Analytics & Stats**
   - Volume tracking per muscle group
   - Progress visualization
   - Success rate of target reps/weights

## Core Features Status

✅ Completed:

- Navigation structure with tabs and modals
- Template system with exercise selection
- Workout generation with progressive overload
- Set tracking with weight/reps
- Basic calendar view
- Store refactoring

🚧 In Progress:

- Workout navigation system
- Weight progression suggestions

❌ Not Started:

- Analytics/stats
- Export functionality
- Settings/preferences

## Technical Details

### Navigation Structure

```
app/
├── (tabs)/
│   ├── _layout.tsx     # Tab configuration
│   ├── index.tsx       # Mesocycle list
│   └── workout.tsx     # Active workout view
├── template/
│   ├── [id].tsx        # Template config
│   └── [id]/exercises.tsx
└── templates.tsx       # Template selection
```

### Components

- `WorkoutCalendarModal`: Shows mesocycle progress, needs workout navigation
- `ExerciseSetList`: Handles individual exercise sets, recently refactored
- More components to be added for analytics

### State Management

Using Zustand with newly separated concerns:

- Mesocycle actions: Creation, activation
- Set actions: Completion, skipping, weight/rep updates
- Workout actions: Navigation (to be implemented)

## Key Implementations

### Progressive Overload Pattern

```typescript
Week 1: 3x8
Week 2: 3x10
Week 3: 4x8
Week 4: 4x10
Week 5+: Deload
```

### Data Flow

1. Template selection → exercise picking
2. Mesocycle generation with progressive overload
3. Workout execution with weight/rep tracking

## Development

```bash
# Dependencies
npm install nativewind@2 @react-native-async-storage/async-storage zustand date-fns

# Navigation
npx expo install expo-router react-native-safe-area-context react-native-screens
```

## Current Technical Debt

- Need to improve error handling in store actions
- Consider adding optimistic updates
- Add proper TypeScript strict mode compliance
- Implement proper form validation

The next developer should focus on implementing the workout navigation system, starting with the store actions in `workout.ts` and then updating the UI components to support navigation between workouts.
