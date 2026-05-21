import { zodResolver } from '@hookform/resolvers/zod';
import { Shield } from 'lucide-react-native';
import { useState, type ReactElement } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';
import { Button, Card, TextField, Typography } from '../ui';
import { changePasswordSchema, type ChangePasswordFormValues } from '../../schemas/auth.schemas';
import { changePasswordRequest } from '../../services/auth.service';
import { parseAxiosApiError } from '../../services/api';
import { showErrorFeedback, showSuccessFeedback } from '../../lib/feedback';
import { useAuthStore } from '../../store/auth.store';
import { useAppTheme } from '../../theme';

export function SecuritySettingsCard(): ReactElement {
  const { theme } = useAppTheme();
  const user = useAuthStore((s) => s.user);
  const [submitting, setSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setSubmitting(true);
    try {
      await changePasswordRequest({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      reset();
      showSuccessFeedback('Password updated');
    } catch (error) {
      const parsed = parseAxiosApiError(error);
      showErrorFeedback(parsed?.message ?? 'Could not update password.');
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <Card style={{ gap: theme.space.md }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.space.sm }}>
        <Shield size={18} color={theme.colors.textMuted} strokeWidth={2} />
        <Typography variant="label">Security</Typography>
      </View>
      <Typography variant="caption" muted style={{ marginTop: -theme.space.sm }}>
        Manage your sign-in credentials and account access.
      </Typography>

      <TextField label="Email" value={user?.email ?? ''} editable={false} />
      <Typography variant="caption" muted>
        Email changes are not available yet. Contact support if you need to update your login email.
      </Typography>

      <View style={{ gap: theme.space.md, marginTop: theme.space.sm }}>
        <Typography variant="bodySmall" style={{ fontWeight: '600' }}>
          Change password
        </Typography>

        <Controller
          control={control}
          name="currentPassword"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextField
              label="Current password"
              placeholder="••••••••"
              passwordToggle
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
            />
          )}
        />
        {errors.currentPassword ? (
          <Typography variant="caption" style={{ color: theme.colors.danger }}>
            {errors.currentPassword.message}
          </Typography>
        ) : null}

        <Controller
          control={control}
          name="newPassword"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextField
              label="New password"
              placeholder="••••••••"
              passwordToggle
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
            />
          )}
        />
        {errors.newPassword ? (
          <Typography variant="caption" style={{ color: theme.colors.danger }}>
            {errors.newPassword.message}
          </Typography>
        ) : null}

        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextField
              label="Confirm new password"
              placeholder="••••••••"
              passwordToggle
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
            />
          )}
        />
        {errors.confirmPassword ? (
          <Typography variant="caption" style={{ color: theme.colors.danger }}>
            {errors.confirmPassword.message}
          </Typography>
        ) : null}

        <Button
          label={submitting ? 'Updating…' : 'Update password'}
          block
          loading={submitting}
          onPress={() => void onSubmit()}
        />
      </View>
    </Card>
  );
}
