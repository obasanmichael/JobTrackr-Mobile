import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ReactElement } from 'react';
import { Alert, Linking, RefreshControl, View } from 'react-native';
import { format, parseISO } from 'date-fns';
import { Check, CreditCard, Sparkles, X } from 'lucide-react-native';
import type { MoreStackParamList } from '../../navigation/types';
import type { PlanSummaryApi, SubscriptionStatusApi } from '../../types/billing.dto';
import { getWebBillingUrl } from '../../constants/web-app-env';
import {
  formatEntitlementLimit,
  formatPlanPrice,
  getFeatureLabel,
  getSubscriptionStatusLabel,
  sortPlans,
} from '../../domain/billing-display';
import { useDomainQueriesEnabled } from '../../hooks/use-domain-queries-enabled';
import { useBillingMeQuery, usePlansQuery } from '../../query/jt-queries';
import {
  Button,
  Card,
  EmptyState,
  ErrorState,
  LoadingState,
  Screen,
  Typography,
} from '../../components/ui';
import { parseAxiosApiError } from '../../services/api';
import { useAppTheme } from '../../theme';

type Props = NativeStackScreenProps<MoreStackParamList, 'BillingPlaceholder'>;

function formatWhen(value: string | null): string | null {
  if (!value) {
    return null;
  }

  try {
    return format(parseISO(value), 'MMM d, yyyy');
  } catch {
    return value;
  }
}

async function openWebBilling(): Promise<void> {
  const url = getWebBillingUrl();
  if (!url) {
    Alert.alert(
      'Web billing unavailable',
      'Set EXPO_PUBLIC_WEB_APP_URL in your environment to open billing on the web app.',
    );
    return;
  }

  try {
    const supported = await Linking.canOpenURL(url);
    if (!supported) {
      Alert.alert('Cannot open link', 'The billing page URL cannot be opened on this device.');
      return;
    }
    await Linking.openURL(url);
  } catch {
    Alert.alert('Cannot open link', 'Something went wrong while opening billing on the web.');
  }
}

function SubscriptionStatusPill(props: { status: SubscriptionStatusApi }): ReactElement {
  const { theme } = useAppTheme();
  const label = getSubscriptionStatusLabel(props.status);

  let backgroundColor = theme.colors.borderMuted;
  let textColor = theme.colors.textPrimary;

  if (props.status === 'BETA') {
    backgroundColor = 'rgba(139, 92, 246, 0.12)';
  } else if (props.status === 'PAST_DUE' || props.status === 'EXPIRED' || props.status === 'CANCELLED') {
    backgroundColor = 'rgba(239, 68, 68, 0.12)';
  } else if (props.status === 'TRIALING') {
    backgroundColor = 'rgba(14, 165, 233, 0.12)';
  } else if (props.status === 'ACTIVE') {
    backgroundColor = 'rgba(16, 185, 129, 0.12)';
  }

  return (
    <View
      style={{
        alignSelf: 'flex-start',
        borderRadius: 999,
        backgroundColor,
        paddingHorizontal: theme.space.sm,
        paddingVertical: 4,
      }}
    >
      <Typography variant="caption" style={{ fontWeight: '700', color: textColor }}>
        {label}
      </Typography>
    </View>
  );
}

