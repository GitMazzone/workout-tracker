import { EXERCISES } from '@/constants/exercises';
import { replaceExercise, useWorkoutStore, WorkoutSet } from '@/store/workout';
import {
	Trash2,
	Check,
	Plus,
	MoreVertical,
	XCircle,
	Replace,
	X,
} from 'lucide-react-native';
import {
	View,
	TouchableOpacity,
	TextInput,
	Text,
	Alert,
	Modal,
} from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { Dimensions } from 'react-native';
import ExercisePickerModal from './ExercisePickerModal';

interface Props {
	exerciseId: string;
	sets: WorkoutSet[];
	workoutId: string;
	onSetComplete?: () => void;
}

export const ExerciseSetList = ({
	exerciseId,
	sets,
	workoutId,
	onSetComplete,
}: Props) => {
	const {
		completeSet,
		deleteSet,
		addSet,
		undoSetCompletion,
		updateSetWeight,
		updateSetReps,
	} = useWorkoutStore();

	const [isMenuVisible, setIsMenuVisible] = useState(false);
	const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });
	const buttonRef = useRef<TouchableOpacity>(null);
	const exercise = EXERCISES.find((e) => e.id === exerciseId);
	const [inputValues, setInputValues] = useState<{
		[key: string]: { weight: string; reps: string };
	}>({});

	const handleMenuPress = () => {
		buttonRef.current?.measureInWindow((x, y, width, height) => {
			setMenuPosition({
				top: y + height,
				right: Dimensions.get('window').width - (x + width),
			});
			setIsMenuVisible(true);
		});
	};

	const handleSkipIncomplete = () => {
		Alert.alert(
			'Skip Incomplete Sets',
			'Are you sure you want to skip all incomplete sets for this exercise?',
			[
				{ text: 'Cancel', style: 'cancel' },
				{
					text: 'Skip',
					style: 'destructive',
					onPress: () => {
						sets.forEach((set, index) => {
							if (!set.completed) {
								completeSet(workoutId, exerciseId, index, 0, 0);
								const key = `${exerciseId}-${index}`;
								setInputValues((prev) => ({
									...prev,
									[key]: { weight: '0', reps: '0' },
								}));
							}
						});
						setIsMenuVisible(false);
					},
				},
			]
		);
	};

	const [isPickerVisible, setIsPickerVisible] = useState(false);

	const handleReplaceExercise = () => {
		setIsMenuVisible(false);
		setIsPickerVisible(true);
	};

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

	const handleSetComplete = (
		setIndex: number,
		weight: number,
		reps: number
	) => {
		completeSet(workoutId, exerciseId, setIndex, weight, reps);
		onSetComplete?.();
	};

	return (
		<View className={'p-4 border-b-2 border-gray-100'}>
			<View className={'flex-row justify-between items-center mb-2'}>
				<Text className={'text-lg'}>{exercise.name}</Text>
				<TouchableOpacity
					ref={buttonRef}
					onPress={handleMenuPress}
					className={'p-2'}
				>
					<MoreVertical size={20} color={'#666666'} />
				</TouchableOpacity>
			</View>

			{/* Exercise Menu Modal */}
			<Modal
				transparent
				visible={isMenuVisible}
				animationType={'fade'}
				onRequestClose={() => setIsMenuVisible(false)}
			>
				<TouchableOpacity
					className={'flex-1'}
					onPress={() => setIsMenuVisible(false)}
					activeOpacity={1}
				>
					<View
						className={
							'absolute bg-white rounded-lg shadow-lg border border-gray-200 py-1'
						}
						style={{
							top: menuPosition.top + 4,
							right: menuPosition.right,
						}}
					>
						<TouchableOpacity
							className={'flex-row items-center px-4 py-3'}
							onPress={handleSkipIncomplete}
						>
							<XCircle size={18} color={'#ef4444'} />
							<Text className={'ml-2 text-base'}>Skip Incomplete Sets</Text>
						</TouchableOpacity>
						<TouchableOpacity
							className={'flex-row items-center px-4 py-3'}
							onPress={handleReplaceExercise}
						>
							<Replace size={18} color={'#0284c7'} />
							<Text className={'ml-2 text-base'}>Replace Exercise</Text>
						</TouchableOpacity>
					</View>
				</TouchableOpacity>
			</Modal>

			<ExercisePickerModal
				visible={isPickerVisible}
				onClose={() => setIsPickerVisible(false)}
				muscleGroup={exercise?.muscleGroups[0] || 'chest'}
				onSelectExercise={(newExerciseId) => {
					useWorkoutStore
						.getState()
						.replaceExercise(workoutId, exerciseId, newExerciseId);
					setIsPickerVisible(false);
				}}
			/>

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
							placeholderTextColor='#6B7280'
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
							placeholderTextColor='#6B7280'
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
									handleSetComplete(idx, weight, reps);
								}
							}}
							className={'p-2'}
						>
							<View
								className={`w-6 h-6 rounded border-2 ${
									set.completed
										? set.skipped
											? 'bg-gray-300 border-gray-300'
											: 'bg-green-500 border-green-500'
										: 'border-gray-300'
								} justify-center items-center`}
							>
								{set.completed &&
									(set.skipped ? (
										<X size={16} color='#fff' />
									) : (
										<Check size={16} color='#fff' />
									))}
							</View>
						</TouchableOpacity>
					</View>
				);
			})}

			<TouchableOpacity
				onPress={() => addSet(workoutId, exerciseId)}
				className={
					'flex-row items-center justify-center p-2 mt-2 w-6 h-6 mx-auto'
				}
			>
				<Plus size={24} color={'#22C55E'} />
			</TouchableOpacity>
		</View>
	);
};
