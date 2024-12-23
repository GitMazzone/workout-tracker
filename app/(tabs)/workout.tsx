import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWorkoutStore, WorkoutSet } from '@/store/workout';
import { EXERCISES } from '@/constants/exercises';
import { MuscleGroup } from '@/store/types';
import { Calendar } from 'lucide-react-native';
import { ExerciseSetList } from '@/components/ExerciseSetList';
import { WorkoutCalendarModal } from '@/components/WorkoutCalendarModal';
import { WorkoutCompleteModal } from '@/components/WorkoutCompleteModal';
import { useState, useEffect, useRef } from 'react';
import { RestTimer, RestTimerRef } from '@/components/RestTimer';
import Toast from 'react-native-toast-message';

const getExerciseMuscleGroup = (exerciseId: string): MuscleGroup | null => {
	const exercise = EXERCISES.find((e) => e.id === exerciseId);
	return exercise?.muscleGroups[0] || null;
};

export default function WorkoutScreen() {
	const [calendarVisible, setCalendarVisible] = useState(false);
	const [completionVisible, setCompletionVisible] = useState(false);
	const {
		mesocycles,
		activeMesocycle,
		currentWorkoutId,
		setCurrentWorkout,
		navigateWorkout,
	} = useWorkoutStore();

	const currentMeso = mesocycles.find((m) => m.id === activeMesocycle);
	const timerRef = useRef<RestTimerRef>(null);

	useEffect(() => {
		if (
			currentMeso &&
			(!currentWorkoutId ||
				!currentMeso.workouts.find((w) => w.id === currentWorkoutId))
		) {
			const nextIncomplete = currentMeso.workouts.find((w) =>
				w.sets.some((s) => !s.completed)
			);
			if (nextIncomplete) {
				setCurrentWorkout(nextIncomplete.id);
			} else {
				setCurrentWorkout(currentMeso.workouts[0].id);
			}
		}
	}, [currentMeso, currentWorkoutId]);

	// Check for workout completion after every set
	useEffect(() => {
		if (currentMeso && currentWorkoutId) {
			const workout = currentMeso.workouts.find(
				(w) => w.id === currentWorkoutId
			);
			if (workout && workout.sets.every((s) => s.completed)) {
				setCompletionVisible(true);
			}
		}
	}, [currentMeso, currentWorkoutId]);

	const handleNextWorkout = () => {
		navigateWorkout('next');
		setCompletionVisible(false);
	};

	const handleViewStats = () => {
		Toast.show({
			type: 'info',
			text1: 'Coming soon',
			text2: 'Program stats will be available in a future update',
		});
	};

	if (!currentMeso) {
		return (
			<SafeAreaView className={'flex-1'} edges={['top']}>
				<View className={'flex-1 bg-white p-4 justify-center items-center'}>
					<Text className={'text-lg text-gray-600 text-center'}>
						No active mesocycle.{'\n'}Create one to start working out!
					</Text>
				</View>
			</SafeAreaView>
		);
	}

	const workout = currentMeso.workouts.find((w) => w.id === currentWorkoutId);

	if (!workout) {
		return (
			<SafeAreaView className={'flex-1'} edges={['top']}>
				<View className={'flex-1 bg-white p-4 justify-center items-center'}>
					<Text className={'text-lg text-gray-600 text-center'}>
						No workout selected
					</Text>
				</View>
			</SafeAreaView>
		);
	}

	const exerciseGroups = workout.sets.reduce((groups, set) => {
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
		<SafeAreaView className={'flex-1'} edges={['top']}>
			<View className={'flex-1 bg-white'}>
				<ScrollView className={'flex-1'}>
					<View
						className={
							'flex-row justify-between items-center p-4 border-b border-gray-200'
						}
					>
						<Text
							className={'text-xl font-bold max-w-[60%] truncate'}
							numberOfLines={1}
						>
							{currentMeso.name}
						</Text>
						<View className={'flex-row gap-2'}>
							<TouchableOpacity
								className={
									'p-2 rounded-lg bg-gray-100 flex items-center justify-center'
								}
								onPress={() => {
									Alert.alert(
										'Skip Workout',
										'Are you sure you want to skip this workout? \nThis will mark all sets as completed and skipped.',
										[
											{ text: 'Cancel', style: 'cancel' },
											{
												text: 'Skip workout',
												style: 'destructive',
												onPress: () => {
													useWorkoutStore.getState().skipWorkout(workout.id);
												},
											},
										]
									);
								}}
							>
								<Text className={'text-gray-600'}>Skip workout</Text>
							</TouchableOpacity>
							<TouchableOpacity
								className={'p-2 rounded-lg bg-gray-100'}
								onPress={() => setCalendarVisible(true)}
							>
								<Calendar size={24} color={'#4B5563'} />
							</TouchableOpacity>
						</View>
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
									workoutId={workout.id}
									onSetComplete={() => timerRef.current?.startTimer()}
								/>
							))}
						</View>
					))}
				</ScrollView>

				<RestTimer ref={timerRef} />

				<WorkoutCalendarModal
					visible={calendarVisible}
					onClose={() => setCalendarVisible(false)}
					mesocycle={currentMeso}
					currentWorkoutId={workout.id}
					onSelectWorkout={(workoutId) => {
						setCurrentWorkout(workoutId);
						setCalendarVisible(false);
					}}
				/>

				<WorkoutCompleteModal
					visible={completionVisible}
					workout={workout}
					onNext={handleNextWorkout}
					onViewStats={handleViewStats}
				/>
			</View>
		</SafeAreaView>
	);
}