function PlanCard(props: {
  plan: PlanSummaryApi;
  currentPlanCode: string;
  onManageOnWeb: () => void;
}): ReactElement {
  const { theme } = useAppTheme();
  const { plan, currentPlanCode } = props;
  const isCurrent = plan.code === currentPlanCode;
  const canUpgradeOnWeb = plan.checkoutAvailable && !isCurrent;

  return (
    <Card
      style={{
        gap: theme.space.md,
        borderWidth: isCurrent ? 1 : 0,
        borderColor: isCurrent ? theme.colors.accent : undefined,
        backgroundColor: isCurrent ? `${theme.colors.accent}14` : undefined,
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: theme.space.sm }}>
        <View style={{ flex: 1, gap: theme.space.xs }}>
          <Typography variant="bodySmall" style={{ fontWeight: '700' }}>
            {plan.name}
          </Typography>
          {plan.description ? (
            <Typography variant="caption" muted>
              {plan.description}
            </Typography>
          ) : null}
        </View>
        {isCurrent ? (
          <Typography variant="caption" style={{ fontWeight: '700', color: theme.colors.accent }}>
            Current
          </Typography>
        ) : null}
      </View>

      <Typography variant="title" style={{ fontSize: 22 }}>
        {formatPlanPrice(plan)}
      </Typography>

      {isCurrent ? (
        <Button label="Your plan" variant="outline" disabled onPress={() => undefined} style={{ alignSelf: 'stretch' }} />
      ) : canUpgradeOnWeb ? (
        <Button
          label="Upgrade on web"
          variant="secondary"
          onPress={props.onManageOnWeb}
          style={{ alignSelf: 'stretch' }}
        />
      ) : (
        <Button label="Coming soon" variant="outline" disabled onPress={() => undefined} style={{ alignSelf: 'stretch' }} />
      )}
    </Card>
  );
}

