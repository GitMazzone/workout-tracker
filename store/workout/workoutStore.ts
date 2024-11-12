import { create } from 'zustand';
import { WorkoutState } from './types';
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

export const useWorkoutStore = create<WorkoutState>()((setState) => ({
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
}));
