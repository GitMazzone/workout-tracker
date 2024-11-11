import { View, Text, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { Equipment, MuscleGroup } from '@/store/types';
import { X } from 'lucide-react-native';
import { EXERCISES } from '@/constants/exercises';
import { useState } from 'react';

interface Props {
	visible: boolean;
	onClose: () => void;
	muscleGroup: MuscleGroup;
	onSelectExercise: (exerciseId: string) => void;
}

const EQUIPMENT_FILTERS: Equipment[] = [
	'barbell',
	'dumbbell',
	'cable',
	'machine',
	'bodyweight',
];

export default function ExercisePickerModal({
	visible,
	onClose,
	muscleGroup,
	onSelectExercise,
}: Props) {
	const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(
		null
	);

	const filteredExercises = EXERCISES.filter((exercise) => {
		const matchesMuscleGroup = exercise.muscleGroups.includes(muscleGroup);
		const matchesEquipment =
			!selectedEquipment || exercise.equipment === selectedEquipment;
		return matchesMuscleGroup && matchesEquipment;
	});

	return (
		<Modal
			visible={visible}
			animationType='slide'
			presentationStyle='pageSheet'
		>
			<View className={'flex-1 bg-white'}>
				<View
					className={
						'flex-row items-center justify-between p-4 border-b border-gray-200'
					}
				>
					<Text className={'text-xl font-semibold capitalize'}>
						{muscleGroup} Exercises
					</Text>
					<TouchableOpacity onPress={onClose}>
						<X size={24} color='#000' />
					</TouchableOpacity>
				</View>

				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={false}
					className={'py-2 px-4 border-b border-gray-200 max-h-14'}
				>
					<TouchableOpacity
						className={`px-4 py-2 rounded-lg mr-2 ${
							!selectedEquipment ? 'bg-sky-600' : 'bg-gray-100'
						}`}
						onPress={() => setSelectedEquipment(null)}
					>
						<Text
							className={`font-medium ${
								!selectedEquipment ? 'text-white' : 'text-gray-900'
							}`}
						>
							All
						</Text>
					</TouchableOpacity>
					{EQUIPMENT_FILTERS.map((equipment) => (
						<TouchableOpacity
							key={equipment}
							className={`px-4 py-2 rounded-lg mr-2 ${
								selectedEquipment === equipment ? 'bg-sky-600' : 'bg-gray-100'
							}`}
							onPress={() => setSelectedEquipment(equipment)}
						>
							<Text
								className={`font-medium capitalize ${
									selectedEquipment === equipment
										? 'text-white'
										: 'text-gray-900'
								}`}
							>
								{equipment}
							</Text>
						</TouchableOpacity>
					))}
				</ScrollView>

				<ScrollView className={'flex-1 p-4'}>
					{filteredExercises.map((exercise) => (
						<TouchableOpacity
							key={exercise.id}
							className={
								'flex-row items-center p-4 mb-3 bg-white border border-gray-200 rounded-lg'
							}
							onPress={() => {
								onSelectExercise(exercise.id);
								onClose();
							}}
						>
							<View className={'flex-1'}>
								<Text className={'text-lg font-semibold mb-1'}>
									{exercise.name}
								</Text>
								<Text className={'text-gray-600 capitalize'}>
									{exercise.equipment}
								</Text>
							</View>
						</TouchableOpacity>
					))}
				</ScrollView>
			</View>
		</Modal>
	);
}
