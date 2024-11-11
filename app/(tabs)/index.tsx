// app/(tabs)/index.tsx
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useWorkoutStore } from '@/store/workoutStore';

export default function Home() {
	// Get both the mesocycles and the store itself for direct action calls
	const mesocycles = useWorkoutStore((state) => state.mesocycles);
	const setActiveMesocycle = useWorkoutStore(
		(state) => state.setActiveMesocycle
	);

	if (mesocycles.length === 0) {
		return (
			<SafeAreaView className={'flex-1'}>
				<View className={'flex-1 p-4 bg-white'}>
					<View className={'flex-1 justify-center items-center'}>
						<Text className={'text-2xl font-bold mb-2 text-center'}>
							Welcome to your workout tracker
						</Text>
						<Text className={'text-base text-gray-600 mb-6 text-center'}>
							Start by creating your first mesocycle
						</Text>
						<TouchableOpacity
							className={'bg-sky-600 px-6 py-3 rounded-lg'}
							onPress={() => router.push('/templates')}
						>
							<Text className={'text-white text-base font-semibold'}>
								Add Meso
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView className={'flex-1'}>
			<ScrollView className={'flex-1 p-4 bg-white'}>
				{mesocycles.map((meso) => (
					<TouchableOpacity
						key={meso.id}
						className={
							'bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm'
						}
						onPress={() => {
							setActiveMesocycle(meso.id);
							router.push('/(tabs)/workout');
						}}
					>
						<Text className={'text-lg font-semibold mb-1'}>{meso.name}</Text>
						<Text className={'text-gray-600'}>
							{meso.weeks} weeks • {Object.keys(meso.template).length}{' '}
							workouts/week
						</Text>
					</TouchableOpacity>
				))}

				<TouchableOpacity
					className={'bg-sky-600 px-6 py-3 rounded-lg mt-4 mb-4'}
					onPress={() => router.push('/templates')}
				>
					<Text className={'text-white text-base font-semibold text-center'}>
						Add New Mesocycle
					</Text>
				</TouchableOpacity>
			</ScrollView>
		</SafeAreaView>
	);
}
