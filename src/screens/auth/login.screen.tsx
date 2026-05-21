import { zodResolver } from '@hookform/resolvers/zod';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ReactElement } from 'react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, View } from 'react-native';
import { AuthBrandHeader } from '../../components/auth/auth-brand-header';
import { Button, Screen, TextField, Typography } from '../../components/ui';
import type { AuthStackParamList } from '../../navigation/types';
import { loginSchema, type LoginFormValues } from '../../schemas/auth.schemas';
import { parseAxiosApiError } from '../../services/api';
import { useAuthStore } from '../../store/auth.store';
import { useAppTheme } from '../../theme';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export function LoginScreen({ navigation }: Props): ReactElement {
  const { theme } = useAppTheme();
  const login = useAuthStore((s) => s.login);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    setSubmitting(true);
    try {
      await login(values);
    } catch (e) {
      const parsed = parseAxiosApiError(e);
      setFormError(parsed?.message ?? 'Sign-in failed');
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <Screen scroll verticallyCenterScrollContent keyboardAvoiding edges={['top', 'bottom', 'left', 'right']}>
      <AuthBrandHeader />

      <Typography variant="hero" accessibilityRole="header" style={{ marginBottom: theme.space.sm }}>
        Welcome back
      </Typography>
      <Typography variant="subtitle" muted>
        Sign in to your JobTrackr account
      </Typography>

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
          <Typography variant="caption" color={theme.colors.danger}>
            {errors.email.message}
          </Typography>
        ) : null}

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextField
              label="Password"
              placeholder="••••••••"
              passwordToggle
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
            />
          )}
        />
        {errors.password ? (
          <Typography variant="caption" color={theme.colors.danger}>
            {errors.password.message}
          </Typography>
        ) : null}

        <Pressable
          onPress={() => navigation.navigate('ForgotPassword')}
          hitSlop={8}
          accessibilityRole="link"
          accessibilityLabel="Forgot password"
          style={{ alignSelf: 'flex-start' }}
        >
          <Typography variant="caption" style={{ fontWeight: '600', color: theme.colors.textPrimary }}>
            Forgot password?
          </Typography>
        </Pressable>

        {formError ? (
          <Typography variant="bodySmall" color={theme.colors.danger}>
            {formError}
          </Typography>
        ) : null}

        <Button label="Sign in" variant="primary" block loading={submitting} hapticOnPress onPress={() => void onSubmit()} />

        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: theme.space.sm,
            gap: 4,
          }}
        >
          <Typography variant="bodySmall" muted>
            Don&apos;t have an account?
          </Typography>
          <Pressable
            onPress={() => navigation.navigate('Register')}
            hitSlop={8}
            accessibilityRole="link"
            accessibilityLabel="Create account"
            accessibilityHint="Opens registration."
          >
            <Typography variant="bodySmall" style={{ fontWeight: '600', color: theme.colors.textPrimary }}>
              Create one
            </Typography>
          </Pressable>
        </View>
      </View>
    </Screen>
  );
}
