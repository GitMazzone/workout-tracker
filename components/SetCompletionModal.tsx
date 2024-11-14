import { View, Text, TouchableOpacity, Modal, TextInput } from 'react-native';
import { X } from 'lucide-react-native';
import { useState } from 'react';
import { WorkoutSet } from '@/store/workout';

interface Props {
	visible: boolean;
	onClose: () => void;
	set: WorkoutSet;
	exerciseName: string;
	setNumber: number;
	onComplete: (weight: number, reps: number) => void;
	onSkip: () => void;
}

export default function SetCompletionModal({
	visible,
	onClose,
	set,
	exerciseName,
	setNumber,
	onComplete,
	onSkip,
}: Props) {
	const [weight, setWeight] = useState(set.weight?.toString() || '');
	const [reps, setReps] = useState(set.targetReps.toString());

	const handleComplete = () => {
		const weightNum = parseFloat(weight);
		const repsNum = parseInt(reps);

		if (isNaN(weightNum) || isNaN(repsNum)) return;

		onComplete(weightNum, repsNum);
		onClose();
	};

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
					<View>
						<Text className={'text-xl font-semibold'}>{exerciseName}</Text>
						<Text className={'text-gray-600'}>Set {setNumber}</Text>
					</View>
					<TouchableOpacity onPress={onClose}>
						<X size={24} color='#000' />
					</TouchableOpacity>
				</View>

				<View className={'p-4'}>
					<View className={'mb-6'}>
						<Text className={'text-base font-medium mb-2'}>Weight (lbs)</Text>
						<TextInput
							className={'p-3 border border-gray-300 rounded-lg text-lg'}
							value={weight}
							onChangeText={setWeight}
							keyboardType='decimal-pad'
							placeholder='Enter weight'
						/>
					</View>

					<View className={'mb-6'}>
						<Text className={'text-base font-medium mb-2'}>
							Reps (Target: {set.targetReps})
						</Text>
						<TextInput
							className={'p-3 border border-gray-300 rounded-lg text-lg'}
							value={reps}
							onChangeText={setReps}
							keyboardType='number-pad'
							placeholder='Enter reps'
						/>
					</View>

					<TouchableOpacity
						className={'bg-sky-600 px-6 py-3 rounded-lg mb-3'}
						onPress={handleComplete}
					>
						<Text className={'text-white text-base font-semibold text-center'}>
							Complete Set
						</Text>
					</TouchableOpacity>

					<TouchableOpacity
						className={'bg-gray-200 px-6 py-3 rounded-lg'}
						onPress={onSkip}
					>
						<Text
							className={'text-gray-700 text-base font-semibold text-center'}
						>
							Skip Set
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		</Modal>
	);
}
