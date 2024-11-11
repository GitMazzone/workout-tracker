import { MuscleGroup, Equipment } from '@/store/types';

export interface Exercise {
	id: string;
	name: string;
	muscleGroups: MuscleGroup[];
	equipment: Equipment;
}

export const EXERCISES: Exercise[] = [
	// Chest
	{
		id: 'bench-press',
		name: 'Bench Press',
		muscleGroups: ['chest', 'triceps'],
		equipment: 'barbell',
	},
	{
		id: 'incline-db-press',
		name: 'Incline Dumbbell Press',
		muscleGroups: ['chest', 'shoulders'],
		equipment: 'dumbbell',
	},
	{
		id: 'cable-fly',
		name: 'Cable Fly',
		muscleGroups: ['chest'],
		equipment: 'cable',
	},
	{
		id: 'pushups',
		name: 'Push-up',
		muscleGroups: ['chest', 'triceps'],
		equipment: 'bodyweight',
	},

	// Back
	{
		id: 'pullup',
		name: 'Pull-up',
		muscleGroups: ['back', 'biceps'],
		equipment: 'bodyweight',
	},
	{
		id: 'bent-over-row',
		name: 'Bent Over Row',
		muscleGroups: ['back', 'biceps'],
		equipment: 'barbell',
	},
	{
		id: 'lat-pulldown',
		name: 'Lat Pulldown',
		muscleGroups: ['back', 'biceps'],
		equipment: 'cable',
	},
	{
		id: 'db-row',
		name: 'Single Arm Dumbbell Row',
		muscleGroups: ['back'],
		equipment: 'dumbbell',
	},

	// Shoulders
	{
		id: 'overhead-press',
		name: 'Overhead Press',
		muscleGroups: ['shoulders', 'triceps'],
		equipment: 'barbell',
	},
	{
		id: 'lateral-raise',
		name: 'Lateral Raise',
		muscleGroups: ['shoulders'],
		equipment: 'dumbbell',
	},
	{
		id: 'face-pull',
		name: 'Face Pull',
		muscleGroups: ['shoulders', 'back'],
		equipment: 'cable',
	},

	// Legs
	{
		id: 'squat',
		name: 'Back Squat',
		muscleGroups: ['legs'],
		equipment: 'barbell',
	},
	{
		id: 'rdl',
		name: 'Romanian Deadlift',
		muscleGroups: ['legs', 'back'],
		equipment: 'barbell',
	},
	{
		id: 'leg-press',
		name: 'Leg Press',
		muscleGroups: ['legs'],
		equipment: 'machine',
	},
	{
		id: 'lunge',
		name: 'Walking Lunges',
		muscleGroups: ['legs'],
		equipment: 'dumbbell',
	},

	// Arms
	{
		id: 'tricep-pushdown',
		name: 'Tricep Pushdown',
		muscleGroups: ['triceps'],
		equipment: 'cable',
	},
	{
		id: 'bicep-curl',
		name: 'Bicep Curl',
		muscleGroups: ['biceps'],
		equipment: 'dumbbell',
	},
	{
		id: 'skull-crusher',
		name: 'Skull Crushers',
		muscleGroups: ['triceps'],
		equipment: 'barbell',
	},

	// Core
	{
		id: 'plank',
		name: 'Plank',
		muscleGroups: ['core'],
		equipment: 'bodyweight',
	},
	{
		id: 'cable-crunch',
		name: 'Cable Crunch',
		muscleGroups: ['core'],
		equipment: 'cable',
	},
	{
		id: 'ab-wheel',
		name: 'Ab Wheel Rollout',
		muscleGroups: ['core'],
		equipment: 'bodyweight',
	},

	// Calves
	{
		id: 'standing-calf-raise',
		name: 'Standing Calf Raise',
		muscleGroups: ['calves'],
		equipment: 'machine',
	},
	{
		id: 'seated-calf-raise',
		name: 'Seated Calf Raise',
		muscleGroups: ['calves'],
		equipment: 'machine',
	},
];
