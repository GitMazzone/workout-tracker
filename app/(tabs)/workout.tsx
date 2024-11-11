import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useWorkoutStore } from '@/store/workoutStore';
import { EXERCISES } from '@/constants/exercises';
import { WorkoutSet } from '@/store/types';
import { useState } from 'react';
import SetCompletionModal from '@/components/SetCompletionModal';

export default function WorkoutScreen() {
	const [selectedSet, setSelectedSet] = useState<{
		set: WorkoutSet;
		index: number;
		exerciseId: string;
	} | null>(null);

	const { mesocycles, activeMesocycle, completeSet, skipSet } =
		useWorkoutStore();
	const currentMeso = mesocycles.find((m) => m.id === activeMesocycle);

	if (!currentMeso) {
		return (
			<View className={'flex-1 bg-white p-4 justify-center items-center'}>
				<Text className={'text-lg text-gray-600 text-center'}>
					No active mesocycle.{'\n'}Create one to start working out!
				</Text>
			</View>
		);
	}

	const nextWorkout = currentMeso.workouts.find((workout) =>
		workout.sets.some((set) => !set.completed)
	);

	if (!nextWorkout) {
		return (
			<View className={'flex-1 bg-white p-4 justify-center items-center'}>
				<Text className={'text-lg text-gray-600 text-center'}>
					All workouts completed in this mesocycle!
				</Text>
			</View>
		);
	}

	// Calculate workout number
	const workoutNumber = currentMeso.workouts.indexOf(nextWorkout) + 1;
	const totalWorkouts = currentMeso.workouts.length;

	// Group sets by exercise
	const exerciseGroups = nextWorkout.sets.reduce((groups, set) => {
		if (!groups[set.exerciseId]) {
			groups[set.exerciseId] = [];
		}
		groups[set.exerciseId].push(set);
		return groups;
	}, {} as Record<string, typeof nextWorkout.sets>);

	return (
		<View className={'flex-1 bg-white'}>
			<ScrollView className={'flex-1 p-4'}>
				<View className={'flex-row justify-between items-center mb-4'}>
					<Text className={'text-2xl font-bold'}>Current Workout</Text>
					<Text className={'text-base text-gray-600'}>
						{workoutNumber} of {totalWorkouts}
					</Text>
				</View>

				{Object.entries(exerciseGroups).map(([exerciseId, sets]) => {
					const exercise = EXERCISES.find((e) => e.id === exerciseId);
					if (!exercise) return null;

					return (
						<View key={exerciseId} className={'mb-6'}>
							<Text className={'text-lg font-semibold mb-2'}>
								{exercise.name}
							</Text>

							{sets.map((set, idx) => (
								<TouchableOpacity
									key={idx}
									className={`flex-row items-center p-4 mb-2 rounded-lg border ${
										set.completed
											? set.skipped
												? 'bg-gray-100 border-gray-200'
												: 'bg-gray-50 border-gray-200'
											: 'bg-white border-gray-300'
									}`}
									onPress={() => {
										if (!set.completed) {
											setSelectedSet({
												set,
												index: idx,
												exerciseId,
											});
										}
									}}
								>
									<Text className={'text-base mr-4'}>Set {idx + 1}</Text>
									{set.completed ? (
										<View className={'flex-1'}>
											{set.skipped ? (
												<Text className={'text-base text-gray-500'}>
													Skipped
												</Text>
											) : (
												<Text className={'text-base text-gray-600'}>
													{set.completedReps} reps @ {set.completedWeight}lbs
												</Text>
											)}
										</View>
									) : (
										<View className={'flex-1'}>
											<Text className={'text-base'}>
												Target: {set.targetReps} reps{' '}
												{set.weight > 0 ? `@ ${set.weight}lbs` : ''}
											</Text>
										</View>
									)}
								</TouchableOpacity>
							))}
						</View>
					);
				})}
			</ScrollView>

			{selectedSet && (
				<SetCompletionModal
					visible={!!selectedSet}
					onClose={() => setSelectedSet(null)}
					set={selectedSet.set}
					exerciseName={
						EXERCISES.find((e) => e.id === selectedSet.exerciseId)?.name ?? ''
					}
					setNumber={selectedSet.index + 1}
					onComplete={(weight, reps) => {
						completeSet(nextWorkout.id, selectedSet.index, weight, reps);
						setSelectedSet(null);
					}}
					onSkip={() => {
						skipSet(nextWorkout.id, selectedSet.index);
						setSelectedSet(null);
					}}
				/>
			)}
		</View>
	);
}
