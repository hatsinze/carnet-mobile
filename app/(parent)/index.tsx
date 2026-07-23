import { View } from 'react-native';
import { Card } from '../../src/components/Card';
import { StatusBadge } from '../../src/components/StatusBadge';
import { Button } from '../../src/components/Button';
import { spacing } from '../../src/theme/tokens';

export default function AccueilScreen() {
  return (
    <View style={{ flex: 1, padding: spacing.lg, backgroundColor: '#F5F7F8' }}>
      <Card>
        <StatusBadge label="À jour" status="positive" />
        <View style={{ height: 12 }} />
        <StatusBadge label="En retard" status="alert" />
        <View style={{ height: 12 }} />
        <Button label="Voir détails" onPress={() => {}} />
      </Card>
    </View>
  );
}