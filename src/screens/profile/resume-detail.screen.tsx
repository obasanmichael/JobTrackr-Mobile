import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ReactElement } from 'react';
import { View } from 'react-native';
import type { ResumeParseStatus } from '../../types/resume.dto';
import type { ProfileStackParamList } from '../../navigation/types';
import { useDomainQueriesEnabled } from '../../hooks/use-domain-queries-enabled';
import { useCandidateProfileQuery, useResumeDetailQuery } from '../../query/jt-queries';
import { Card, EmptyState, LoadingState, Screen, Typography } from '../../components/ui';
import { useAppTheme } from '../../theme';
import { parseAxiosApiError } from '../../services/api';

type Props = NativeStackScreenProps<ProfileStackParamList, 'ResumeDetail'>;

function statusLabel(status: ResumeParseStatus): string {
  switch (status) {
    case 'UPLOADED':
      return 'Uploaded';
    case 'PARSING':
      return 'Parsing';
    case 'PARSED':
      return 'Parsed';
    case 'FAILED':
      return 'Parse failed';
    case 'ARCHIVED':
      return 'Archived';
    default:
      return status;
  }
}

export function ResumeDetailScreen(props: Props): ReactElement {
  const { resumeId } = props.route.params;
  const { theme } = useAppTheme();
  const apiOn = useDomainQueriesEnabled();

  const resume = useResumeDetailQuery(apiOn, resumeId);

  const profile = useCandidateProfileQuery(Boolean(apiOn && resume.data?.status === 'PARSED'), resumeId);
  function errStr(err: unknown): string {
    const ax = parseAxiosApiError(err);
    if (ax?.message) return ax.message;
    if (err instanceof Error) return err.message;
    return 'Request failed.';
  }

  const bootResume = apiOn && resume.isPending;

  return (
    <Screen scroll edges={['top', 'left', 'right', 'bottom']}>
      <Typography variant="hero">Resume details</Typography>
      <Typography variant="bodySmall" muted style={{ marginTop: theme.space.sm }}>
        Mirrors the structured profile JobTrackr extracts on web—fine-grained edits stay quickest on desktop for now.
      </Typography>

      {!apiOn ? (
        <Card style={{ marginTop: theme.space.lg }}>
          <Typography variant="caption" muted>Sign in once your workspace URL is configured to load resumes.</Typography>
        </Card>
      ) : bootResume ? (
        <LoadingState message="Fetching resume metadata…" />
      ) : resume.isError ? (
        <Typography variant="caption" color={theme.colors.danger} style={{ marginTop: theme.space.lg }}>
          {errStr(resume.error)}
        </Typography>
      ) : !resume.data ? (
        <EmptyState title="Resume not found" description="Pull to reopen the library—the ID may no longer exist." />
      ) : (
        <>
          <Card style={{ marginTop: theme.space.lg, gap: theme.space.sm }}>
            <Typography variant="bodySmall" style={{ fontWeight: '700' }} numberOfLines={3}>
              {resume.data.fileName}
            </Typography>
            <Typography variant="caption" muted>
              {(resume.data.fileSize / 1024).toFixed(1)} KB · {statusLabel(resume.data.status)}
              {resume.data.isActive ? ' · Active' : ''}
            </Typography>
            {resume.data.parseError ? (
              <Typography variant="caption" color={theme.colors.danger}>
                {resume.data.parseError}
              </Typography>
            ) : null}
          </Card>

          {resume.data.status !== 'PARSED' ? (
            <Card style={{ marginTop: theme.space.md }}>
              <Typography variant="caption" muted>
                Parsed profile fields unlock after ingestion finishes—the same pacing you see between UPLOADED/PARSING and PARSED states on web.
              </Typography>
            </Card>
          ) : profile.isPending ? (
            <View style={{ marginTop: theme.space.md }}>
              <LoadingState message="Loading candidate profile snapshot…" />
            </View>
          ) : profile.isError ? (
            <Typography variant="caption" color={theme.colors.danger} style={{ marginTop: theme.space.md }}>
              {errStr(profile.error)}
            </Typography>
          ) : profile.data ? (
            <>
              <ProfileSection title="Headline">{profile.data.headline}</ProfileSection>
              <ProfileSection title="Summary">{profile.data.summary}</ProfileSection>

              <ProfileListSection title="Skills" rows={profile.data.skills} />
              <ProfileListSection title="Tools" rows={profile.data.tools} />
              <ProfileListSection title="Target roles" rows={profile.data.roles} />
              <ProfileListSection title="Industries" rows={profile.data.industries} />

              <ProfileSection title="Years of experience">
                {profile.data.yearsOfExperience != null ? String(profile.data.yearsOfExperience) : null}
              </ProfileSection>

              <ProfileListSection title="Preferred locations" rows={profile.data.locations} />
              <ProfileListSection title="Preferred work modes" rows={profile.data.workModes} />
              <ProfileListSection title="Education" rows={profile.data.educationLines} />
              <ProfileListSection title="Projects" rows={profile.data.projectLines} />
              <ProfileListSection title="Experience snippets" rows={profile.data.experienceLines} />

              {!profile.data.isConfirmed ? (
                <Typography variant="caption" muted style={{ marginTop: theme.space.lg }}>
                  Profile awaits confirmation workflows that stay primary on desktop for richer editing ergonomics.
                </Typography>
              ) : null}
            </>
          ) : (
            <Typography variant="caption" muted style={{ marginTop: theme.space.md }}>
              Parsed snapshot is syncing—give it another moment after the analyzer finishes on the server.
            </Typography>
          )}
        </>
      )}
    </Screen>
  );
}

function ProfileSection(props: {
  title: string;
  children?: string | null;
}): ReactElement | null {
  const { theme } = useAppTheme();
  if (!props.children?.trim()) return null;
  return (
    <Card style={{ marginTop: theme.space.md }}>
      <Typography variant="label" style={{ letterSpacing: 1 }}>
        {props.title}
      </Typography>
      <Typography variant="bodySmall" style={{ marginTop: theme.space.sm }}>
        {props.children}
      </Typography>
    </Card>
  );
}

function ProfileListSection(props: { title: string; rows: string[] }): ReactElement | null {
  const { theme } = useAppTheme();
  const rows = props.rows.filter((r) => r.trim().length > 0);
  if (!rows.length) return null;
  return (
    <Card style={{ marginTop: theme.space.md, gap: theme.space.sm }}>
      <Typography variant="label" style={{ letterSpacing: 1 }}>
        {props.title}
      </Typography>
      {rows.slice(0, 30).map((line, idx) => (
        <Typography key={`${props.title}:${idx}:${line}`} variant="caption" muted style={{ paddingLeft: theme.space.sm }}>
          · {line}
        </Typography>
      ))}
      {rows.length > 30 ? (
        <Typography variant="caption" muted>
          +{rows.length - 30} more…
        </Typography>
      ) : null}
    </Card>
  );
}
