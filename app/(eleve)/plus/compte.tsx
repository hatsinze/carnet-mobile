import { useState } from 'react';
import { View, Text, TextInput, Pressable, Switch, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenHeader } from '../../../src/components/ScreenHeader';
import { Avatar } from '../../../src/components/Avatar';
import { FadeInUp } from '../../../src/components/Motion';
import { useTheme } from '../../../src/features/theme/ThemeContext';
import { useAuth } from '../../../src/features/auth/AuthContext';
import { useUpdateAccount } from '../../../src/hooks/useUpdateAccount';
import { useChangePassword } from '../../../src/hooks/useChangePassword';
import { syncDeviceToken, unregisterDeviceToken } from '../../../src/hooks/useDeviceToken';
import { fonts, radius, spacing } from '../../../src/theme/tokens';

function MenuItem({ icon, label, value, children, colors }: { icon: keyof typeof Ionicons.glyphMap; label: string; value?: string; children?: React.ReactNode; colors: any }) {
  return (
    <View style={styles.menuItem}>
      <View style={styles.menuItemRow}>
        <View style={[styles.iconContainer, { backgroundColor: colors.brume }]}>
          <Ionicons name={icon} size={20} color={colors.ardoise} />
        </View>
        <View style={styles.menuItemContent}>
          <Text style={[styles.menuItemLabel, { color: colors.ardoiseMuted }]}>{label}</Text>
          {children ?? <Text style={[styles.menuItemValue, { color: colors.ardoise }]}>{value}</Text>}
        </View>
      </View>
    </View>
  );
}

