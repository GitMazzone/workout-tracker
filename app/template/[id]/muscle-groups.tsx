import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { useState } from 'react';
import { MuscleGroup } from '@/store/types';
import { TEMPLATES } from '@/constants/templates';
import { ChevronRight } from 'lucide-react-native';

const MUSCLE_GROUPS: MuscleGroup[] = [
	'chest',
	'back',
	'shoulders',
	'biceps',
	'triceps',
	'legs',
	'calves',
	'core',
];

export default function MuscleGroupSelection() {
	const { id, weeks, days } = useLocalSearchParams<{
		id: string;
		weeks: string;
		days: string;
	}>();
	const [selectedGroups, setSelectedGroups] = useState<{
		[key: number]: MuscleGroup[];
	}>({});
	const [activeDay, setActiveDay] = useState(0);

	const handleToggleMuscleGroup = (muscleGroup: MuscleGroup) => {
		setSelectedGroups((prev) => {
			const currentDay = prev[activeDay] || [];
			const updated = currentDay.includes(muscleGroup)
				? currentDay.filter((mg) => mg !== muscleGroup)
				: [...currentDay, muscleGroup];

			return {
				...prev,
				[activeDay]: updated,
			};
		});
	};

	const handleContinue = () => {
		// Validate at least one muscle group per day
		const hasEmptyDays = Array.from({ length: Number(days) }, (_, i) => i).some(
			(day) => !selectedGroups[day]?.length
		);

		if (hasEmptyDays) {
			Alert.alert(
				'Missing Muscle Groups',
				'Please select at least one muscle group for each day'
			);
			return;
		}

		router.push({
			pathname: '/template/[id]/exercises',
			params: {
				id,
				weeks,
				days,
				muscleGroups: JSON.stringify(selectedGroups),
			},
		});
	};

	return (
		<View className={'flex-1 bg-white'}>
			<Stack.Screen
				options={{
					title: 'Select Muscle Groups',
					headerShadowVisible: false,
				}}
			/>

			<ScrollView
				horizontal
				showsHorizontalScrollIndicator={false}
				className={'py-2 mx-auto border-b border-gray-200 max-h-14'}
			>
				{Array.from({ length: Number(days) }, (_, i) => (
					<TouchableOpacity
						key={i}
						className={`px-4 py-2 rounded-lg mr-2 ${
							activeDay === i ? 'bg-sky-600' : 'bg-gray-100'
						}`}
						onPress={() => setActiveDay(i)}
					>
						<Text
							className={`font-medium ${
								activeDay === i ? 'text-white' : 'text-gray-900'
							}`}
						>
							Day {i + 1}
						</Text>
					</TouchableOpacity>
				))}
			</ScrollView>

			<ScrollView className={'flex-1 p-4'}>
				<Text className={'text-base text-gray-600 mb-4'}>
					Select muscle groups to work on Day {activeDay + 1}:
				</Text>

				{MUSCLE_GROUPS.map((muscleGroup) => {
					const isSelected = selectedGroups[activeDay]?.includes(muscleGroup);

					return (
						<TouchableOpacity
							key={muscleGroup}
							className={`flex-row items-center p-4 mb-3 rounded-lg border ${
								isSelected
									? 'bg-sky-50 border-sky-200'
									: 'bg-white border-gray-200'
							}`}
							onPress={() => handleToggleMuscleGroup(muscleGroup)}
						>
							<Text
								className={`flex-1 text-lg font-medium capitalize ${
									isSelected ? 'text-sky-900' : 'text-gray-900'
								}`}
							>
								{muscleGroup}
							</Text>
							{isSelected && <ChevronRight size={20} color={'#0284c7'} />}
						</TouchableOpacity>
					);
				})}

				<TouchableOpacity
					className={'bg-sky-600 px-6 py-3 rounded-lg mt-4 mb-6'}
					onPress={handleContinue}
				>
					<Text className={'text-white text-base font-semibold text-center'}>
						Continue to Exercise Selection
					</Text>
				</TouchableOpacity>
			</ScrollView>
		</View>
	);
}
