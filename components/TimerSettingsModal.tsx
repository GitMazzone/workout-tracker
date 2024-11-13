import {
	View,
	Text,
	TouchableOpacity,
	Modal,
	Switch,
	TextInput,
} from 'react-native';
import { X } from 'lucide-react-native';
import { useTimerSettings } from '@/store/timerSettings';
import { useState } from 'react';

interface TimerSettingsModalProps {
	isVisible: boolean;
	onClose: () => void;
}

const NotificationTypes = [
	{ label: 'Vibrate', value: 'vibrate' },
	{ label: 'Sound', value: 'sound' },
	{ label: 'Both', value: 'both' },
	{ label: 'None', value: 'none' },
] as const;

export const TimerSettingsModal = ({
	isVisible,
	onClose,
}: TimerSettingsModalProps) => {
	const {
		defaultTime,
		notification,
		autoStart,
		setDefaultTime,
		setNotification,
		setAutoStart,
	} = useTimerSettings();

	const [timeInput, setTimeInput] = useState(defaultTime.toString());

	return (
		<Modal
			animationType={'none'}
			transparent={true}
			visible={isVisible}
			onRequestClose={onClose}
		>
			<View className={'flex-1 justify-center items-center'}>
				<View className={'bg-black/50 absolute inset-0'} />
				<View className={'bg-white rounded-lg mx-4 w-full max-w-sm'}>
					<View className={'p-4 border-b border-gray-200'}>
						<View className={'flex-row justify-between items-center'}>
							<Text className={'text-xl font-semibold'}>Timer Settings</Text>
							<TouchableOpacity onPress={onClose}>
								<X size={24} color={'#666666'} />
							</TouchableOpacity>
						</View>
					</View>

					<View className={'p-4 space-y-4'}>
						<View className={'flex-row justify-between items-center'}>
							<Text className={'text-base'}>Auto-start Timer</Text>
							<Switch value={autoStart} onValueChange={setAutoStart} />
						</View>

						<View className={'flex-row justify-between items-center'}>
							<Text className={'text-base'}>Default Rest Time (seconds)</Text>
							<TextInput
								className={
									'border border-gray-200 rounded px-3 py-1 w-20 text-right'
								}
								keyboardType='number-pad'
								value={timeInput}
								onChangeText={setTimeInput}
								onBlur={() => {
									const time = parseInt(timeInput);
									if (!isNaN(time) && time > 0) {
										setDefaultTime(time);
									} else {
										setTimeInput(defaultTime.toString());
									}
								}}
							/>
						</View>

						<View className={'space-y-2'}>
							<Text className={'text-base'}>Timer Notification</Text>
							<View className={'flex-row flex-wrap gap-2'}>
								{NotificationTypes.map((type) => (
									<TouchableOpacity
										key={type.value}
										onPress={() => setNotification(type.value)}
										className={`px-4 py-2 rounded-lg ${
											notification === type.value ? 'bg-sky-600' : 'bg-gray-100'
										}`}
									>
										<Text
											className={`${
												notification === type.value
													? 'text-white'
													: 'text-gray-900'
											}`}
										>
											{type.label}
										</Text>
									</TouchableOpacity>
								))}
							</View>
						</View>
					</View>

					<TouchableOpacity
						onPress={onClose}
						className={'border-t border-gray-200 p-4'}
					>
						<Text className={'text-center text-sky-600 font-medium'}>Done</Text>
					</TouchableOpacity>
				</View>
			</View>
		</Modal>
	);
};
