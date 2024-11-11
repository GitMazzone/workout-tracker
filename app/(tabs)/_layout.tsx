import { Tabs } from 'expo-router';
import { Home, Dumbbell } from 'lucide-react-native';

export default function TabLayout() {
	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: '#0284c7',
				headerShown: false,
			}}
		>
			<Tabs.Screen
				name={'index'}
				options={{
					title: 'Home',
					tabBarIcon: ({ color }) => <Home size={24} color={color} />,
				}}
			/>
			<Tabs.Screen
				name={'workout'}
				options={{
					title: 'Current',
					tabBarIcon: ({ color }) => <Dumbbell size={24} color={color} />,
				}}
			/>
		</Tabs>
	);
}
