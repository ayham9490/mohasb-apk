import { View, Text, TouchableOpacity } from "react-native";
import { useColors } from "@/hooks/use-colors";

interface TransactionCardProps {
  statement: string;
  account: string;
  amount: number;
  currency: string;
  type: "for_us" | "for_them";
  date: string;
  onPress?: () => void;
  onDelete?: () => void;
}

export function TransactionCard({
  statement,
  account,
  amount,
  currency,
  type,
  date,
  onPress,
  onDelete,
}: TransactionCardProps) {
  const colors = useColors();
  const isIncome = type === "for_us";

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="rounded-xl p-4 border border-border flex-row justify-between items-start"
      style={{ backgroundColor: colors.surface }}
    >
      <View className="flex-1">
        <Text className="text-base font-semibold text-foreground">{statement}</Text>
        <Text className="text-xs text-muted mt-2">
          {account} • {isIncome ? "لنا" : "لهم"}
        </Text>
        <Text className="text-xs text-muted mt-1">{date}</Text>
      </View>

      <View className="items-end gap-2">
        <Text
          className={`text-lg font-bold ${isIncome ? "text-success" : "text-error"}`}
        >
          {isIncome ? "+" : "-"}
          {amount}
        </Text>
        <Text className="text-xs text-muted">{currency}</Text>

        {onDelete && (
          <TouchableOpacity
            onPress={onDelete}
            className="p-1"
          >
            <Text className="text-sm">🗑️</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}
