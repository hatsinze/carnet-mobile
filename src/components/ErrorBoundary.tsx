import { Component, type ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from './Button';
import { colors, spacing, typography } from '../theme/tokens';

interface Props {
  children: ReactNode;
}
interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error('Unhandled error caught by ErrorBoundary:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
            <Text style={styles.title}>
                {"Une erreur inattendue s'est produite."}
            </Text>
            <Button label="Redémarrer" onPress={() => this.setState({ hasError: false })} />
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.xxl, backgroundColor: colors.brume },
  title: { ...typography.body, color: colors.ardoise, textAlign: 'center', marginBottom: spacing.lg },
});