import { EXERCISES } from '@/constants/exercises';
import { useWorkoutStore, WorkoutSet } from '@/store/workout';
import { Trash2, Check, Plus } from 'lucide-react-native';
import { View, TouchableOpacity, TextInput, Text } from 'react-native';
import { useState, useEffect } from 'react';

export const ExerciseSetList = ({
	exerciseId,
	sets,
	workoutId,
}: {
	exerciseId: string;
	sets: WorkoutSet[];
	workoutId: string;
}) => {
	const {
		completeSet,
		deleteSet,
		addSet,
		undoSetCompletion,
		updateSetWeight,
		updateSetReps,
	} = useWorkoutStore();
	const exercise = EXERCISES.find((e) => e.id === exerciseId);
	const [inputValues, setInputValues] = useState<{
		[key: string]: { weight: string; reps: string };
	}>({});

	useEffect(() => {
		const newValues: { [key: string]: { weight: string; reps: string } } = {};
		sets.forEach((set, idx) => {
			const key = `${exerciseId}-${idx}`;
			if (!inputValues[key]) {
				newValues[key] = {
					weight: set.completedWeight?.toString() || '',
					reps: set.completedReps?.toString() || '',
				};
			}
		});
		if (Object.keys(newValues).length > 0) {
			setInputValues((prev) => ({ ...prev, ...newValues }));
		}
	}, [sets]);

	if (!exercise) return null;

	return (
		<View className={'p-4 border-b-2 border-gray-100'}>
			<Text className={'text-lg mb-2'}>{exercise.name}</Text>

			{sets.map((set, idx) => {
				const isLastSet = idx === sets.length - 1;
				const inputKey = `${exerciseId}-${idx}`;

				return (
					<View key={inputKey} className={'flex-row items-center mb-3 gap-2'}>
						{isLastSet && sets.length > 0 ? (
							<TouchableOpacity
								onPress={() => deleteSet(workoutId, exerciseId, idx)}
								className={'p-2'}
							>
								<Trash2 size={20} color='#EF4444' />
							</TouchableOpacity>
						) : (
							<View className={'w-10'} />
						)}

						<Text className={'w-8 font-medium'}>{idx + 1}</Text>

						<TextInput
							className={'flex-1 p-3 bg-gray-50 rounded-lg text-base'}
							keyboardType='numeric'
							returnKeyType='done'
							placeholder='Weight'
							value={inputValues[inputKey]?.weight || ''}
							onChangeText={(text) => {
								setInputValues((prev) => ({
									...prev,
									[inputKey]: { ...prev[inputKey], weight: text },
								}));
								const num = parseInt(text);
								if (!isNaN(num)) {
									updateSetWeight(workoutId, idx, num);
								}
							}}
						/>

						<TextInput
							className={'flex-1 p-3 bg-gray-50 rounded-lg text-base'}
							keyboardType='numeric'
							returnKeyType='done'
							placeholder='Reps'
							value={inputValues[inputKey]?.reps || ''}
							onChangeText={(text) => {
								setInputValues((prev) => ({
									...prev,
									[inputKey]: { ...prev[inputKey], reps: text },
								}));
								const num = parseInt(text);
								if (!isNaN(num)) {
									updateSetReps(workoutId, idx, num);
								}
							}}
						/>

						<TouchableOpacity
							onPress={() => {
								const weight = parseInt(inputValues[inputKey]?.weight || '0');
								const reps = parseInt(inputValues[inputKey]?.reps || '0');

								if (set.completed) {
									undoSetCompletion(workoutId, exerciseId, idx);
								} else if (weight && reps) {
									completeSet(workoutId, exerciseId, idx, weight, reps);
								}
							}}
							className={'p-2'}
						>
							<View
								className={`w-6 h-6 rounded border-2 ${
									set.completed
										? 'bg-green-500 border-green-500'
										: 'border-gray-300'
								} justify-center items-center`}
							>
								{set.completed && <Check size={16} color='#fff' />}
							</View>
						</TouchableOpacity>
					</View>
				);
			})}

			<TouchableOpacity
				onPress={() => addSet(workoutId, exerciseId)}
				className={'flex-row items-center justify-center p-2 mt-2'}
			>
				<Plus size={24} color='#22C55E' />
			</TouchableOpacity>
		</View>
	);
};
