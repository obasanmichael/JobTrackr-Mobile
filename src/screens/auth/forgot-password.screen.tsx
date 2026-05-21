import { zodResolver } from '@hookform/resolvers/zod';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ReactElement } from 'react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, View } from 'react-native';
import { AuthBrandHeader } from '../../components/auth/auth-brand-header';
import { Button, Screen, TextField, Typography } from '../../components/ui';
import type { AuthStackParamList } from '../../navigation/types';
import { forgotPasswordSchema, type ForgotPasswordFormValues } from '../../schemas/auth.schemas';
import { forgotPasswordRequest } from '../../services/auth.service';
import { parseAxiosApiError } from '../../services/api';
import { showErrorFeedback, showSuccessFeedback } from '../../lib/feedback';
import { useAppTheme } from '../../theme';

type Props = NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>;

export function ForgotPasswordScreen({ navigation }: Props): ReactElement {
  const { theme } = useAppTheme();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    setSubmitting(true);
    try {
      const response = await forgotPasswordRequest(values);
      setSubmitted(true);
      showSuccessFeedback(response.message);
    } catch (error) {
      const parsed = parseAxiosApiError(error);
      showErrorFeedback(parsed?.message ?? 'Could not send reset email.');
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <Screen scroll verticallyCenterScrollContent keyboardAvoiding edges={['top', 'bottom', 'left', 'right']}>
      <AuthBrandHeader />

      <Typography variant="hero" accessibilityRole="header" style={{ marginBottom: theme.space.sm }}>
        Reset your password
      </Typography>
      <Typography variant="subtitle" muted>
        {submitted
          ? 'If an account exists for that email, we sent instructions to reset your password.'
          : 'Enter your email and we will send you a reset link.'}
      </Typography>

      {submitted ? (
        <View style={{ marginTop: theme.space.xl, gap: theme.space.lg }}>
          <Typography variant="bodySmall" muted>
            Check your inbox and open the link to choose a new password. The link expires in about an hour.
            Password reset links open in your browser.
          </Typography>
          <Button label="Back to sign in" block onPress={() => navigation.navigate('Login')} />
        </View>
      ) : (
        <View style={{ marginTop: theme.space.xl, gap: theme.space.lg }}>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextField
                label="Email"
                placeholder="you@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
              />
            )}
          />
          {errors.email ? (
            <Typography variant="caption" style={{ color: theme.colors.danger }}>
              {errors.email.message}
            </Typography>
          ) : null}

          <Button
            label={submitting ? 'Sending…' : 'Send reset link'}
            block
            loading={submitting}
            onPress={() => void onSubmit()}
          />
        </View>
      )}

      <Pressable
        onPress={() => navigation.navigate('Login')}
        hitSlop={8}
        style={{ marginTop: theme.space.xl, alignSelf: 'center' }}
        accessibilityRole="link"
      >
        <Typography variant="bodySmall" style={{ fontWeight: '600', color: theme.colors.textPrimary }}>
          Back to sign in
        </Typography>
      </Pressable>
    </Screen>
  );
}
