import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface TimerSettings {
	defaultTime: number;
	isEnabled: boolean;
	notification: 'vibrate' | 'sound' | 'both' | 'none';
	autoStart: boolean;
	setDefaultTime: (time: number) => void;
	setEnabled: (enabled: boolean) => void;
	setNotification: (type: 'vibrate' | 'sound' | 'both' | 'none') => void;
	setAutoStart: (autoStart: boolean) => void;
}

export const useTimerSettings = create<TimerSettings>()(
	persist(
		(set) => ({
			defaultTime: 2,
			isEnabled: true,
			notification: 'vibrate',
			autoStart: false,
			setDefaultTime: (time) => set({ defaultTime: time }),
			setEnabled: (enabled) => set({ isEnabled: enabled }),
			setNotification: (type) => set({ notification: type }),
			setAutoStart: (autoStart) => set({ autoStart: autoStart }),
		}),
		{
			name: 'timer-settings',
			storage: createJSONStorage(() => AsyncStorage),
		}
	)
);
