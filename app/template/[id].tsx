import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { useState } from 'react';

const WEEKS_OPTIONS = [4, 5, 6];
const DAYS_OPTIONS = [3, 4, 5, 6];

export default function TemplateDetail() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const [selectedWeeks, setSelectedWeeks] = useState(4);
	const [selectedDays, setSelectedDays] = useState(4);

	return (
		<View className={'flex-1 bg-white'}>
			<Stack.Screen
				options={{
					title: 'Configure Template',
					headerShadowVisible: false,
				}}
			/>
			<ScrollView className={'flex-1 p-4'}>
				<Text className={'text-lg font-semibold mb-4'}>Number of Weeks</Text>
				<View className={'flex-row mb-6'}>
					{WEEKS_OPTIONS.map((weeks) => (
						<TouchableOpacity
							key={weeks}
							className={`flex-1 p-3 rounded-lg mr-2 ${
								selectedWeeks === weeks ? 'bg-sky-600' : 'bg-gray-100'
							}`}
							onPress={() => setSelectedWeeks(weeks)}
						>
							<Text
								className={`text-center font-medium ${
									selectedWeeks === weeks ? 'text-white' : 'text-gray-900'
								}`}
							>
								{weeks}
							</Text>
						</TouchableOpacity>
					))}
				</View>

				<Text className={'text-lg font-semibold mb-4'}>Workouts per Week</Text>
				<View className={'flex-row flex-wrap'}>
					{DAYS_OPTIONS.map((days) => (
						<TouchableOpacity
							key={days}
							className={`w-[48%] p-3 rounded-lg mr-2 mb-2 ${
								selectedDays === days ? 'bg-sky-600' : 'bg-gray-100'
							}`}
							onPress={() => setSelectedDays(days)}
						>
							<Text
								className={`text-center font-medium ${
									selectedDays === days ? 'text-white' : 'text-gray-900'
								}`}
							>
								{days} days
							</Text>
						</TouchableOpacity>
					))}
				</View>

				<TouchableOpacity
					className={'bg-sky-600 px-6 py-3 rounded-lg mt-6'}
					onPress={() =>
						router.push({
							pathname: '/template/[id]/exercises',
							params: { id, weeks: selectedWeeks, days: selectedDays },
						})
					}
				>
					<Text className={'text-white text-base font-semibold text-center'}>
						Continue
					</Text>
				</TouchableOpacity>
			</ScrollView>
		</View>
	);
}
