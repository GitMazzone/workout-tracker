import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWorkoutStore } from '@/store/workoutStore';
import { EXERCISES } from '@/constants/exercises';
import { MuscleGroup, WorkoutSet } from '@/store/types';
import { Calendar } from 'lucide-react-native';
import { ExerciseSetList } from '@/components/ExerciseSetList';
import { WorkoutCalendarModal } from '@/components/WorkoutCalendarModal';
import { useState } from 'react';

const getExerciseMuscleGroup = (exerciseId: string): MuscleGroup | null => {
	const exercise = EXERCISES.find((e) => e.id === exerciseId);
	return exercise?.muscleGroups[0] || null;
};

export default function WorkoutScreen() {
	const [calendarVisible, setCalendarVisible] = useState(false);
	const { mesocycles, activeMesocycle } = useWorkoutStore();
	const currentMeso = mesocycles.find((m) => m.id === activeMesocycle);

	if (!currentMeso) {
		return (
			<SafeAreaView className={'flex-1'}>
				<View className={'flex-1 bg-white p-4 justify-center items-center'}>
					<Text className={'text-lg text-gray-600 text-center'}>
						No active mesocycle.{'\n'}Create one to start working out!
					</Text>
				</View>
			</SafeAreaView>
		);
	}

	const nextWorkout = currentMeso.workouts.find((workout) =>
		workout.sets.some((set) => !set.completed)
	);

	if (!nextWorkout) {
		return (
			<SafeAreaView className={'flex-1'}>
				<View className={'flex-1 bg-white p-4 justify-center items-center'}>
					<Text className={'text-lg text-gray-600 text-center'}>
						All workouts completed in this mesocycle!
					</Text>
				</View>
			</SafeAreaView>
		);
	}

	const exerciseGroups = nextWorkout.sets.reduce((groups, set) => {
		const muscleGroup = getExerciseMuscleGroup(set.exerciseId);
		if (!muscleGroup) return groups;

		if (!groups[muscleGroup]) {
			groups[muscleGroup] = {};
		}
		if (!groups[muscleGroup][set.exerciseId]) {
			groups[muscleGroup][set.exerciseId] = [];
		}
		groups[muscleGroup][set.exerciseId].push(set);
		return groups;
	}, {} as Record<MuscleGroup, Record<string, WorkoutSet[]>>);

	return (
		<SafeAreaView className={'flex-1'}>
			<View className={'flex-1 bg-white'}>
				<ScrollView className={'flex-1'}>
					<View
						className={
							'flex-row justify-between items-center p-4 border-b border-gray-200'
						}
					>
						<Text className={'text-2xl font-bold'}>{currentMeso.name}</Text>
						<TouchableOpacity
							className={'p-2 rounded-lg bg-gray-100'}
							onPress={() => setCalendarVisible(true)}
						>
							<Calendar size={24} color='#4B5563' />
						</TouchableOpacity>
						<WorkoutCalendarModal
							visible={calendarVisible}
							onClose={() => setCalendarVisible(false)}
							mesocycle={currentMeso}
							currentWorkoutId={nextWorkout?.id}
							onSelectWorkout={(workoutId) => {
								// TODO: Add navigation between workouts
								// This will require a new store action to set the current workout
							}}
						/>
					</View>

					{Object.entries(exerciseGroups).map(([muscleGroup, exercises]) => (
						<View key={muscleGroup} className={'mb-6'}>
							<Text
								className={
									'text-lg font-semibold px-4 py-2 bg-gray-50 capitalize'
								}
							>
								{muscleGroup}
							</Text>

							{Object.entries(exercises).map(([exerciseId, sets]) => (
								<ExerciseSetList
									key={exerciseId}
									exerciseId={exerciseId}
									sets={sets}
									workoutId={nextWorkout.id}
								/>
							))}
						</View>
					))}
				</ScrollView>
			</View>
		</SafeAreaView>
	);
}
