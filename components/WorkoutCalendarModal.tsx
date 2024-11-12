import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { X, CheckCircle, Circle } from 'lucide-react-native';
import { Mesocycle } from '@/store/workout';
import { useMemo } from 'react';

interface Props {
	visible: boolean;
	onClose: () => void;
	mesocycle: Mesocycle;
	onSelectWorkout: (workoutId: string) => void;
	currentWorkoutId?: string;
}

export function WorkoutCalendarModal({
	visible,
	onClose,
	mesocycle,
	onSelectWorkout,
	currentWorkoutId,
}: Props) {
	// Group workouts by week
	const workoutsByWeek = useMemo(() => {
		const weeks: Array<
			Array<{
				id: string;
				completed: boolean;
				inProgress: boolean;
				completedSets: number;
				totalSets: number;
				dayNumber: number;
			}>
		> = [];

		let currentWeek: (typeof weeks)[0] = [];
		let dayCount = 0;

		mesocycle.workouts.forEach((workout) => {
			dayCount++;
			const weekIndex = Math.floor(
				(dayCount - 1) / mesocycle.template[0].muscleGroups.length
			);

			if (!weeks[weekIndex]) {
				weeks[weekIndex] = [];
			}

			const allCompleted = workout.sets.every((set) => set.completed);
			const anyCompleted = workout.sets.some((set) => set.completed);
			const completedSets = workout.sets.filter((set) => set.completed).length;

			weeks[weekIndex].push({
				id: workout.id,
				completed: allCompleted,
				inProgress: !allCompleted && anyCompleted,
				completedSets,
				totalSets: workout.sets.length,
				dayNumber: dayCount,
			});
		});

		return weeks;
	}, [mesocycle]);

	return (
		<Modal
			visible={visible}
			animationType='slide'
			presentationStyle='pageSheet'
		>
			<View className={'flex-1 bg-white'}>
				<View
					className={
						'flex-row justify-between items-center p-4 border-b border-gray-200'
					}
				>
					<Text className={'text-xl font-semibold'}>
						Mesocycle | {mesocycle.name}
					</Text>
					<TouchableOpacity onPress={onClose}>
						<X size={24} color='#000' />
					</TouchableOpacity>
				</View>

				<ScrollView horizontal>
					{workoutsByWeek.map((week, weekIndex) => (
						<View key={weekIndex} className={'mb-6'}>
							<Text className={'text-lg font-semibold px-4 py-2'}>
								Week {weekIndex + 1}
							</Text>

							<ScrollView
								showsHorizontalScrollIndicator={false}
								className={'px-4 space-y-2'}
							>
								{week.map((workout) => (
									<TouchableOpacity
										key={workout.id}
										onPress={() => {
											onSelectWorkout(workout.id);
											onClose();
										}}
										className={`mr-3 p-4 rounded-lg border w-32 ${
											workout.id === currentWorkoutId
												? 'border-sky-500 bg-sky-50'
												: 'border-gray-200'
										}`}
									>
										<View className={'flex-row items-center justify-between'}>
											<Text className={'font-medium'}>
												Day {workout.dayNumber}
											</Text>
											{workout.completed ? (
												<CheckCircle size={20} color='#22C55E' />
											) : (
												<Circle
													size={20}
													color={workout.inProgress ? '#F59E0B' : '#CBD5E1'}
												/>
											)}
										</View>

										{workout.inProgress && (
											<Text className={'text-sm text-yellow-600'}>
												{workout.completedSets}/{workout.totalSets} sets
											</Text>
										)}
									</TouchableOpacity>
								))}
							</ScrollView>
						</View>
					))}
				</ScrollView>
			</View>
		</Modal>
	);
}
