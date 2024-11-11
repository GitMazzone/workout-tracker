export type MuscleGroup =
	| 'chest'
	| 'back'
	| 'shoulders'
	| 'biceps'
	| 'triceps'
	| 'legs'
	| 'calves'
	| 'core';

export type Equipment =
	| 'barbell'
	| 'dumbbell'
	| 'cable'
	| 'machine'
	| 'bodyweight';

export interface WorkoutSet {
	exerciseId: string;
	weight: number;
	targetReps: number;
	completed: boolean;
	completedReps?: number;
	completedWeight?: number;
	skipped?: boolean;
}

interface WorkoutDay {
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
			// 0-6 for days of week
			muscleGroups: MuscleGroup[];
			exercises: string[];
		};
	};
	workouts: WorkoutDay[];
}

export interface ExerciseSelection {
	[key: string]: string; // Format: "dayIndex-muscleGroup": "exerciseId"
}

// app/template/[id]/exercises.tsx onPress handler will use this type
export interface MesocycleTemplate {
	name: string;
	weeks: number;
	days: number;
	exercises: ExerciseSelection;
}
