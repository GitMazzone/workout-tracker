import { MuscleGroup } from '../types';

export interface WorkoutSet {
	exerciseId: string;
	weight: number;
	targetReps: number;
	completed: boolean;
	completedReps?: number;
	completedWeight?: number;
	skipped?: boolean;
}

export interface WorkoutDay {
	id: string;
	date: string;
	sets: WorkoutSet[];
}

export interface Mesocycle {
	id: string;
	name: string;
	weeks: number;
	startDate: string;
	template: {
		[key: number]: {
			muscleGroups: MuscleGroup[];
			exercises: string[];
		};
	};
	workouts: WorkoutDay[];
}

export interface MesocycleTemplate {
	name: string;
	weeks: number;
	days: number;
	exercises: { [key: string]: string }; // Format: "dayIndex-muscleGroup": "exerciseId"
}

export interface WorkoutState {
	mesocycles: Mesocycle[];
	activeMesocycle: string | null;
	currentWorkoutId: string | null;
	createMesocycle: (template: MesocycleTemplate) => void;
	setActiveMesocycle: (id: string) => void;
	setCurrentWorkout: (id: string) => void;
	navigateWorkout: (direction: 'next' | 'prev') => void;
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
