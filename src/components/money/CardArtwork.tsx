import { View, type ViewStyle } from 'react-native';

import { Text } from '@/components/ui/Text';
import { ICON_STROKE, Nfc } from '@/constants/icons';
import type { Card } from '@/types/card';

type CardArtworkProps = {
  card: Card;
  /**
   * 'overview': shows "VIRTUAL" / "PHYSICAL" label (screen 23).
   * 'detail': shows the active/frozen status pill (screen 24).
   */
  variant?: 'overview' | 'detail' | undefined;
  /** When true, shows the full unmasked card number (screen 24, reveal mode). */
  revealed?: boolean | undefined;
  style?: ViewStyle | undefined;
};

/**
 * Navy payment card artwork. Purely visual — wrap in a Pressable for interactivity.
 * Fixed-colour surface: colours are independent of the app theme.
 */
export function CardArtwork({
  card,
  variant = 'overview',
  revealed = false,
  style,
}: CardArtworkProps) {
  const displayNumber = revealed ? card.fullNumber : `•••• •••• •••• ${card.last4}`;

  return (
    <View
      style={[
        {
          flex: 1,
          backgroundColor: '#101828',
          borderRadius: 20,
          overflow: 'hidden',
        },
        style,
      ]}
    >
      {/* Decorative large circle */}
      <View
        accessible={false}
        importantForAccessibility="no-hide-descendants"
        style={{
          position: 'absolute',
          right: -50,
          bottom: -90,
          width: 240,
          height: 240,
          borderRadius: 120,
          borderWidth: 32,
          borderColor: '#1D2939',
        }}
      />
      {/* Decorative small circle */}
      <View
        accessible={false}
        importantForAccessibility="no-hide-descendants"
        style={{
          position: 'absolute',
          right: 60,
          bottom: -40,
          width: 120,
          height: 120,
          borderRadius: 60,
          borderWidth: 2,
          borderColor: '#16A875',
          opacity: 0.5,
        }}
      />

      {/* Card content */}
      <View
        style={{
          flex: 1,
          paddingVertical: 20,
          paddingHorizontal: 22,
          justifyContent: 'space-between',
        }}
      >
        {/* Top row: wordmark + badge */}
        <View
          style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <Text weight="bold" style={{ fontSize: 20, letterSpacing: -0.9, color: '#FFFFFF' }}>
            vaulta
            <Text weight="bold" style={{ fontSize: 20, color: '#16A875' }}>
              .
            </Text>
          </Text>

          {variant === 'overview' ? (
            <Text weight="semibold" style={{ fontSize: 11, letterSpacing: 1.1, color: '#D0D5DD' }}>
              {card.kind === 'virtual' ? 'VIRTUAL' : 'PHYSICAL'}
            </Text>
          ) : (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <View
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: card.status === 'active' ? '#16A875' : '#F79009',
                }}
              />
              <Text
                weight="semibold"
                style={{
                  fontSize: 12,
                  color: card.status === 'active' ? '#6CE9A6' : '#FEC84B',
                }}
              >
                {card.status === 'active' ? 'Active' : 'Frozen'}
              </Text>
            </View>
          )}
        </View>

        {/* SIM card rectangle + NFC icon */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View
            style={{
              width: 38,
              height: 28,
              borderRadius: 6,
              backgroundColor: '#D0D5DD',
              opacity: 0.85,
            }}
          />
          <Nfc size={22} color="#D0D5DD" strokeWidth={ICON_STROKE} />
        </View>

        {/* Card number */}
        <Text
          weight="semibold"
          style={{
            fontSize: 19,
            letterSpacing: 2.66,
            color: '#FFFFFF',
            fontVariant: ['tabular-nums'],
          }}
        >
          {displayNumber}
        </Text>

        {/* Bottom row: cardholder + expiry / type */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
          }}
        >
          <Text style={{ fontSize: 12, color: '#D0D5DD' }}>{card.holderName}</Text>
          <Text style={{ fontSize: 12, color: '#D0D5DD' }}>
            {card.expiry}{' '}
            <Text weight="bold" style={{ fontSize: 12, color: '#FFFFFF', letterSpacing: 0.96 }}>
              DEBIT
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );
}
