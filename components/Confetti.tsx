import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withDelay,
	withSequence,
	withTiming,
	Easing,
} from 'react-native-reanimated';
import { Svg, Circle } from 'react-native-svg';

const NUM_CONFETTI = 30;
const COLORS = ['#FCD34D', '#34D399', '#60A5FA', '#F472B6', '#818CF8'];

const Particle = ({ delay }: { delay: number }) => {
	const x = useSharedValue(0);
	const y = useSharedValue(0);
	const scale = useSharedValue(0);
	const rotate = useSharedValue(0);

	useEffect(() => {
		const angle = Math.random() * Math.PI * 2;
		const velocity = 300 + Math.random() * 200;
		const distance = 100 + Math.random() * 60;

		x.value = withDelay(
			delay,
			withTiming(Math.cos(angle) * distance, {
				duration: 1000,
				easing: Easing.ease,
			})
		);
		y.value = withDelay(
			delay,
			withSequence(
				withTiming(Math.sin(angle) * distance * -0.3, {
					duration: 400,
					easing: Easing.out(Easing.quad),
				}),
				withTiming(Math.sin(angle) * distance, {
					duration: 600,
					easing: Easing.in(Easing.quad),
				})
			)
		);
		scale.value = withDelay(
			delay,
			withSequence(
				withTiming(1, { duration: 200 }),
				withTiming(0, { duration: 800 })
			)
		);
		rotate.value = withDelay(
			delay,
			withTiming(Math.random() * 360, { duration: 1000 })
		);
	}, []);

	const style = useAnimatedStyle(() => ({
		transform: [
			{ translateX: x.value },
			{ translateY: y.value },
			{ scale: scale.value },
			{ rotate: `${rotate.value}deg` },
		],
	}));

	return (
		<Animated.View style={[{ position: 'absolute' }, style]}>
			<Svg width={8} height={8}>
				<Circle
					cx={4}
					cy={4}
					r={4}
					fill={COLORS[Math.floor(Math.random() * COLORS.length)]}
				/>
			</Svg>
		</Animated.View>
	);
};

export const Confetti = () => {
	return (
		<View className={'absolute -top-4 left-1/2 -translate-x-1/2 w-0 h-0'}>
			{Array.from({ length: NUM_CONFETTI }).map((_, i) => (
				<Particle key={i} delay={i * 20} />
			))}
		</View>
	);
};
