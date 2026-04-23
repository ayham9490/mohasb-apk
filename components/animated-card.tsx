import { View, ViewProps, Animated, Pressable } from "react-native";
import { useEffect, useRef } from "react";

interface AnimatedCardProps extends ViewProps {
  children: React.ReactNode;
  delay?: number;
  onPress?: () => void;
}

/**
 * Animated Card Component
 * بطاقة بتأثير انزلاق سلس عند الظهور
 */
export function AnimatedCard({
  children,
  delay = 0,
  onPress,
  style,
  ...props
}: AnimatedCardProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 400,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim, scaleAnim, delay]);

  return (
    <Animated.View
      style={[
        {
          opacity: fadeAnim,
          transform: [
            { translateY: slideAnim },
            { scale: scaleAnim },
          ],
        },
        style,
      ]}
      {...props}
    >
      {onPress ? (
        <Pressable onPress={onPress}>
          {children}
        </Pressable>
      ) : (
        children
      )}
    </Animated.View>
  );
}

/**
 * Fade In Animation
 * تأثير التلاشي البسيط
 */
interface FadeInProps extends ViewProps {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
}

export function FadeIn({
  children,
  duration = 300,
  delay = 0,
  style,
  ...props
}: FadeInProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration,
      delay,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim, duration, delay]);

  return (
    <Animated.View
      style={[
        {
          opacity: fadeAnim,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </Animated.View>
  );
}

/**
 * Slide In Animation
 * تأثير الانزلاق من الجانب
 */
interface SlideInProps extends ViewProps {
  children: React.ReactNode;
  direction?: "left" | "right" | "up" | "down";
  duration?: number;
  delay?: number;
}

export function SlideIn({
  children,
  direction = "left",
  duration = 400,
  delay = 0,
  style,
  ...props
}: SlideInProps) {
  const slideAnim = useRef(new Animated.Value(
    direction === "left" ? -100 : direction === "right" ? 100 : direction === "up" ? 100 : -100
  )).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration,
      delay,
      useNativeDriver: true,
    }).start();
  }, [slideAnim, duration, delay]);

  const getTransform = () => {
    if (direction === "left" || direction === "right") {
      return { translateX: slideAnim };
    }
    return { translateY: slideAnim };
  };

  return (
    <Animated.View
      style={[
        {
          transform: [getTransform()],
        },
        style,
      ]}
      {...props}
    >
      {children}
    </Animated.View>
  );
}

/**
 * Scale Animation
 * تأثير التكبير/التصغير
 */
interface ScaleProps extends ViewProps {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
  from?: number;
}

export function Scale({
  children,
  duration = 300,
  delay = 0,
  from = 0.8,
  style,
  ...props
}: ScaleProps) {
  const scaleAnim = useRef(new Animated.Value(from)).current;

  useEffect(() => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration,
      delay,
      useNativeDriver: true,
    }).start();
  }, [scaleAnim, duration, delay]);

  return (
    <Animated.View
      style={[
        {
          transform: [{ scale: scaleAnim }],
        },
        style,
      ]}
      {...props}
    >
      {children}
    </Animated.View>
  );
}
