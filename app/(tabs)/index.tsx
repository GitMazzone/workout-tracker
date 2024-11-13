import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useWorkoutStore } from '@/store/workout';
import { Settings } from 'lucide-react-native';
import { useState } from 'react';
import { SettingsModal } from '@/components/SettingsModal';
import { MesoMenu } from '@/components/MesoMenu';

export default function Home() {
	const [isSettingsOpen, setIsSettingsOpen] = useState(false);
	const { mesocycles, setActiveMesocycle } = useWorkoutStore();

	if (mesocycles.length === 0) {
		return (
			<SafeAreaView className={'flex-1'} edges={['top']}>
				<View className={'flex-1 p-4 bg-white relative'}>
					<TouchableOpacity
						className={'absolute top-4 right-4 p-2 z-10'}
						onPress={() => setIsSettingsOpen(true)}
					>
						<Settings size={24} color={'#0284c7'} />
					</TouchableOpacity>
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
					<SettingsModal
						isOpen={isSettingsOpen}
						onClose={() => setIsSettingsOpen(false)}
					/>
				</View>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView className={'flex-1'} edges={['top']}>
			<View className={'flex-1 bg-white'}>
				<View
					className={
						'flex-row justify-between items-center p-4 border-b border-gray-200'
					}
				>
					<Text className={'text-2xl font-bold'}>My Programs</Text>
					<TouchableOpacity
						className={'p-2'}
						onPress={() => setIsSettingsOpen(true)}
					>
						<Settings size={24} color={'#0284c7'} />
					</TouchableOpacity>
				</View>

				<ScrollView className={'flex-1 p-4'}>
					{mesocycles.map((meso) => (
						<View
							key={meso.id}
							className={
								'bg-white border border-gray-200 rounded-lg mb-4 shadow-sm'
							}
						>
							<TouchableOpacity
								className={'flex-1 p-4'}
								onPress={() => {
									setActiveMesocycle(meso.id);
									router.push('/(tabs)/workout');
								}}
							>
								<View className={'flex-row justify-between items-start'}>
									<View className={'flex-1 mr-2'}>
										<Text className={'text-lg font-semibold'}>{meso.name}</Text>
										<Text className={'text-gray-600'}>
											{meso.weeks} weeks • {Object.keys(meso.template).length}{' '}
											workouts/week
										</Text>
									</View>
									<MesoMenu mesoId={meso.id} mesoName={meso.name} />
								</View>
							</TouchableOpacity>
						</View>
					))}
				</ScrollView>

				<View className={'p-4'}>
					<TouchableOpacity
						className={'bg-sky-600 px-6 py-4 rounded-lg'}
						onPress={() => router.push('/templates')}
					>
						<Text className={'text-white text-base font-semibold text-center'}>
							Add New Mesocycle
						</Text>
					</TouchableOpacity>
				</View>

				<SettingsModal
					isOpen={isSettingsOpen}
					onClose={() => setIsSettingsOpen(false)}
				/>
			</View>
		</SafeAreaView>
	);
}
