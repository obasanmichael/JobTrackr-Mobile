import type { ErrorInfo, ReactNode } from 'react';
import { Component } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type Props = { children: ReactNode };

type State = { error: Error | null };

/** Last-resort catch for unexpected render errors — keeps the store build from crashing to a blank screen. */
export class AppErrorBoundary extends Component<Props, State> {
  public state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    if (typeof __DEV__ !== 'undefined' && __DEV__) {
      // eslint-disable-next-line no-console
      console.warn('[AppErrorBoundary]', error.message, info.componentStack);
    }
  }

  private handleRetry = (): void => {
    this.setState({ error: null });
  };

  render(): ReactNode {
    if (this.state.error) {
      return (
        <View style={styles.wrap} accessibilityRole="alert">
          <Text style={styles.title}>Something went wrong</Text>
          <Text style={styles.body}>
            JobTrackr hit an unexpected problem. You can try again—if this keeps happening, restart the app.
          </Text>
          <Pressable accessibilityRole="button" style={styles.btn} onPress={this.handleRetry}>
            <Text style={styles.btnLabel}>Try again</Text>
          </Pressable>
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 28,
    paddingVertical: 32,
    backgroundColor: '#0f172a',
  },
  title: { fontSize: 20, fontWeight: '700', color: '#f8fafc', marginBottom: 12 },
  body: { fontSize: 15, color: '#94a3b8', lineHeight: 22, marginBottom: 24 },
  btn: {
    alignSelf: 'flex-start',
    backgroundColor: '#38bdf8',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  btnLabel: { fontSize: 16, fontWeight: '600', color: '#0f172a' },
});