export function BillingScreen(_props: Props): ReactElement {
  const { theme } = useAppTheme();
  const apiOn = useDomainQueriesEnabled();
  const billingQuery = useBillingMeQuery(apiOn);
  const plansQuery = usePlansQuery(apiOn);
  const webBillingUrl = getWebBillingUrl();

  const refreshing = billingQuery.isFetching || plansQuery.isFetching;
  const onRefresh = () => {
    void billingQuery.refetch();
    void plansQuery.refetch();
  };

  if (!apiOn) {
    return (
      <Screen scroll edges={['left', 'right', 'bottom']}>
        <EmptyState
          icon={CreditCard}
          title="Sign in required"
          description="Sign in to view your plan and feature access."
        />
      </Screen>
    );
  }

  if (billingQuery.isPending || plansQuery.isPending) {
    return (
      <Screen scroll edges={['left', 'right', 'bottom']}>
        <LoadingState message="Loading billing…" />
      </Screen>
    );
  }

  if (billingQuery.isError) {
    return (
      <Screen scroll edges={['left', 'right', 'bottom']}>
        <ErrorState
          message={parseAxiosApiError(billingQuery.error)?.message ?? 'Could not load billing.'}
          onRetry={() => billingQuery.refetch()}
        />
      </Screen>
    );
  }

  const billing = billingQuery.data!;
  const plans = sortPlans(plansQuery.data ?? []);
  const periodEnd = formatWhen(billing.currentPeriodEnd);
  const isBetaPlan = billing.planCode === 'BETA_FREE' || billing.subscriptionStatus === 'BETA';
  const canManageOnWeb = Boolean(webBillingUrl);

  return (
    <Screen
      scroll
      edges={['left', 'right', 'bottom']}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Typography variant="bodySmall" muted style={{ marginTop: theme.space.sm }}>
        Your plan and entitlements sync with the web dashboard. Payments and subscription changes
        happen on the web app.
      </Typography>

      {canManageOnWeb ? (
        <Button
          label="Manage billing on web"
          variant="secondary"
          onPress={() => void openWebBilling()}
          style={{ marginTop: theme.space.lg, alignSelf: 'stretch' }}
        />
      ) : (
        <Card style={{ marginTop: theme.space.lg, gap: theme.space.sm }}>
          <Typography variant="bodySmall" style={{ fontWeight: '600' }}>
            Web billing link not configured
          </Typography>
          <Typography variant="caption" muted>
            Set EXPO_PUBLIC_WEB_APP_URL to enable opening the web billing page from this screen.
          </Typography>
        </Card>
      )}

      {isBetaPlan ? (
        <Card
          style={{
            marginTop: theme.space.lg,
            gap: theme.space.sm,
            backgroundColor: 'rgba(139, 92, 246, 0.08)',
          }}
        >
          <View style={{ flexDirection: 'row', gap: theme.space.sm }}>
            <Sparkles size={18} color={theme.colors.accent} />
            <View style={{ flex: 1, gap: theme.space.xs }}>
              <Typography variant="bodySmall" style={{ fontWeight: '700' }}>
                Free during beta
              </Typography>
              <Typography variant="caption" muted>
                JobTrackr is free while we&apos;re in beta. You have full access to current
                features — no payment required.
              </Typography>
            </View>
          </View>
        </Card>
      ) : null}

      <Card style={{ marginTop: theme.space.lg, gap: theme.space.md }}>
        <View style={{ gap: theme.space.sm }}>
          <Typography variant="label" style={{ letterSpacing: 1 }}>
            Current plan
          </Typography>
          <Typography variant="title">{billing.planName}</Typography>
          <SubscriptionStatusPill status={billing.subscriptionStatus} />
        </View>

        <View style={{ height: 1, backgroundColor: theme.colors.borderMuted }} />

        <View style={{ gap: theme.space.sm }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: theme.space.md }}>
            <Typography variant="caption" muted>
              Billing provider
            </Typography>
            <Typography variant="caption" style={{ fontWeight: '600' }}>
              {billing.billingProvider === 'STRIPE' ? 'Stripe' : 'None (beta)'}
            </Typography>
          </View>
          {periodEnd ? (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: theme.space.md }}>
              <Typography variant="caption" muted>
                Current period ends
              </Typography>
              <Typography variant="caption" style={{ fontWeight: '600' }}>
                {periodEnd}
              </Typography>
            </View>
          ) : null}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: theme.space.md }}>
            <Typography variant="caption" muted>
              Stripe checkout
            </Typography>
            <Typography variant="caption" style={{ fontWeight: '600' }}>
              {billing.stripeConfigured ? 'Available on web' : 'Not configured'}
            </Typography>
          </View>
        </View>
      </Card>

      <Card style={{ marginTop: theme.space.lg, gap: theme.space.md }}>
        <View style={{ gap: theme.space.xs }}>
          <Typography variant="label" style={{ letterSpacing: 1 }}>
            Feature access
          </Typography>
          <Typography variant="caption" muted>
            What your plan includes today.
          </Typography>
        </View>

        {billing.entitlements.map((entitlement) => (
          <View
            key={entitlement.featureKey}
            style={{
              flexDirection: 'row',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: theme.space.md,
            }}
          >
            <View style={{ flex: 1, flexDirection: 'row', gap: theme.space.sm }}>
              {entitlement.isEnabled ? (
                <Check size={16} color={theme.colors.success} />
              ) : (
                <X size={16} color={theme.colors.textMuted} />
              )}
              <Typography
                variant="bodySmall"
                muted={!entitlement.isEnabled}
                style={{ flex: 1 }}
              >
                {getFeatureLabel(entitlement.featureKey)}
              </Typography>
            </View>
            <Typography variant="caption" muted style={{ maxWidth: 120, textAlign: 'right' }}>
              {entitlement.isEnabled ? formatEntitlementLimit(entitlement) : 'Not included'}
            </Typography>
          </View>
        ))}
      </Card>

      <View style={{ marginTop: theme.space.xl, gap: theme.space.sm }}>
        <Typography variant="label" style={{ letterSpacing: 1 }}>
          Available plans
        </Typography>
        <Typography variant="caption" muted>
          Compare tiers. Upgrades and payment are handled on the web billing page.
        </Typography>
      </View>

      {plansQuery.isError ? (
        <ErrorState
          message={parseAxiosApiError(plansQuery.error)?.message ?? 'Could not load plans.'}
          onRetry={() => plansQuery.refetch()}
        />
      ) : plans.length === 0 ? (
        <EmptyState
          icon={CreditCard}
          title="No plans available"
          description="The plan catalog has not been configured yet."
        />
      ) : (
        <View style={{ marginTop: theme.space.md, gap: theme.space.md }}>
          {plans.map((plan) => (
            <PlanCard
              key={plan.code}
              plan={plan}
              currentPlanCode={billing.planCode}
              onManageOnWeb={() => void openWebBilling()}
            />
          ))}
        </View>
      )}
    </Screen>
  );
}
