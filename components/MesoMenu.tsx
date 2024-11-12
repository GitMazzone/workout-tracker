import {
	View,
	Text,
	TouchableOpacity,
	Modal,
	TextInput,
	Dimensions,
	Alert,
} from 'react-native';
import { MoreVertical, Edit2, Trash2 } from 'lucide-react-native';
import { useState, useRef } from 'react';
import { useWorkoutStore } from '@/store/workout';
import Toast from 'react-native-toast-message';

interface MesoMenuProps {
	mesoId: string;
	mesoName: string;
}

export const MesoMenu = ({ mesoId, mesoName }: MesoMenuProps) => {
	const [isMenuVisible, setIsMenuVisible] = useState(false);
	const [isEditModalVisible, setIsEditModalVisible] = useState(false);
	const [newName, setNewName] = useState(mesoName);
	const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });
	const buttonRef = useRef<TouchableOpacity>(null);

	const handleMenuPress = () => {
		buttonRef.current?.measureInWindow((x, y, width, height) => {
			setMenuPosition({
				top: y + height,
				right: Dimensions.get('window').width - (x + width),
			});
			setIsMenuVisible(true);
		});
	};

	const confirmDelete = () => {
		Alert.alert(
			'Delete Program',
			'Are you sure you want to delete this program? This action cannot be undone.',
			[
				{
					text: 'Cancel',
					style: 'cancel',
				},
				{
					text: 'Delete',
					style: 'destructive',
					onPress: () => {
						useWorkoutStore.getState().deleteMesocycle(mesoId);
						Toast.show({
							type: 'success',
							text1: 'Program deleted',
						});
					},
				},
			]
		);
	};

	const handleEdit = () => {
		if (newName.trim()) {
			useWorkoutStore.getState().updateMesocycleName(mesoId, newName.trim());
			setIsEditModalVisible(false);
			setIsMenuVisible(false);
			Toast.show({
				type: 'success',
				text1: 'Program renamed',
			});
		}
	};

	return (
		<>
			<TouchableOpacity
				ref={buttonRef}
				onPress={handleMenuPress}
				className={'p-2'}
			>
				<MoreVertical size={20} color={'#666666'} />
			</TouchableOpacity>

			{/* Menu Modal */}
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
							onPress={() => {
								setIsMenuVisible(false);
								setIsEditModalVisible(true);
							}}
						>
							<Edit2 size={18} color={'#0284c7'} />
							<Text className={'ml-2 text-base'}>Rename</Text>
						</TouchableOpacity>
						<TouchableOpacity
							className={'flex-row items-center px-4 py-3'}
							onPress={() => {
								setIsMenuVisible(false);
								confirmDelete();
							}}
						>
							<Trash2 size={18} color={'#ef4444'} />
							<Text className={'ml-2 text-base text-red-500'}>Delete</Text>
						</TouchableOpacity>
					</View>
				</TouchableOpacity>
			</Modal>

			{/* Edit Modal */}
			<Modal
				transparent
				visible={isEditModalVisible}
				animationType={'slide'}
				onRequestClose={() => setIsEditModalVisible(false)}
			>
				<View className={'flex-1 justify-end'}>
					<View className={'bg-black/50 absolute inset-0'} />
					<View className={'bg-white rounded-t-xl p-4'}>
						<Text className={'text-xl font-semibold mb-4'}>Rename Program</Text>
						<TextInput
							className={'border border-gray-200 rounded-lg px-4 py-3 mb-4'}
							value={newName}
							onChangeText={setNewName}
							placeholder={'Program name'}
							autoFocus
						/>
						<View className={'flex-row gap-2'}>
							<TouchableOpacity
								className={'flex-1 bg-gray-100 py-3 rounded-lg'}
								onPress={() => setIsEditModalVisible(false)}
							>
								<Text className={'text-center text-base'}>Cancel</Text>
							</TouchableOpacity>
							<TouchableOpacity
								className={'flex-1 bg-sky-600 py-3 rounded-lg'}
								onPress={handleEdit}
							>
								<Text className={'text-center text-base text-white'}>Save</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>
		</>
	);
};
