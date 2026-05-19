import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ReactElement } from 'react';
import { Alert, Linking, View } from 'react-native';
import { LifeBuoy, ScrollText, Shield, Trash2, type LucideIcon } from 'lucide-react-native';
import { Card, HubNavRow, Screen, Typography } from '../../components/ui';
import {
  getAccountDeletionUrl,
  getPrivacyPolicyUrl,
  getSupportLaunchUrl,
  getTermsOfServiceUrl,
} from '../../constants/legal-env';
import type { MoreStackParamList } from '../../navigation/types';
import { useAppTheme } from '../../theme';

type Props = NativeStackScreenProps<MoreStackParamList, 'LegalInformation'>;

async function openExternal(url: string): Promise<void> {
  try {
    const supported = await Linking.canOpenURL(url);
    if (!supported) {
      Alert.alert('Cannot open link', 'This URL cannot be opened on this device.');
      return;
    }
    await Linking.openURL(url);
  } catch {
    Alert.alert('Cannot open link', 'Something went wrong while opening this link.');
  }
}

function LegalDestRow(props: {
  title: string;
  subtitle: string;
  url?: string;
  icon: LucideIcon;
  hintWhenReady: string;
}): ReactElement {
  const ready = Boolean(props.url);

  return (
    <HubNavRow
      title={props.title}
      subtitle={ready ? props.subtitle : `${props.subtitle} Set EXPO_PUBLIC_* in .env before release.`}
      icon={props.icon}
      disabled={!ready}
      accessibilityHint={ready ? props.hintWhenReady : undefined}
      onPress={() => {
        if (!props.url) return;
        void openExternal(props.url);
      }}
    />
  );
}

/** Privacy policy, terms, support contact, and account deletion entry points for store review. */
export function LegalInformationScreen(_props: Props): ReactElement {
  const { theme } = useAppTheme();

  const privacy = getPrivacyPolicyUrl();
  const terms = getTermsOfServiceUrl();
  const support = getSupportLaunchUrl();
  const deletion = getAccountDeletionUrl();

  return (
    <Screen scroll edges={['left', 'right', 'bottom']}>
      <Typography variant="bodySmall" muted>
        Policy links open in your browser. Configure URLs via EXPO_PUBLIC_* env vars — see docs/MOBILE_STORE_SUBMISSION.md.
      </Typography>

      <Card style={{ marginTop: theme.space.xl }}>
        <LegalDestRow
          title="Privacy policy"
          subtitle="How JobTrackr collects and uses data."
          url={privacy}
          icon={Shield}
          hintWhenReady="Opens the privacy policy in your browser."
        />
        <View style={{ height: 1, backgroundColor: theme.colors.borderMuted }} />
        <LegalDestRow
          title="Terms of service"
          subtitle="Agreement for using JobTrackr."
          url={terms}
          icon={ScrollText}
          hintWhenReady="Opens the terms of service in your browser."
        />
        <View style={{ height: 1, backgroundColor: theme.colors.borderMuted }} />
        <LegalDestRow
          title="Contact support"
          subtitle="Reach us via email or the web."
          url={support}
          icon={LifeBuoy}
          hintWhenReady="Opens support contact."
        />
        <View style={{ height: 1, backgroundColor: theme.colors.borderMuted }} />
        <LegalDestRow
          title="Delete my account"
          subtitle="How to request removal of your account and associated data."
          url={deletion}
          icon={Trash2}
          hintWhenReady="Opens instructions to delete your account."
        />
      </Card>

      <Typography variant="caption" muted style={{ marginTop: theme.space.lg }}>
        Apple and Google require accurate declarations about data collection in App Privacy labels and Play Data Safety.
        Align answers with docs/MOBILE_STORE_SUBMISSION.md before submitting builds.
      </Typography>
    </Screen>
  );
}
