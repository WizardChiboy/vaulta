import { useEffect, useState } from 'react';
import { Platform, Pressable, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import type { Edge } from 'react-native-safe-area-context';

import { useTheme } from '@/components/layout/ThemeProvider';
import { Screen } from '@/components/layout/Screen';
import { TransactionRow } from '@/components/money/TransactionRow';
import { Card, Chip, Text, TextLink } from '@/components/ui';
import { CircleX, Clock, ICON_STROKE, Search } from '@/constants/icons';
import { fontFamily, typeScale } from '@/constants/theme';
import { cn } from '@/lib/cn';
import { searchTransactions } from '@/services/transactions';
import { useTransactionsStore } from '@/store/transactions';
import type { Transaction } from '@/types/transaction';
import { formatDayMonth } from '@/utils/format';

// iOS shows the modal as a sheet below the status bar; Android shows it full screen.
const edges: Edge[] = Platform.OS === 'ios' ? ['bottom'] : ['top', 'bottom'];

/** Title with the first match of `query` in bold green on a soft green background. */
function Highlighted({ text, query }: { text: string; query: string }) {
  const start = text.toLowerCase().indexOf(query.toLowerCase());
  if (start === -1) return text;
  const end = start + query.length;
  return (
    <>
      {text.slice(0, start)}
      <Text weight="bold" tone="accent" className="rounded-[3px] bg-accent-soft">
        {text.slice(start, end)}
      </Text>
      {text.slice(end)}
    </>
  );
}

// Design 13 — Search transactions (modal).
export default function SearchTransactionsScreen() {
  const { colors } = useTheme();
  const { recentSearches, addRecentSearch, clearRecentSearches } = useTransactionsStore();
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(true);
  // Results and the query they answer, so stale responses are never shown for a newer query.
  const [response, setResponse] = useState<{ query: string; items: Transaction[] } | null>(null);
  const trimmed = query.trim();

  useEffect(() => {
    if (!trimmed) return;
    let active = true;
    void searchTransactions(trimmed).then((items) => {
      if (active) setResponse({ query: trimmed, items });
    });
    return () => {
      active = false;
    };
  }, [trimmed]);

  const results = trimmed && response?.query === trimmed ? response.items : null;
  const searching = !!trimmed && results === null;

  const openTransaction = (transaction: Transaction) => {
    addRecentSearch(trimmed);
    router.push({ pathname: '/transactions/[id]', params: { id: transaction.id } });
  };

  return (
    <Screen scroll edges={edges} contentClassName="pb-xl">
      <View className="flex-row items-center gap-md pt-1.5">
        <View
          className={cn(
            'h-12 flex-1 flex-row items-center rounded-md bg-surface',
            focused ? 'border-2 border-primary px-3' : 'border border-border-strong px-[13px]'
          )}
        >
          <Search size={20} color={colors.muted} strokeWidth={ICON_STROKE} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            autoFocus
            autoCorrect={false}
            autoCapitalize="none"
            returnKeyType="search"
            enterKeyHint="search"
            onSubmitEditing={() => addRecentSearch(trimmed)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            accessibilityLabel="Search transactions"
            placeholder="Search transactions"
            placeholderTextColor={colors.subtle}
            cursorColor={colors.primary}
            selectionColor={colors.primary}
            // fontSize only: a fixed lineHeight misaligns TextInput text on iOS.
            className="h-full flex-1 px-2.5 text-foreground"
            style={{ fontFamily: fontFamily.regular, fontSize: typeScale['body-lg'][0] }}
          />
          {query !== '' && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Clear search"
              onPress={() => setQuery('')}
              hitSlop={8}
              className="-mr-1 h-10 w-10 items-center justify-center"
            >
              <CircleX size={18} color={colors.surface} fill={colors['border-strong']} />
            </Pressable>
          )}
        </View>
        <TextLink
          variant="body"
          accessibilityRole="button"
          onPress={() => router.back()}
          className="py-md"
        >
          Cancel
        </TextLink>
      </View>

      {recentSearches.length > 0 && (
        <View className="pt-[18px]">
          <View className="flex-row items-center justify-between">
            <Text variant="caption" weight="semibold" tone="muted" accessibilityRole="header">
              Recent searches
            </Text>
            <TextLink
              variant="caption"
              accessibilityRole="button"
              accessibilityLabel="Clear recent searches"
              onPress={clearRecentSearches}
              className="py-1.5"
            >
              Clear
            </TextLink>
          </View>
          <View className="mt-2.5 flex-row flex-wrap gap-sm">
            {recentSearches.map((item) => (
              <Chip
                key={item}
                label={item}
                leadingIcon={Clock}
                accessibilityLabel={`Search for ${item}`}
                onPress={() => setQuery(item)}
              />
            ))}
          </View>
        </View>
      )}

      {searching && (
        <Text variant="caption" weight="semibold" tone="muted" className="mb-sm mt-5">
          Searching…
        </Text>
      )}

      {results && (
        <>
          <Text
            variant="caption"
            weight="semibold"
            tone="muted"
            accessibilityRole="header"
            accessibilityLiveRegion="polite"
            className="mb-sm mt-5"
          >
            {results.length} {results.length === 1 ? 'result' : 'results'} for “{trimmed}”
          </Text>
          {results.length > 0 ? (
            <Card padded={false} className="overflow-hidden py-[3px]">
              {results.map((transaction) => (
                <TransactionRow
                  key={transaction.id}
                  transaction={transaction}
                  title={<Highlighted text={transaction.title} query={trimmed} />}
                  meta={`${transaction.categoryLabel} · ${formatDayMonth(transaction.occurredAt)}`}
                  onPress={() => openTransaction(transaction)}
                  className="py-[9px]"
                />
              ))}
            </Card>
          ) : (
            <Text variant="bodySm" tone="muted" className="mt-md text-center">
              No transactions match. Try a merchant, a person or a category.
            </Text>
          )}
        </>
      )}
    </Screen>
  );
}
