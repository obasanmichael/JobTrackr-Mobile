import { zodResolver } from '@hookform/resolvers/zod';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ReactElement } from 'react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';
import { Button, Screen, TextField, Typography } from '../../components/ui';
import type { AuthStackParamList } from '../../navigation/types';
import { registerSchema, type RegisterFormValues } from '../../schemas/auth.schemas';
import { parseAxiosApiError } from '../../services/api';
import { useAuthStore } from '../../store/auth.store';
import { useAppTheme } from '../../theme';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export function RegisterScreen({ navigation }: Props): ReactElement {
  const { theme } = useAppTheme();
  const register = useAuthStore((s) => s.register);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    setSubmitting(true);
    try {
      await register(values);
    } catch (e) {
      const parsed = parseAxiosApiError(e);
      setFormError(parsed?.message ?? 'Could not create account');
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <Screen scroll edges={['top', 'bottom', 'left', 'right']}>
      <Typography variant="hero" style={{ marginBottom: theme.space.sm }}>
        Create account
      </Typography>
      <Typography variant="subtitle" muted>
        Use a real email — you’ll use it to sign in on web and mobile.
      </Typography>

      <View style={{ marginTop: theme.space.xl, gap: theme.space.lg }}>
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextField label="Name" placeholder="Ada Lovelace" value={value} onBlur={onBlur} onChangeText={onChange} />
          )}
        />
        {errors.name ? (
          <Typography variant="caption" color={theme.colors.danger}>
            {errors.name.message}
          </Typography>
        ) : null}

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
              placeholder="At least 8 characters"
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

        <Button label="Register" variant="primary" block loading={submitting} onPress={() => void onSubmit()} />
        <Button label="Already have an account?" variant="ghost" block onPress={() => navigation.navigate('Login')} />
      </View>
    </Screen>
  );
}
