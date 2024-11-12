import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Stack, router } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import { TEMPLATES } from '@/constants/templates';

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
