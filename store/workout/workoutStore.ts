import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
	createMesocycle,
	setActiveMesocycle,
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
} from './actions/workout.actions';
import { WorkoutState } from './types';

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
