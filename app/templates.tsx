import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Stack, router } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';

const TEMPLATES = [
	{
		id: 'upper-lower',
		name: 'Upper/Lower Split',
		description:
			'4-6 workouts per week, alternating upper and lower body focus',
		defaultDays: 4,
	},
	{
		id: 'push-pull-legs',
		name: 'Push/Pull/Legs',
		description:
			'3-6 workouts per week, rotating push, pull, and leg exercises',
		defaultDays: 6,
	},
	{
		id: 'full-body',
		name: 'Full Body',
		description: '3-4 full body workouts per week with balanced muscle focus',
		defaultDays: 3,
	},
];

export default function Templates() {
	return (
		<View className={'flex-1 bg-white'}>
			<Stack.Screen
				options={{
					title: 'Choose Template',
					headerShadowVisible: false,
				}}
			/>
			<ScrollView className={'flex-1 p-4'}>
				{TEMPLATES.map((template) => (
					<TouchableOpacity
						key={template.id}
						className={
							'flex-row items-center p-4 mb-4 bg-white border border-gray-200 rounded-lg'
						}
						onPress={() =>
							router.push({
								pathname: '/template/[id]',
								params: { id: template.id },
							})
						}
					>
						<View className={'flex-1'}>
							<Text className={'text-lg font-semibold mb-1'}>
								{template.name}
							</Text>
							<Text className={'text-gray-600'}>{template.description}</Text>
						</View>
						<ChevronRight className={'ml-2'} size={20} color={'#666'} />
					</TouchableOpacity>
				))}
			</ScrollView>
		</View>
	);
}