export default function CompteScreen() {
  const { user, logout, refreshUser } = useAuth();
  const { colors } = useTheme();
  const updateAccount = useUpdateAccount();
  const changePassword = useChangePassword();

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name ?? '');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(true);

  if (!user) return null;
  const eleve = user.eleve;

  async function handleSaveProfile() {
    setSaveSuccess(false);
    await updateAccount.mutateAsync({ name });
    await refreshUser();
    setSaveSuccess(true);
    setEditing(false);
    setTimeout(() => setSaveSuccess(false), 2500);
  }

  async function handleChangePassword() {
    setPasswordError(null);
    if (newPassword !== newPasswordConfirm) { setPasswordError('Les mots de passe ne correspondent pas.'); return; }
    try {
      await changePassword.mutateAsync({ current_password: currentPassword, password: newPassword, password_confirmation: newPasswordConfirm });
      setPasswordSuccess(true);
      setCurrentPassword(''); setNewPassword(''); setNewPasswordConfirm('');
      setTimeout(() => { setPasswordSuccess(false); setShowPasswordForm(false); }, 2000);
    } catch (e: any) {
      setPasswordError(e?.response?.data?.errors?.current_password?.[0] ?? 'Une erreur est survenue.');
    }
  }

  async function handlePushToggle(value: boolean) {
    setPushEnabled(value);
    if (value) await syncDeviceToken(); else await unregisterDeviceToken();
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.brume }}>
      <ScreenHeader title="Mon compte" fallbackRoute="/(eleve)/plus" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <FadeInUp delay={80}>
          <View style={styles.profileHeader}>
            <Avatar name={user.name} size={72} />
            <View style={styles.profileInfo}>
              <Text style={[styles.userName, { color: colors.ardoise }]}>{user.name}</Text>
              <Text style={[styles.userEmail, { color: colors.ardoiseMuted }]}>{user.email}</Text>
              <View style={[styles.roleBadge, { backgroundColor: colors.encreLight }]}><Text style={[styles.roleBadgeText, { color: colors.encre }]}>Élève</Text></View>
            </View>
          </View>
        </FadeInUp>

        <FadeInUp delay={120}>
          <Text style={[styles.sectionTitle, { color: colors.ardoiseMuted }]}>Informations</Text>
          <View style={[styles.section, { backgroundColor: colors.blanc, borderColor: colors.ligne }]}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionHeaderTitle, { color: colors.ardoise }]}>Profil</Text>
              <Pressable onPress={() => setEditing((e) => !e)}><Text style={[styles.editButton, { color: colors.encre }]}>{editing ? 'Annuler' : 'Modifier'}</Text></Pressable>
            </View>
            <MenuItem icon="person-outline" label="Nom complet" colors={colors}>
              {editing ? (
                <TextInput style={[styles.input, { color: colors.ardoise, backgroundColor: colors.brume, borderColor: colors.ligne }]} value={name} onChangeText={setName} placeholderTextColor={colors.ardoiseMuted} />
              ) : (
                <Text style={[styles.menuItemValue, { color: colors.ardoise }]}>{user.name}</Text>
              )}
            </MenuItem>
            <View style={[styles.separator, { backgroundColor: colors.ligne }]} />
            <MenuItem icon="barcode-outline" label="Matricule" value={eleve?.matricule ?? '—'} colors={colors} />
            <View style={[styles.separator, { backgroundColor: colors.ligne }]} />
            <MenuItem icon="mail-outline" label="Email" colors={colors}>
              <Text style={[styles.menuItemValue, { color: colors.ardoise }]}>{user.email}</Text>
              <Text style={[styles.adminNote, { color: colors.ardoiseMuted }]}>Modifiable uniquement par l&apos;administration</Text>
            </MenuItem>
          </View>

          {editing && (
            <Pressable style={[styles.saveButton, { backgroundColor: colors.encre }, updateAccount.isPending && styles.buttonDisabled]} onPress={handleSaveProfile} disabled={updateAccount.isPending}>
              <Text style={styles.saveButtonText}>{updateAccount.isPending ? 'Enregistrement…' : 'Enregistrer les modifications'}</Text>
            </Pressable>
          )}
          {saveSuccess && (
            <View style={styles.successRow}><Ionicons name="checkmark-circle" size={16} color={colors.sauge} /><Text style={[styles.successText, { color: colors.sauge }]}>Profil mis à jour</Text></View>
          )}
        </FadeInUp>

        <FadeInUp delay={160}>
          <Text style={[styles.sectionTitle, { color: colors.ardoiseMuted, marginTop: spacing.lg }]}>Sécurité</Text>
          <View style={[styles.section, { backgroundColor: colors.blanc, borderColor: colors.ligne }]}>
            {showPasswordForm ? (
              <>
                <View style={styles.sectionHeader}>
                  <Text style={[styles.sectionHeaderTitle, { color: colors.ardoise }]}>Changer le mot de passe</Text>
                  <Pressable onPress={() => setShowPasswordForm(false)}><Text style={[styles.editButton, { color: colors.encre }]}>Annuler</Text></Pressable>
                </View>
                <MenuItem icon="lock-closed-outline" label="Mot de passe actuel" colors={colors}>
                  <TextInput style={[styles.input, { color: colors.ardoise, backgroundColor: colors.brume, borderColor: colors.ligne }]} value={currentPassword} onChangeText={setCurrentPassword} secureTextEntry placeholderTextColor={colors.ardoiseMuted} />
                </MenuItem>
                <View style={[styles.separator, { backgroundColor: colors.ligne }]} />
                <MenuItem icon="key-outline" label="Nouveau mot de passe" colors={colors}>
                  <TextInput style={[styles.input, { color: colors.ardoise, backgroundColor: colors.brume, borderColor: colors.ligne }]} value={newPassword} onChangeText={setNewPassword} secureTextEntry placeholderTextColor={colors.ardoiseMuted} />
                </MenuItem>
                <View style={[styles.separator, { backgroundColor: colors.ligne }]} />
                <MenuItem icon="checkmark-done-outline" label="Confirmer" colors={colors}>
                  <TextInput style={[styles.input, { color: colors.ardoise, backgroundColor: colors.brume, borderColor: colors.ligne }]} value={newPasswordConfirm} onChangeText={setNewPasswordConfirm} secureTextEntry placeholderTextColor={colors.ardoiseMuted} />
                </MenuItem>
                {passwordError && <Text style={[styles.errorText, { color: colors.brique }]}>{passwordError}</Text>}
                <Pressable style={[styles.saveButton, { backgroundColor: colors.encre, marginTop: spacing.md }, changePassword.isPending && styles.buttonDisabled]} onPress={handleChangePassword} disabled={changePassword.isPending}>
                  <Text style={styles.saveButtonText}>{changePassword.isPending ? 'Modification…' : 'Changer le mot de passe'}</Text>
                </Pressable>
                {passwordSuccess && <View style={styles.successRow}><Ionicons name="checkmark-circle" size={16} color={colors.sauge} /><Text style={[styles.successText, { color: colors.sauge }]}>Mot de passe modifié</Text></View>}
              </>
            ) : (
              <Pressable style={styles.menuItemPressable} onPress={() => setShowPasswordForm(true)}>
                <View style={styles.menuItemRow}>
                  <View style={[styles.iconContainer, { backgroundColor: colors.brume }]}><Ionicons name="lock-closed-outline" size={20} color={colors.ardoise} /></View>
                  <View style={styles.menuItemContent}>
                    <Text style={[styles.menuItemLabel, { color: colors.ardoiseMuted }]}>Mot de passe</Text>
                    <Text style={[styles.menuItemValue, { color: colors.ardoise }]}>••••••••</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={colors.ardoiseMuted} />
                </View>
              </Pressable>
            )}
          </View>
        </FadeInUp>

        <FadeInUp delay={200}>
          <Text style={[styles.sectionTitle, { color: colors.ardoiseMuted, marginTop: spacing.lg }]}>Préférences</Text>
          <View style={[styles.section, { backgroundColor: colors.blanc, borderColor: colors.ligne }]}>
            <View style={styles.toggleItem}>
              <View style={styles.toggleLeft}>
                <View style={[styles.iconContainer, { backgroundColor: colors.brume }]}><Ionicons name="notifications-outline" size={20} color={colors.ardoise} /></View>
                <View>
                  <Text style={[styles.toggleLabel, { color: colors.ardoise }]}>Notifications push</Text>
                  <Text style={[styles.toggleSubtext, { color: colors.ardoiseMuted }]}>Recevoir les alertes sur cet appareil</Text>
                </View>
              </View>
              <Switch value={pushEnabled} onValueChange={handlePushToggle} trackColor={{ false: colors.ligne, true: colors.encre }} thumbColor="#FFFFFF" />
            </View>
          </View>
        </FadeInUp>

        <FadeInUp delay={240}>
          <Pressable style={[styles.logoutButton, { backgroundColor: colors.briqueLight, borderColor: colors.brique }]} onPress={logout}>
            <Ionicons name="log-out-outline" size={22} color={colors.brique} />
            <Text style={[styles.logoutText, { color: colors.brique }]}>Se déconnecter</Text>
          </Pressable>
        </FadeInUp>

        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: spacing.md, paddingBottom: spacing.md },
  profileHeader: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.lg, paddingHorizontal: spacing.md, gap: spacing.md },
  profileInfo: { flex: 1 },
  userName: { fontFamily: fonts.displaySemiBold, fontSize: 20 },
  userEmail: { fontFamily: fonts.body, fontSize: 14, marginTop: 2 },
  roleBadge: { paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: radius.sm, alignSelf: 'flex-start', marginTop: spacing.xs },
  roleBadgeText: { fontFamily: fonts.bodySemiBold, fontSize: 11 },
  sectionTitle: { fontFamily: fonts.bodyMedium, fontSize: 13, letterSpacing: 0.3, textTransform: 'uppercase', marginBottom: spacing.sm, paddingHorizontal: spacing.xs },
  section: { borderRadius: radius.md, borderWidth: 1, overflow: 'hidden' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.md, paddingTop: spacing.md, paddingBottom: spacing.xs },
  sectionHeaderTitle: { fontFamily: fonts.bodySemiBold, fontSize: 14 },
  editButton: { fontFamily: fonts.bodyMedium, fontSize: 13 },
  menuItem: { paddingHorizontal: spacing.md, paddingVertical: spacing.xs },
  menuItemPressable: { paddingHorizontal: spacing.md, paddingVertical: spacing.xs },
  menuItemRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.xs },
  iconContainer: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  menuItemContent: { flex: 1 },
  menuItemLabel: { fontFamily: fonts.bodyMedium, fontSize: 12 },
  menuItemValue: { fontFamily: fonts.body, fontSize: 16, marginTop: 2 },
  adminNote: { fontFamily: fonts.body, fontSize: 12, marginTop: 2, opacity: 0.7 },
  separator: { height: 1, marginHorizontal: spacing.md },
  input: { fontFamily: fonts.body, fontSize: 16, borderWidth: 1, paddingVertical: 8, paddingHorizontal: 12, borderRadius: radius.sm, marginTop: 4 },
  toggleItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  toggleLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, flex: 1 },
  toggleLabel: { fontFamily: fonts.body, fontSize: 16 },
  toggleSubtext: { fontFamily: fonts.body, fontSize: 12, marginTop: 1 },
  saveButton: { borderRadius: radius.md, paddingVertical: spacing.md, alignItems: 'center', marginTop: spacing.md },
  saveButtonText: { fontFamily: fonts.bodySemiBold, fontSize: 14, color: '#FFFFFF' },
  buttonDisabled: { opacity: 0.6 },
  successRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: spacing.sm, justifyContent: 'center' },
  successText: { fontFamily: fonts.bodyMedium, fontSize: 13 },
  errorText: { fontFamily: fonts.body, fontSize: 13, marginTop: spacing.xs, textAlign: 'center' },
  logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, borderRadius: radius.md, padding: spacing.md, marginTop: spacing.xl, borderWidth: 1 },
  logoutText: { fontFamily: fonts.bodySemiBold, fontSize: 15 },
});