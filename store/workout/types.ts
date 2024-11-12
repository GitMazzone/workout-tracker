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
}
