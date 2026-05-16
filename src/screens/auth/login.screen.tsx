import { zodResolver } from '@hookform/resolvers/zod';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ReactElement } from 'react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';
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
    <Screen scroll edges={['top', 'bottom', 'left', 'right']}>
      <Typography variant="hero" style={{ marginBottom: theme.space.sm }}>
        Welcome back
      </Typography>
      <Typography variant="subtitle" muted>
        Sign in with the same account as the web app.
      </Typography>

      <View style={{ marginTop: theme.space.xl, gap: theme.space.lg }}>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextField
              label="Email"
              placeholder="you@company.com"
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
              secureTextEntry
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

        {formError ? (
          <Typography variant="bodySmall" color={theme.colors.danger}>
            {formError}
          </Typography>
        ) : null}

        <Button label="Sign in" variant="primary" block loading={submitting} onPress={() => void onSubmit()} />
        <Button label="Create an account" variant="secondary" block onPress={() => navigation.navigate('Register')} />
      </View>
    </Screen>
  );
}
