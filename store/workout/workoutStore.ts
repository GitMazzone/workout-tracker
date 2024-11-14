import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
	createMesocycle,
	setActiveMesocycle,
	deleteMesocycle,
	updateMesocycleName,
} from './actions/mesocycle.actions';
import {
	completeSet,
	skipSet,
	deleteSet,
	addSet,
	undoSetCompletion,
} from './actions/sets.actions';
import {
	setCurrentWorkout,
	navigateWorkout,
	updateSetWeight,
	updateSetReps,
	skipWorkout,
	replaceExercise,
} from './actions/workout.actions';
import { WorkoutState } from './workout.types';

export const useWorkoutStore = create<WorkoutState>()(
	persist(
		(setState) => ({
			mesocycles: [],
			activeMesocycle: null,
			currentWorkoutId: null,
			createMesocycle: createMesocycle(setState),
			setActiveMesocycle: setActiveMesocycle(setState),
			setCurrentWorkout: setCurrentWorkout(setState),
			navigateWorkout: navigateWorkout(setState),
			completeSet: completeSet(setState),
			skipSet: skipSet(setState),
			deleteSet: deleteSet(setState),
			addSet: addSet(setState),
			undoSetCompletion: undoSetCompletion(setState),
			updateSetWeight: updateSetWeight(setState),
			updateSetReps: updateSetReps(setState),
			deleteMesocycle: deleteMesocycle(setState),
			updateMesocycleName: updateMesocycleName(setState),
			skipWorkout: skipWorkout(setState),
			replaceExercise: replaceExercise(setState),
		}),
		{
			name: 'workout-storage',
			storage: createJSONStorage(() => AsyncStorage),
			partialize: (state) => ({
				mesocycles: state.mesocycles,
				activeMesocycle: state.activeMesocycle,
				currentWorkoutId: state.currentWorkoutId,
			}),
		}
	)
);
