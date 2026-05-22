import { zodResolver } from '@hookform/resolvers/zod';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ReactElement } from 'react';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';
import { Building2, CheckCircle2 } from 'lucide-react-native';
import type { MoreStackParamList } from '../../navigation/types';
import {
  jobSourceSubmissionSchema,
  type JobSourceSubmissionFormValues,
} from '../../schemas/job-source-submission.schemas';
import { useCreateJobSourceSubmissionMutation } from '../../query/jt-queries';
import { parseAxiosApiError } from '../../services/api';
import type { JobSourceSubmissionDto } from '../../types/job-source-submission.dto';
import { useAuthStore } from '../../store/auth.store';
import { Button, Card, Screen, TextField, Typography } from '../../components/ui';
import { useAppTheme } from '../../theme';

type Props = NativeStackScreenProps<MoreStackParamList, 'SubmitCareersPage'>;

function formatAtsLabel(atsType: string | null): string | null {
  if (!atsType) return null;
  return atsType.charAt(0) + atsType.slice(1).toLowerCase();
}

function SubmissionSuccessCard(props: {
  submission: JobSourceSubmissionDto;
  onSubmitAnother: () => void;
}): ReactElement {
  const { theme } = useAppTheme();
  const atsLabel = formatAtsLabel(props.submission.detectedAtsType);

  return (
    <Card style={{ gap: theme.space.md }}>
      <View style={{ flexDirection: 'row', gap: theme.space.sm }}>
        <CheckCircle2 size={22} color={theme.colors.success} />
        <View style={{ flex: 1, gap: theme.space.xs }}>
          <Typography variant="bodySmall" style={{ fontWeight: '700' }}>
            Thanks, your submission is in review
          </Typography>
          <Typography variant="caption" muted>
            We received {props.submission.companyName} and will queue it for admin
            review before syncing jobs into JobTrackr.
          </Typography>
          {atsLabel && props.submission.detectedSlug ? (
            <Typography variant="caption" muted>
              Detected {atsLabel} board: {props.submission.detectedSlug}
            </Typography>
          ) : (
            <Typography variant="caption" muted>
              We could not auto-detect a supported ATS from this URL. An admin will
              review it manually.
            </Typography>
          )}
        </View>
      </View>
      <Button label="Submit another" variant="outline" onPress={props.onSubmitAnother} />
    </Card>
  );
}

export function SubmitCareersPageScreen(_props: Props): ReactElement {
  const { theme } = useAppTheme();
  const user = useAuthStore((s) => s.user);
  const createSubmission = useCreateJobSourceSubmissionMutation();
  const [completedSubmission, setCompletedSubmission] =
    useState<JobSourceSubmissionDto | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<JobSourceSubmissionFormValues>({
    resolver: zodResolver(jobSourceSubmissionSchema),
    defaultValues: {
      companyName: '',
      careersUrl: '',
      submitterEmail: user?.email ?? '',
    },
  });

  useEffect(() => {
    if (user?.email) {
      setValue('submitterEmail', user.email);
    }
  }, [user?.email, setValue]);

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    try {
      const submission = await createSubmission.mutateAsync({
        companyName: values.companyName.trim(),
        careersUrl: values.careersUrl.trim(),
        ...(values.submitterEmail?.trim()
          ? { submitterEmail: values.submitterEmail.trim() }
          : {}),
      });
      setCompletedSubmission(submission);
    } catch (error) {
      setFormError(parseAxiosApiError(error, 'Could not submit careers page.'));
    }
  });

  const submitAnother = (): void => {
    setCompletedSubmission(null);
    setFormError(null);
    reset({
      companyName: '',
      careersUrl: '',
      submitterEmail: user?.email ?? '',
    });
  };

  return (
    <Screen scroll keyboardAvoiding edges={['left', 'right', 'bottom']}>
      <Typography variant="bodySmall" muted style={{ marginTop: theme.space.sm }}>
        Suggest a company job board for review. Greenhouse, Lever, and Ashby URLs are
        auto-detected when possible.
      </Typography>

      {completedSubmission ? (
        <View style={{ marginTop: theme.space.xl }}>
          <SubmissionSuccessCard
            submission={completedSubmission}
            onSubmitAnother={submitAnother}
          />
        </View>
      ) : (
        <View style={{ marginTop: theme.space.xl, gap: theme.space.lg }}>
          <Card style={{ flexDirection: 'row', gap: theme.space.sm }}>
            <Building2 size={20} color={theme.colors.textMuted} />
            <Typography variant="caption" muted style={{ flex: 1 }}>
              Paste the public careers URL. Duplicate pending submissions for the same
              URL are rejected.
            </Typography>
          </Card>

          <Controller
            control={control}
            name="companyName"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextField
                label="Company name"
                placeholder="Acme Corp"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
              />
            )}
          />
          {errors.companyName ? (
            <Typography variant="caption" color={theme.colors.danger}>
              {errors.companyName.message}
            </Typography>
          ) : null}

          <Controller
            control={control}
            name="careersUrl"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextField
                label="Careers page URL"
                placeholder="https://boards.greenhouse.io/acme"
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="url"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
              />
            )}
          />
          {errors.careersUrl ? (
            <Typography variant="caption" color={theme.colors.danger}>
              {errors.careersUrl.message}
            </Typography>
          ) : null}

          <Controller
            control={control}
            name="submitterEmail"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextField
                label="Your email (optional)"
                placeholder="you@example.com"
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
              />
            )}
          />
          {errors.submitterEmail ? (
            <Typography variant="caption" color={theme.colors.danger}>
              {errors.submitterEmail.message}
            </Typography>
          ) : null}

          {formError ? (
            <Typography variant="caption" color={theme.colors.danger}>
              {formError}
            </Typography>
          ) : null}

          <Button
            label="Submit for review"
            loading={createSubmission.isPending}
            hapticOnPress
            block
            onPress={() => void onSubmit()}
          />
        </View>
      )}
    </Screen>
  );
}
