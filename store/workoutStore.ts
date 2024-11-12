import { create } from 'zustand';
import { Mesocycle, MesocycleTemplate } from './workout/types';
import {
	createMesocycle,
	setActiveMesocycle,
} from './workout/actions/mesocycle.actions';
import {
	completeSet,
	skipSet,
	deleteSet,
	addSet,
	undoSetCompletion,
} from './workout/actions/sets.actions';
import {
	updateSetWeight,
	updateSetReps,
} from './workout/actions/workout.actions';

interface WorkoutState {
	mesocycles: Mesocycle[];
	activeMesocycle: string | null;
	createMesocycle: (template: MesocycleTemplate) => void;
	setActiveMesocycle: (id: string) => void;
	completeSet: (
		workoutId: string,
		exercideId: string,
		setIndex: number,
		weight: number,
		reps: number
	) => void;
	skipSet: (workoutId: string, setIndex: number) => void;
	deleteSet: (workoutId: string, exerciseId: string, setIndex: number) => void;
	addSet: (workoutId: string, exerciseId: string) => void;
	undoSetCompletion: (
		workoutId: string,
		exercideId: string,
		setIndex: number
	) => void;
	updateSetWeight: (
		workoutId: string,
		setIndex: number,
		weight: number
	) => void;
	updateSetReps: (workoutId: string, setIndex: number, reps: number) => void;
}

export const useWorkoutStore = create<WorkoutState>()((setState) => ({
	mesocycles: [],
	activeMesocycle: null,
	createMesocycle: createMesocycle(setState),
	setActiveMesocycle: setActiveMesocycle(setState),
	completeSet: completeSet(setState),
	skipSet: skipSet(setState),
	deleteSet: deleteSet(setState),
	addSet: addSet(setState),
	undoSetCompletion: undoSetCompletion(setState),
	updateSetWeight: updateSetWeight(setState),
	updateSetReps: updateSetReps(setState),
}));
