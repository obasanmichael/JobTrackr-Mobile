import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ReactElement } from 'react';
import * as DocumentPicker from 'expo-document-picker';
import { useMemo } from 'react';
import { Pressable, View } from 'react-native';
import { ChevronRight, FileText } from 'lucide-react-native';
import { format, parseISO } from 'date-fns';
import type { ResumeDto, ResumeParseStatus } from '../../types/resume.dto';
import type { MoreStackParamList } from '../../navigation/types';
import { useDomainQueriesEnabled } from '../../hooks/use-domain-queries-enabled';
import { useResumesQuery, useSetActiveResumeMutation, useUploadResumeMutation } from '../../query/jt-queries';
import { Button, Card, EmptyState, LoadingState, Screen, Typography } from '../../components/ui';
import { useAppTheme } from '../../theme';
import { parseAxiosApiError } from '../../services/api';

type Props = NativeStackScreenProps<MoreStackParamList, 'ResumeOverview'>;

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

export function ResumeOverviewScreen({ navigation }: Props): ReactElement {
  const { theme } = useAppTheme();
  const apiOn = useDomainQueriesEnabled();
  const list = useResumesQuery(apiOn);
  const upload = useUploadResumeMutation();
  const setActive = useSetActiveResumeMutation();

  const library = useMemo(
    () => (list.data ?? []).filter((r) => r.status !== 'ARCHIVED'),
    [list.data],
  );

  async function onPickUpload(): Promise<void> {
    const res = await DocumentPicker.getDocumentAsync({
      multiple: false,
      copyToCacheDirectory: true,
      type: [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ],
    });
    if ('canceled' in res && res.canceled) return;
    const asset = res.assets?.[0];
    if (!asset) return;

    await upload.mutateAsync({
      uri: asset.uri,
      name: asset.name ?? 'resume',
      mimeType: asset.mimeType ?? null,
    });
  }

  function errMessage(err: unknown): string {
    const ax = parseAxiosApiError(err);
    if (ax?.message) return ax.message;
    if (err instanceof Error && err.message) return err.message;
    return 'Request failed.';
  }

  const boot = apiOn && list.isPending;
  const mutationsBusy = upload.isPending || setActive.isPending;

  return (
    <Screen scroll edges={['left', 'right', 'bottom']}>
      <Typography variant="hero">Resume</Typography>
      <Typography variant="bodySmall" muted style={{ marginTop: theme.space.sm }}>
        Manage uploads and activate the resume used for AI matching—the same workflows as JobTrackr on the web.
      </Typography>

      <Button
        label={upload.isPending ? 'Uploading…' : 'Upload resume'}
        variant="primary"
        onPress={() => void onPickUpload().catch(() => undefined)}
        style={{ marginTop: theme.space.lg }}
      />

      {upload.isError ? (
        <Typography variant="caption" color={theme.colors.danger} style={{ marginTop: theme.space.sm }}>
          {errMessage(upload.error)}
        </Typography>
      ) : null}

      {!apiOn ? (
        <Typography variant="caption" muted style={{ marginTop: theme.space.lg }}>
          Sign in while EXPO_PUBLIC_API_URL points at your API to sync resume metadata from the workspace.
        </Typography>
      ) : boot ? (
        <LoadingState message="Loading resumes…" />
      ) : list.isError ? (
        <Card style={{ marginTop: theme.space.lg }}>
          <Typography variant="caption" color={theme.colors.danger}>
            {errMessage(list.error)}
          </Typography>
          <Button label="Retry" variant="outline" onPress={() => void list.refetch()} style={{ marginTop: theme.space.md }} />
        </Card>
      ) : library.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No resumes yet"
          description="Pick a PDF or Word file to mirror the multipart upload JobTrackr already supports on desktop."
          actionLabel="Pick a document"
          onActionPress={() => void onPickUpload().catch(() => undefined)}
        />
      ) : (
        <View style={{ marginTop: theme.space.xl, gap: theme.space.md }}>
          <Typography variant="label">Resume library</Typography>
          {library.map((resume) => (
            <ResumeRowCard
              key={resume.id}
              resume={resume}
              mutationsBusy={mutationsBusy}
              onOpen={() => navigation.navigate('ResumeDetail', { resumeId: resume.id })}
              onUseForMatching={
                resume.status === 'PARSED' && !resume.isActive ? () => void setActive.mutate(resume.id) : undefined
              }
            />
          ))}
        </View>
      )}

      {setActive.isError ? (
        <Typography variant="caption" color={theme.colors.danger} style={{ marginTop: theme.space.md }}>
          {errMessage(setActive.error)}
        </Typography>
      ) : null}
    </Screen>
  );
}

function ResumeRowCard(props: {
  resume: ResumeDto;
  mutationsBusy: boolean;
  onOpen: () => void;
  onUseForMatching?: () => void;
}): ReactElement {
  const { resume, mutationsBusy } = props;
  const { theme } = useAppTheme();

  const updated = formatUpdated(resume.updatedAt);
  const fileKb = `${(resume.fileSize / 1024).toFixed(1)} KB`;

  const showParsingNote = resume.status === 'UPLOADED' || resume.status === 'PARSING';

  return (
    <Card style={{ gap: theme.space.sm }}>
      <Pressable accessibilityRole="button" onPress={props.onOpen} style={{ gap: theme.space.xs }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <View style={{ flex: 1, minWidth: 0, paddingRight: theme.space.sm }}>
            <Typography variant="bodySmall" style={{ fontWeight: '700' }} numberOfLines={2}>
              {resume.fileName}
            </Typography>
            <Typography variant="caption" muted style={{ marginTop: theme.space.xs }}>
              {fileKb} · {statusLabel(resume.status)}
              {resume.isActive ? ` · Active` : ''}
            </Typography>
            {updated ? (
              <Typography variant="caption" muted style={{ opacity: 0.9 }}>
                Updated {updated}
              </Typography>
            ) : null}
            {resume.status === 'FAILED' && resume.parseError ? (
              <Typography variant="caption" color={theme.colors.danger} style={{ marginTop: theme.space.xs }}>
                {resume.parseError}
              </Typography>
            ) : null}
          </View>
          <ChevronRight color={theme.colors.textMuted} size={22} strokeWidth={2} style={{ marginTop: 4 }} />
        </View>
      </Pressable>

      {resume.isActive ? (
        <Typography variant="caption" color={theme.colors.accent}>
          Active for workspace matching.
        </Typography>
      ) : null}

      {props.onUseForMatching ? (
        <Button
          label="Use for matching"
          variant="secondary"
          disabled={mutationsBusy}
          onPress={props.onUseForMatching}
          style={{ marginTop: theme.space.xs }}
        />
      ) : null}

      {showParsingNote ? (
        <Typography variant="caption" muted>
          Parsing is still finishing—detail view opens automatically once PARSED completes.
        </Typography>
      ) : null}
    </Card>
  );
}

function formatUpdated(iso: string): string | null {
  try {
    const d = parseISO(iso);
    if (Number.isNaN(+d)) return null;
    return format(d, 'MMM d, yyyy');
  } catch {
    return null;
  }
}
