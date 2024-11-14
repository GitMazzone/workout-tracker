import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { PartyPopper, ChevronRight, XCircle } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WorkoutDay } from '@/store/workout';
import { Confetti } from './Confetti';

interface Props {
	visible: boolean;
	workout: WorkoutDay;
	onNext: () => void;
	onViewStats: () => void;
}

export const WorkoutCompleteModal = ({
	visible,
	workout,
	onNext,
	onViewStats,
}: Props) => {
	const insets = useSafeAreaInsets();
	const isAllSkipped = workout.sets.every((s) => s.skipped);
	const completedSets = workout.sets.filter(
		(s) => s.completed && !s.skipped
	).length;
	const completedExercises = new Set(
		workout.sets
			.filter((s) => s.completed && !s.skipped)
			.map((s) => s.exerciseId)
	).size;

	return (
		<Modal visible={visible} animationType='none' transparent={true}>
			<View className={'flex-1 justify-end bg-black/50'}>
				<View
					className={'bg-white rounded-t-xl px-4 pt-6'}
					style={{ paddingBottom: insets.bottom + 16 }}
				>
					<View className={'items-center mb-6'}>
						{isAllSkipped ? (
							<>
								<XCircle size={40} color={'#6B7280'} className={'mb-2'} />
								<Text className={'text-2xl font-bold'}>Workout Skipped</Text>
							</>
						) : (
							<>
								<PartyPopper size={40} color={'#22C55E'} className={'mb-2'} />
								<Confetti />
								<Text className={'text-2xl font-bold'}>Workout Complete!</Text>
								<View className={'mt-4 items-center'}>
									<Text className={'text-gray-600 text-lg'}>
										{completedSets} sets completed
									</Text>
									<Text className={'text-gray-600 text-lg'}>
										{completedExercises} exercises done
									</Text>
								</View>
							</>
						)}
					</View>

					<View className={'space-y-3'}>
						<TouchableOpacity
							onPress={onViewStats}
							className={'bg-gray-100 rounded-lg py-3'}
						>
							<Text className={'text-center text-base font-medium'}>
								View Program Stats
							</Text>
						</TouchableOpacity>

						<TouchableOpacity
							onPress={onNext}
							className={
								'bg-sky-600 rounded-lg py-3 flex-row items-center justify-center'
							}
						>
							<Text className={'text-white text-base font-medium mr-1'}>
								Next Workout
							</Text>
							<ChevronRight size={20} color={'#fff'} />
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</Modal>
	);
};
