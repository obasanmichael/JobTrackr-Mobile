import { zodResolver } from '@hookform/resolvers/zod';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ReactElement } from 'react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, View } from 'react-native';
import { AuthBrandHeader } from '../../components/auth/auth-brand-header';
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
    <Screen scroll verticallyCenterScrollContent keyboardAvoiding edges={['top', 'bottom', 'left', 'right']}>
      <AuthBrandHeader />

      <Typography variant="hero" accessibilityRole="header" style={{ marginBottom: theme.space.sm }}>
        Create account
      </Typography>
      <Typography variant="subtitle" muted>
        Use the same credentials on web and mobile.
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
              placeholder="At least 8 characters"
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

        {formError ? (
          <Typography variant="bodySmall" color={theme.colors.danger}>
            {formError}
          </Typography>
        ) : null}

        <Button label="Register" variant="primary" block loading={submitting} hapticOnPress onPress={() => void onSubmit()} />

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
            Already have an account?
          </Typography>
          <Pressable
            onPress={() => navigation.navigate('Login')}
            hitSlop={8}
            accessibilityRole="link"
            accessibilityLabel="Sign in"
            accessibilityHint="Opens sign in."
          >
            <Typography variant="bodySmall" style={{ fontWeight: '600', color: theme.colors.textPrimary }}>
              Sign in
            </Typography>
          </Pressable>
        </View>
      </View>
    </Screen>
  );
}
