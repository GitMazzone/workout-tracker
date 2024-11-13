import {
	View,
	Text,
	TouchableOpacity,
	Modal,
	Alert,
	TouchableWithoutFeedback,
	Switch,
} from 'react-native';
import { Download, Upload, X } from 'lucide-react-native';
import { useWorkoutStore } from '@/store/workout';
import { useTimerSettings } from '@/store/timerSettings';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import Toast from 'react-native-toast-message';
import { validateImportData } from './utils/validateImportData';
import { DATA_VERSION } from '@/config/app';

interface SettingsModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export const SettingsModal = ({ isOpen, onClose }: SettingsModalProps) => {
	const { isEnabled, setEnabled } = useTimerSettings();

	const handleExportData = async () => {
		try {
			const mesocycles = useWorkoutStore.getState().mesocycles;
			const exportData = {
				version: DATA_VERSION,
				timestamp: new Date().toISOString(),
				data: mesocycles,
			};

			const fileUri = `${FileSystem.documentDirectory}workout-data.json`;
			await FileSystem.writeAsStringAsync(
				fileUri,
				JSON.stringify(exportData, null, 2),
				{
					encoding: FileSystem.EncodingType.UTF8,
				}
			);

			const canShare = await Sharing.isAvailableAsync();
			if (canShare) {
				await Sharing.shareAsync(fileUri, {
					mimeType: 'application/json',
					dialogTitle: 'Export Workout Data',
					UTI: 'public.json',
				});
				Toast.show({
					type: 'success',
					text1: 'Data exported successfully',
					position: 'top',
					topOffset: 100,
				});
			} else {
				Toast.show({
					type: 'error',
					text1: 'Sharing not available',
					text2: 'This device does not support sharing',
					position: 'top',
					topOffset: 100,
				});
			}
		} catch (error) {
			Toast.show({
				type: 'error',
				text1: 'Export failed',
				text2: 'Please try again',
				position: 'top',
				topOffset: 100,
			});
		}
	};

	const handleImportData = async () => {
		try {
			const result = await DocumentPicker.getDocumentAsync({
				type: ['application/json'],
			});

			if (result.assets?.[0]) {
				Alert.alert(
					'Import Data',
					'This will replace all your existing workout data. Are you sure?',
					[
						{
							text: 'Cancel',
							style: 'cancel',
						},
						{
							text: 'Import',
							style: 'destructive',
							onPress: async () => {
								try {
									const fileContent = await FileSystem.readAsStringAsync(
										result.assets[0].uri
									);
									const importData = JSON.parse(fileContent);

									const validatedData = validateImportData(importData);
									if (validatedData) {
										useWorkoutStore.setState({ mesocycles: validatedData });
										Toast.show({
											type: 'success',
											text1: 'Data imported successfully',
											position: 'top',
											topOffset: 100,
										});
										onClose();
									} else {
										Toast.show({
											type: 'error',
											text1: 'Invalid data format',
											text2: 'Please check the file and try again',
											position: 'top',
											topOffset: 100,
										});
									}
								} catch (error) {
									Toast.show({
										type: 'error',
										text1: 'Import failed',
										text2: 'Please try again',
										position: 'top',
										topOffset: 100,
									});
								}
							},
						},
					]
				);
			}
		} catch (error) {
			Toast.show({
				type: 'error',
				text1: 'Import failed',
				text2: 'Please try again',
				position: 'top',
				topOffset: 100,
			});
		}
	};

	return (
		<Modal
			animationType={'slide'}
			transparent={true}
			visible={isOpen}
			onRequestClose={onClose}
		>
			<TouchableWithoutFeedback onPress={onClose}>
				<View className={'flex-1 justify-end'}>
					<View className={'bg-black/50 absolute inset-0'} />
					<View className={'bg-white rounded-t-xl'}>
						<View
							className={
								'flex-row justify-between items-center p-4 border-b border-t-2 border-gray-200'
							}
						>
							<Text className={'text-xl font-semibold'}>Settings</Text>
							<TouchableOpacity onPress={onClose} className={'p-2'}>
								<X size={24} color={'#666666'} />
							</TouchableOpacity>
						</View>

						<View className={'p-4 pb-14'}>
							<View className={''}>
								<View className={'flex-row justify-between items-center mb-4'}>
									<Text className={'text-base'}>Enable Rest Timer</Text>
									<Switch value={isEnabled} onValueChange={setEnabled} />
								</View>
							</View>

							<View className={'space-y-2'}>
								<TouchableOpacity
									className={'flex-row items-center p-4 bg-gray-50 rounded-lg'}
									onPress={handleExportData}
								>
									<Download size={20} color={'#0284c7'} />
									<Text className={'ml-3 text-base'}>Export your data</Text>
								</TouchableOpacity>

								<TouchableOpacity
									className={'flex-row items-center p-4 bg-gray-50 rounded-lg'}
									onPress={handleImportData}
								>
									<Upload size={20} color={'#0284c7'} />
									<Text className={'ml-3 text-base'}>Import data</Text>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				</View>
			</TouchableWithoutFeedback>
		</Modal>
	);
};
