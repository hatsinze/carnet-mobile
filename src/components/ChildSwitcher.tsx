import { useState } from 'react';
import { View, Text, Pressable, Modal, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Avatar } from './Avatar';
import { useChildContext } from '../features/children/ChildContext';
import { colors, radius, spacing, typography } from '../theme/tokens';

export function ChildSwitcher() {
  const { children, selectedChild, selectChild } = useChildContext();
  const [visible, setVisible] = useState(false);

  const hasMultiple = children.length > 1;

  const others = children.filter((c) => c.id !== selectedChild?.id).slice(0, 2);

  return (
    <>
      <Pressable 
        style={styles.trigger} 
        onPress={() => setVisible(true)}
      >
        <Avatar name={`${selectedChild?.prenom ?? ''} ${selectedChild?.nom ?? ''}`} size={36} />
        <View style={styles.triggerInfo}>
          <Text style={styles.triggerLabel}>
            {hasMultiple ? 'Enfant sélectionné' : 'Mon enfant'}
          </Text>
          <Text style={styles.triggerName} numberOfLines={1}>
            {selectedChild?.prenom} {selectedChild?.nom}
          </Text>
        </View>
        {hasMultiple ? (
          <>
            <View style={styles.stack}>
              {others.map((c, i) => (
                <View key={c.id} style={[styles.stackAvatar, i > 0 && { marginLeft: -12 }]}>
                  <Avatar name={`${c.prenom} ${c.nom}`} size={26} />
                </View>
              ))}
            </View>
            <Ionicons name="chevron-down" size={16} color={colors.ardoiseMuted} style={{ marginLeft: spacing.xs }} />
          </>
        ) : (
          <View style={styles.singleChildBadge}>
            <Text style={styles.singleChildBadgeText}>Unique</Text>
            <Ionicons name="chevron-down" size={14} color={colors.ardoiseMuted} style={{ marginLeft: 4 }} />
          </View>
        )}
      </Pressable>

      <Modal visible={visible} animationType="slide" transparent onRequestClose={() => setVisible(false)}>
        <Pressable style={styles.backdrop} onPress={() => setVisible(false)}>
          <View style={styles.sheet}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>
              {hasMultiple ? 'Choisir un enfant' : 'Mon enfant'}
            </Text>
            {!hasMultiple && (
              <Text style={styles.sheetSubtitle}>
                Vous n&apos;avez qu&apos;un seul enfant enregistré.
              </Text>
            )}
            <FlatList
              data={children}
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item }) => {
                const isActive = item.id === selectedChild?.id;
                return (
                  <Pressable
                    style={[styles.row, isActive && styles.rowActive]}
                    onPress={() => { 
                      if (hasMultiple) {
                        selectChild(item); 
                        setVisible(false);
                      }
                    }}
                    disabled={!hasMultiple}
                  >
                    <Avatar name={`${item.prenom} ${item.nom}`} size={44} />
                    <View style={styles.rowInfo}>
                      <Text style={[styles.rowName, !hasMultiple && styles.rowNameDisabled]}>{item.prenom} {item.nom}</Text>
                      {item.classe && <Text style={styles.rowClasse}>{item.classe.nom}</Text>}
                    </View>
                    {isActive && <Ionicons name="checkmark-circle" size={22} color={colors.encre} />}
                    {!hasMultiple && (
                      <Text style={styles.singleRowBadge}>Actif</Text>
                    )}
                  </Pressable>
                );
              }}
            />
            {!hasMultiple && (
              <View style={styles.singleFooter}>
                <Text style={styles.singleFooterText}>
                  Pour ajouter un autre enfant, contactez l&apos;administration.
                </Text>
              </View>
            )}
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: colors.blanc, 
    borderWidth: 1, 
    borderColor: colors.ligne, 
    borderRadius: radius.md, 
    paddingVertical: spacing.sm, 
    paddingHorizontal: spacing.md, 
    marginHorizontal: spacing.lg, 
    marginBottom: spacing.md 
  },
  triggerInfo: { flex: 1, marginLeft: spacing.sm, minWidth: 0 },
  triggerLabel: { fontSize: 11, color: colors.ardoiseMuted },
  triggerName: { fontSize: 14, fontWeight: '600', color: colors.ardoise, marginTop: 1 },
  stack: { flexDirection: 'row', alignItems: 'center' },
  stackAvatar: { borderWidth: 2, borderColor: colors.blanc, borderRadius: 999 },
  singleChildBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.brume,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
    marginRight: spacing.xs,
  },
  singleChildBadgeText: {
    fontSize: 10,
    color: colors.ardoiseMuted,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: colors.blanc, borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg, padding: spacing.lg, maxHeight: '60%' },
  sheetHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: colors.ligne, alignSelf: 'center', marginBottom: spacing.md },
  sheetTitle: { ...typography.h2, fontSize: 17, color: colors.ardoise, marginBottom: spacing.xs },
  sheetSubtitle: { fontSize: 13, color: colors.ardoiseMuted, marginBottom: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md, borderRadius: radius.md, paddingHorizontal: spacing.sm },
  rowActive: { backgroundColor: colors.brume },
  rowInfo: { flex: 1, marginLeft: spacing.md },
  rowName: { fontSize: 15, fontWeight: '600', color: colors.ardoise },
  rowNameDisabled: { opacity: 0.7 },
  rowClasse: { fontSize: 13, color: colors.ardoiseMuted, marginTop: 2 },
  singleRowBadge: {
    fontSize: 11,
    color: colors.sauge,
    fontWeight: '500',
    backgroundColor: colors.saugeLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  singleFooter: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.ligne,
    alignItems: 'center',
  },
  singleFooterText: {
    fontSize: 12,
    color: colors.ardoiseMuted,
    textAlign: 'center',
  },
});