import React, {
	useState,
	useEffect,
	useRef,
	forwardRef,
	useImperativeHandle,
} from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	Vibration,
	Pressable,
} from 'react-native';
import {
	Timer,
	Pause,
	Play,
	X,
	Settings,
	MinusCircle,
	PlusCircle,
} from 'lucide-react-native';
import { useTimerSettings } from '@/store/timerSettings';
import { Audio } from 'expo-av';
import { TimerSettingsModal } from './TimerSettingsModal';

interface Props {
	onComplete?: () => void;
}

export interface RestTimerRef {
	startTimer: () => void;
}

export const RestTimer = forwardRef<RestTimerRef, Props>(
	({ onComplete }, ref) => {
		const { defaultTime, isEnabled, notification, autoStart } =
			useTimerSettings();
		const [isVisible, setIsVisible] = useState(false);
		const [timeLeft, setTimeLeft] = useState(defaultTime);
		const [isRunning, setIsRunning] = useState(false);
		const [isSettingsVisible, setIsSettingsVisible] = useState(false);
		const timerRef = useRef<NodeJS.Timeout>();
		const soundRef = useRef<Audio.Sound>();

		useImperativeHandle(ref, () => ({
			startTimer: () => {
				if (autoStart) {
					setIsVisible(true);
					setTimeLeft(defaultTime);
					setIsRunning(true);
				}
			},
		}));

		useEffect(() => {
			return () => {
				soundRef.current?.unloadAsync();
			};
		}, []);

		const playSound = async () => {
			try {
				const { sound } = await Audio.Sound.createAsync(
					require('@/assets/sounds/timer-done.mp3'),
					{ shouldPlay: true }
				);
				soundRef.current = sound;
			} catch (error) {
				console.log('Error playing sound', error);
			}
		};

		useEffect(() => {
			if (isRunning && timeLeft > 0) {
				timerRef.current = setInterval(() => {
					setTimeLeft((prev) => {
						if (prev <= 1) {
							setIsRunning(false);
							if (notification === 'vibrate' || notification === 'both') {
								Vibration.vibrate([0, 500, 200, 500]);
							}
							if (notification === 'sound' || notification === 'both') {
								playSound();
							}
							onComplete?.();
							return defaultTime;
						}
						return prev - 1;
					});
				}, 1000);
			}

			return () => {
				if (timerRef.current) {
					clearInterval(timerRef.current);
				}
			};
		}, [isRunning, defaultTime, notification, onComplete]);

		const formatTime = (seconds: number) => {
			const mins = Math.floor(seconds / 60);
			const secs = seconds % 60;
			return `${mins}:${secs.toString().padStart(2, '0')}`;
		};

		const adjustTime = (seconds: number) => {
			setTimeLeft((prev) => Math.max(0, prev + seconds));
		};

		if (!isEnabled) return null;

		if (!isVisible) {
			return (
				<TouchableOpacity
					onPress={() => setIsVisible(true)}
					className={
						'absolute bottom-2 right-2 w-12 h-12 bg-sky-600 rounded-full items-center justify-center shadow-lg'
					}
				>
					<Timer size={24} color={'#fff'} />
				</TouchableOpacity>
			);
		}

		return (
			<>
				<View
					className={
						'absolute bottom-2 right-2 bg-white rounded-lg shadow-lg p-4 border border-gray-200 w-64'
					}
				>
					<View className={'flex-row justify-between items-center mb-3'}>
						<Text className={'text-lg font-semibold'}>Rest Timer</Text>
						<View className={'flex-row gap-2'}>
							<TouchableOpacity
								onPress={() => setIsSettingsVisible(true)}
								className={'p-1'}
							>
								<Settings size={20} color={'#666'} />
							</TouchableOpacity>
							<TouchableOpacity
								onPress={() => setIsVisible(false)}
								className={'p-1'}
							>
								<X size={20} color={'#666'} />
							</TouchableOpacity>
						</View>
					</View>

					<View className={'flex-row items-center justify-between mb-4'}>
						<Pressable onPress={() => adjustTime(-10)} className={'p-2 -ml-2'}>
							<MinusCircle size={24} color={'#666'} />
						</Pressable>

						<Text className={'text-3xl font-bold text-center'}>
							{formatTime(timeLeft)}
						</Text>

						<Pressable onPress={() => adjustTime(10)} className={'p-2 -mr-2'}>
							<PlusCircle size={24} color={'#666'} />
						</Pressable>
					</View>

					<View className={'flex-row justify-center gap-2'}>
						<TouchableOpacity
							onPress={() => {
								setTimeLeft(defaultTime);
								setIsRunning(false);
							}}
							className={'p-2 bg-gray-100 rounded-lg'}
						>
							<Timer size={24} color={'#666'} />
						</TouchableOpacity>

						<TouchableOpacity
							onPress={() => setIsRunning(!isRunning)}
							className={'p-2 bg-sky-600 rounded-lg'}
						>
							{isRunning ? (
								<Pause size={24} color={'#fff'} />
							) : (
								<Play size={24} color={'#fff'} />
							)}
						</TouchableOpacity>
					</View>
				</View>

				<TimerSettingsModal
					isVisible={isSettingsVisible}
					onClose={() => setIsSettingsVisible(false)}
				/>
			</>
		);
	}
);
