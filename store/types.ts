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

export interface ExerciseSelection {
	[key: string]: string; // Format: "dayIndex-muscleGroup": "exerciseId"
}
