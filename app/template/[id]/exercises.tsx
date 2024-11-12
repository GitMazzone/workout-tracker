import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { TEMPLATES } from '@/constants/templates';
import { useState, useMemo } from 'react';
import ExercisePickerModal from '@/components/ExercisePickerModal';
import { MuscleGroup } from '@/store/types';
import { EXERCISES } from '@/constants/exercises';
import { useWorkoutStore, MesocycleTemplate } from '@/store/workout';

const autoSelectExercises = (
	muscleGroupsByDay: { [key: number]: MuscleGroup[] },
	days: number
) => {
	const selections: { [key: string]: string } = {};

	Array.from({ length: days }, (_, dayIndex) => {
		const muscleGroups = muscleGroupsByDay[dayIndex] || [];

		muscleGroups.forEach((muscleGroup) => {
			const availableExercises = EXERCISES.filter((e) =>
				e.muscleGroups.includes(muscleGroup)
			);

			if (availableExercises.length > 0) {
				const randomExercise =
					availableExercises[
						Math.floor(Math.random() * availableExercises.length)
					];
				selections[`${dayIndex}-${muscleGroup}`] = randomExercise.id;
			}
		});
	});

	return selections;
};

interface DayTabProps {
	day: number;
	isActive: boolean;
	onPress: () => void;
}

function DayTab({ day, isActive, onPress }: DayTabProps) {
	return (
		<TouchableOpacity
			onPress={onPress}
			className={`px-4 py-2 rounded-lg mr-2 ${
				isActive ? 'bg-sky-600' : 'bg-gray-100'
			}`}
		>
			<Text
				className={`font-medium ${isActive ? 'text-white' : 'text-gray-900'}`}
			>
				Day {day + 1}
			</Text>
		</TouchableOpacity>
	);
}

export default function ExerciseSelection() {
	const {
		id,
		weeks,
		days,
		muscleGroups: muscleGroupsParam,
	} = useLocalSearchParams<{
		id: string;
		weeks: string;
		days: string;
		muscleGroups?: string;
	}>();
	const [activeDay, setActiveDay] = useState(0);
	const [selectedMuscleGroup, setSelectedMuscleGroup] =
		useState<MuscleGroup | null>(null);
	const [selectedExercises, setSelectedExercises] = useState<{
		[key: string]: string;
	}>({});

	const template = TEMPLATES.find((t) => t.id === id);

	// Handle both preset templates and custom muscle groups
	const muscleGroupsByDay = useMemo(() => {
		if (template?.isCustom && muscleGroupsParam) {
			try {
				return JSON.parse(muscleGroupsParam);
			} catch {
				return {};
			}
		}
		return template?.muscleGroups || {};
	}, [template, muscleGroupsParam]);

	const muscleGroups = muscleGroupsByDay[activeDay] || [];

	const handleSelectExercise = (exerciseId: string) => {
		if (selectedMuscleGroup) {
			const key = `${activeDay}-${selectedMuscleGroup}`;
			setSelectedExercises((prev) => ({
				...prev,
				[key]: exerciseId,
			}));
		}
	};

	const handleAutoFill = () => {
		const autoSelected = autoSelectExercises(muscleGroupsByDay, Number(days));
		setSelectedExercises(autoSelected);
	};

	const handleCreate = () => {
		const requiredExercises = Array.from(
			{ length: Number(days) },
			(_, dayIndex) => {
				const dayMuscleGroups = muscleGroupsByDay[dayIndex] || [];
				return dayMuscleGroups.map(
					(group: MuscleGroup) => `${dayIndex}-${group}`
				);
			}
		).flat();

		const missingExercises = requiredExercises.filter(
			(key) => !selectedExercises[key]
		);

		if (missingExercises.length > 0) {
			Alert.alert(
				'Missing Exercises',
				'Please select exercises for all muscle groups before continuing.'
			);
			return;
		}

		// Create mesocycle with either custom or template name
		const mesocycleTemplate: MesocycleTemplate = {
			name: template?.isCustom
				? 'Custom Program'
				: template?.name || 'Workout Program',
			weeks: Number(weeks),
			days: Number(days),
			exercises: selectedExercises,
		};

		useWorkoutStore.getState().createMesocycle(mesocycleTemplate);
		router.replace('/(tabs)');
	};

	return (
		<View className={'flex-1 bg-white'}>
			<Stack.Screen
				options={{
					title: 'Select Exercises',
					headerShadowVisible: false,
				}}
			/>

			<ScrollView
				horizontal
				showsHorizontalScrollIndicator={false}
				className={'py-2 mx-auto border-b border-gray-200 max-h-14'}
			>
				{Array.from({ length: Number(days) }, (_, i) => (
					<DayTab
						key={i}
						day={i}
						isActive={activeDay === i}
						onPress={() => setActiveDay(i)}
					/>
				))}
			</ScrollView>

			<ScrollView className={'flex-1 p-4'}>
				{muscleGroups.map((muscleGroup: MuscleGroup) => {
					const key = `${activeDay}-${muscleGroup}`;
					const exerciseId = selectedExercises[key];
					const exercise = EXERCISES.find((e) => e.id === exerciseId);

					return (
						<TouchableOpacity
							key={muscleGroup}
							className={'bg-white border border-gray-200 rounded-lg p-4 mb-4'}
							onPress={() => setSelectedMuscleGroup(muscleGroup)}
						>
							<Text className={'text-lg font-semibold mb-1 capitalize'}>
								{muscleGroup}
							</Text>
							{exercise ? (
								<Text className={'text-gray-600'}>{exercise.name}</Text>
							) : (
								<Text className={'text-gray-600'}>
									Select exercise for {muscleGroup}
								</Text>
							)}
						</TouchableOpacity>
					);
				})}

				<View className={'flex-row gap-2 mt-2 mb-6'}>
					<TouchableOpacity
						className={'flex-1 bg-gray-200 px-6 py-3 rounded-lg'}
						onPress={handleAutoFill}
					>
						<Text
							className={'text-gray-800 text-base font-semibold text-center'}
						>
							Auto-fill Exercises
						</Text>
					</TouchableOpacity>

					<TouchableOpacity
						className={'flex-1 bg-sky-600 px-6 py-3 rounded-lg'}
						onPress={handleCreate}
					>
						<Text className={'text-white text-base font-semibold text-center'}>
							Create Mesocycle
						</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>

			<ExercisePickerModal
				visible={!!selectedMuscleGroup}
				onClose={() => setSelectedMuscleGroup(null)}
				muscleGroup={selectedMuscleGroup!}
				onSelectExercise={handleSelectExercise}
			/>
		</View>
	);
}
