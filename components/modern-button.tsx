import { TouchableOpacity, Text, View, StyleSheet } from "react-native";
import * as Haptics from "expo-haptics";
import { useColors } from "@/hooks/use-colors";

interface ModernButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "success" | "danger" | "warning";
  size?: "small" | "medium" | "large";
  icon?: string;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
}

export function ModernButton({
  title,
  onPress,
  variant = "primary",
  size = "medium",
  icon,
  disabled = false,
  loading = false,
  fullWidth = false,
}: ModernButtonProps) {
  const colors = useColors();

  const getBackgroundColor = () => {
    switch (variant) {
      case "primary":
        return colors.primary;
      case "secondary":
        return colors.surface;
      case "success":
        return colors.success;
      case "danger":
        return colors.error;
      case "warning":
        return colors.warning;
      default:
        return colors.primary;
    }
  };

  const getTextColor = () => {
    if (variant === "secondary") return colors.foreground;
    return "white";
  };

  const getPadding = () => {
    switch (size) {
      case "small":
        return 8;
      case "medium":
        return 12;
      case "large":
        return 16;
      default:
        return 12;
    }
  };

  const getFontSize = () => {
    switch (size) {
      case "small":
        return 12;
      case "medium":
        return 14;
      case "large":
        return 16;
      default:
        return 14;
    }
  };

  const handlePress = () => {
    if (!disabled && !loading) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress();
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[
        {
          backgroundColor: disabled ? colors.muted : getBackgroundColor(),
          paddingVertical: getPadding(),
          paddingHorizontal: getPadding() * 1.5,
          borderRadius: 12,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          opacity: disabled ? 0.5 : 1,
          width: fullWidth ? "100%" : "auto",
        },
        variant === "secondary" && {
          borderWidth: 1,
          borderColor: colors.border,
        },
      ]}
    >
      {icon && !loading && <Text style={{ fontSize: size === "small" ? 14 : 18 }}>{icon}</Text>}
      {loading && <Text style={{ fontSize: 14 }}>⏳</Text>}
      <Text
        style={{
          color: disabled ? colors.foreground : getTextColor(),
          fontSize: getFontSize(),
          fontWeight: "600",
        }}
      >
        {loading ? "جاري..." : title}
      </Text>
    </TouchableOpacity>
  );
}

/**
 * Button Group - عدة أزرار في صف واحد
 */
interface ButtonGroupProps {
  buttons: Array<{
    title: string;
    onPress: () => void;
    variant?: "primary" | "secondary" | "success" | "danger" | "warning";
    icon?: string;
  }>;
  gap?: number;
}

export function ButtonGroup({ buttons, gap = 8 }: ButtonGroupProps) {
  return (
    <View style={{ flexDirection: "row", gap, flex: 1 }}>
      {buttons.map((button, index) => (
        <View key={index} style={{ flex: 1 }}>
          <ModernButton
            title={button.title}
            onPress={button.onPress}
            variant={button.variant}
            icon={button.icon}
            fullWidth
          />
        </View>
      ))}
    </View>
  );
}
