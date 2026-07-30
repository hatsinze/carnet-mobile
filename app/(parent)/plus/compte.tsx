import { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, Switch, ScrollView, StyleSheet, Appearance } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Avatar } from '../../../src/components/Avatar';
import { FadeInUp } from '../../../src/components/Motion';
import { useAuth } from '../../../src/features/auth/AuthContext';
import { useUpdateAccount } from '../../../src/hooks/useUpdateAccount';
import { useChangePassword } from '../../../src/hooks/useChangePassword';
import { syncDeviceToken, unregisterDeviceToken } from '../../../src/hooks/useDeviceToken';
import { colors, fonts, radius, spacing } from '../../../src/theme/tokens';

const THEME_STORAGE_KEY = '@app_theme_preference';

export default function CompteScreen() {
  const { user, logout, refreshUser } = useAuth();
  const updateAccount = useUpdateAccount();
  const changePassword = useChangePassword();

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name ?? '');
  const [telephone, setTelephone] = useState(user?.parent?.telephone ?? '');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const [pushEnabled, setPushEnabled] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme !== null) {
        setIsDarkMode(savedTheme === 'dark');
      } else {
        const systemTheme = Appearance.getColorScheme();
        setIsDarkMode(systemTheme === 'dark');
      }
    } catch (error) {
      console.error('Failed to load theme preference:', error);
    }
  };

  const handleThemeToggle = async (value: boolean) => {
    setIsDarkMode(value);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, value ? 'dark' : 'light');
    } catch (error) {
      console.error('Failed to save theme preference:', error);
    }
  };

  if (!user) return null;
  const parent = user.parent;

  async function handleSaveProfile() {
    setSaveSuccess(false);
    await updateAccount.mutateAsync({ name, telephone });
    await refreshUser();
    setSaveSuccess(true);
    setEditing(false);
    setTimeout(() => setSaveSuccess(false), 2500);
  }

  async function handleChangePassword() {
    setPasswordError(null);
    if (newPassword !== newPasswordConfirm) {
      setPasswordError('Les mots de passe ne correspondent pas.');
      return;
    }
    try {
      await changePassword.mutateAsync({
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: newPasswordConfirm,
      });
      setPasswordSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setNewPasswordConfirm('');
      setTimeout(() => { setPasswordSuccess(false); setShowPasswordForm(false); }, 2000);
    } catch (e: any) {
      setPasswordError(e?.response?.data?.errors?.current_password?.[0] ?? 'Une erreur est survenue.');
    }
  }

  async function handlePushToggle(value: boolean) {
    setPushEnabled(value);
    if (value) await syncDeviceToken();
    else await unregisterDeviceToken();
  }

  // Theme colors
  const isDark = isDarkMode;
  const themeColors = {
    background: isDark ? '#000000' : '#F8F8F8',
    cardBackground: isDark ? '#1C1C1E' : '#FFFFFF',
    cardBorder: isDark ? '#2C2C2E' : '#EFEFEF',
    text: isDark ? '#FFFFFF' : '#0F172A',
    textMuted: isDark ? '#8E8E93' : '#8E8E93',
    textSecondary: isDark ? '#636366' : '#636366',
    inputBackground: isDark ? '#2C2C2E' : '#F5F5F5',
    inputBorder: isDark ? '#3A3A3C' : '#E5E5E5',
    divider: isDark ? '#2C2C2E' : '#EFEFEF',
    iconBackground: isDark ? '#2C2C2E' : '#F0F0F0',
    separator: isDark ? '#2C2C2E' : '#EFEFEF',
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: themeColors.background }]} 
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Profile Header - Avatar Left, Name Right */}
      <FadeInUp delay={80}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarWrapper}>
            <Avatar name={user.name} size={72} />
          </View>
          <View style={styles.profileInfo}>
            <Text style={[styles.userName, { color: themeColors.text }]}>{user.name}</Text>
            <Text style={[styles.userEmail, { color: themeColors.textMuted }]}>{user.email}</Text>
            <View style={styles.roleBadge}>
              <Text style={styles.roleBadgeText}>Parent</Text>
            </View>
          </View>
        </View>
      </FadeInUp>

      {/* Settings Sections */}
      <View style={styles.sectionsContainer}>

        {/* Personal Info */}
        <FadeInUp delay={120}>
          <View style={styles.sectionWrapper}>
            <Text style={[styles.sectionTitle, { color: themeColors.textMuted }]}>Informations personnelles</Text>
            <View style={[styles.section, { 
              backgroundColor: themeColors.cardBackground,
              borderColor: themeColors.cardBorder,
            }]}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionHeaderTitle, { color: themeColors.text }]}>Profil</Text>
                <Pressable onPress={() => setEditing((e) => !e)}>
                  <Text style={[styles.editButton, { color: colors.encre }]}>
                    {editing ? 'Annuler' : 'Modifier'}
                  </Text>
                </Pressable>
              </View>
              
              <MenuItem 
                icon="person-outline" 
                label="Nom complet" 
                value={user.name}
                editing={editing}
                themeColors={themeColors}
              >
                {editing && (
                  <TextInput 
                    style={[styles.input, { 
                      color: themeColors.text,
                      backgroundColor: themeColors.inputBackground,
                      borderColor: themeColors.inputBorder,
                    }]} 
                    value={name} 
                    onChangeText={setName} 
                    placeholder="Nom complet" 
                    placeholderTextColor={themeColors.textSecondary} 
                  />
                )}
              </MenuItem>
              
              <Separator themeColors={themeColors} />
              
              <MenuItem 
                icon="mail-outline" 
                label="Email" 
                value={user.email}
                editing={editing}
                themeColors={themeColors}
              >
                {editing ? (
                  <>
                    <Text style={[styles.menuItemValue, { color: themeColors.text }]}>{user.email}</Text>
                    <Text style={[styles.adminNote, { color: themeColors.textSecondary }]}>
                      Modifiable uniquement par l&apos;administration
                    </Text>
                  </>
                ) : (
                  <Text style={[styles.menuItemValue, { color: themeColors.text }]}>{user.email}</Text>
                )}
              </MenuItem>
              
              <Separator themeColors={themeColors} />
              
              <MenuItem 
                icon="call-outline" 
                label="Téléphone" 
                value={parent?.telephone || '—'}
                editing={editing}
                themeColors={themeColors}
              >
                {editing && (
                  <TextInput 
                    style={[styles.input, { 
                      color: themeColors.text,
                      backgroundColor: themeColors.inputBackground,
                      borderColor: themeColors.inputBorder,
                    }]} 
                    value={telephone} 
                    onChangeText={setTelephone} 
                    placeholder="+257 ..." 
                    keyboardType="phone-pad" 
                    placeholderTextColor={themeColors.textSecondary} 
                  />
                )}
              </MenuItem>
            </View>

            {editing && (
              <Pressable 
                style={[styles.saveButton, updateAccount.isPending && styles.buttonDisabled]} 
                onPress={handleSaveProfile} 
                disabled={updateAccount.isPending}
              >
                <Text style={styles.saveButtonText}>
                  {updateAccount.isPending ? 'Enregistrement…' : 'Enregistrer les modifications'}
                </Text>
              </Pressable>
            )}
            
            {saveSuccess && (
              <View style={styles.successRow}>
                <Ionicons name="checkmark-circle" size={16} color={colors.sauge} />
                <Text style={styles.successText}>Profil mis à jour</Text>
              </View>
            )}
          </View>
        </FadeInUp>

        {/* Security */}
        <FadeInUp delay={160}>
          <View style={styles.sectionWrapper}>
            <Text style={[styles.sectionTitle, { color: themeColors.textMuted }]}>Sécurité</Text>
            <View style={[styles.section, { 
              backgroundColor: themeColors.cardBackground,
              borderColor: themeColors.cardBorder,
            }]}>
              {showPasswordForm ? (
                <>
                  <View style={styles.sectionHeader}>
                    <Text style={[styles.sectionHeaderTitle, { color: themeColors.text }]}>Changer le mot de passe</Text>
                    <Pressable onPress={() => setShowPasswordForm(false)}>
                      <Text style={[styles.editButton, { color: colors.encre }]}>Annuler</Text>
                    </Pressable>
                  </View>
                  
                  <MenuItem 
                    icon="lock-closed-outline" 
                    label="Mot de passe actuel" 
                    themeColors={themeColors}
                  >
                    <TextInput 
                      style={[styles.input, { 
                        color: themeColors.text,
                        backgroundColor: themeColors.inputBackground,
                        borderColor: themeColors.inputBorder,
                      }]} 
                      value={currentPassword} 
                      onChangeText={setCurrentPassword} 
                      secureTextEntry 
                      placeholderTextColor={themeColors.textSecondary} 
                    />
                  </MenuItem>
                  
                  <Separator themeColors={themeColors} />
                  
                  <MenuItem 
                    icon="key-outline" 
                    label="Nouveau mot de passe" 
                    themeColors={themeColors}
                  >
                    <TextInput 
                      style={[styles.input, { 
                        color: themeColors.text,
                        backgroundColor: themeColors.inputBackground,
                        borderColor: themeColors.inputBorder,
                      }]} 
                      value={newPassword} 
                      onChangeText={setNewPassword} 
                      secureTextEntry 
                      placeholderTextColor={themeColors.textSecondary} 
                    />
                  </MenuItem>
                  
                  <Separator themeColors={themeColors} />
                  
                  <MenuItem 
                    icon="checkmark-done-outline" 
                    label="Confirmer le nouveau mot de passe" 
                    themeColors={themeColors}
                  >
                    <TextInput 
                      style={[styles.input, { 
                        color: themeColors.text,
                        backgroundColor: themeColors.inputBackground,
                        borderColor: themeColors.inputBorder,
                      }]} 
                      value={newPasswordConfirm} 
                      onChangeText={setNewPasswordConfirm} 
                      secureTextEntry 
                      placeholderTextColor={themeColors.textSecondary} 
                    />
                  </MenuItem>
                  
                  {passwordError && <Text style={styles.errorText}>{passwordError}</Text>}
                  
                  <Pressable 
                    style={[styles.saveButton, { marginTop: spacing.md }, changePassword.isPending && styles.buttonDisabled]} 
                    onPress={handleChangePassword} 
                    disabled={changePassword.isPending}
                  >
                    <Text style={styles.saveButtonText}>
                      {changePassword.isPending ? 'Modification…' : 'Changer le mot de passe'}
                    </Text>
                  </Pressable>
                  
                  {passwordSuccess && (
                    <View style={styles.successRow}>
                      <Ionicons name="checkmark-circle" size={16} color={colors.sauge} />
                      <Text style={styles.successText}>Mot de passe modifié</Text>
                    </View>
                  )}
                </>
              ) : (
                <Pressable 
                  style={styles.menuItemPressable}
                  onPress={() => setShowPasswordForm(true)}
                >
                  <View style={styles.menuItemRow}>
                    <View style={[styles.iconContainer, { backgroundColor: themeColors.iconBackground }]}>
                      <Ionicons name="lock-closed-outline" size={22} color={themeColors.text} />
                    </View>
                    <View style={styles.menuItemContent}>
                      <Text style={[styles.menuItemLabel, { color: themeColors.textMuted }]}>Mot de passe</Text>
                      <Text style={[styles.menuItemValue, { color: themeColors.text }]}>••••••••</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={themeColors.textMuted} />
                  </View>
                </Pressable>
              )}
            </View>
          </View>
        </FadeInUp>

        {/* Preferences */}
        <FadeInUp delay={200}>
          <View style={styles.sectionWrapper}>
            <Text style={[styles.sectionTitle, { color: themeColors.textMuted }]}>Préférences</Text>
            <View style={[styles.section, { 
              backgroundColor: themeColors.cardBackground,
              borderColor: themeColors.cardBorder,
            }]}>
              <View style={styles.toggleItem}>
                <View style={styles.toggleLeft}>
                  <View style={[styles.iconContainer, { backgroundColor: themeColors.iconBackground }]}>
                    <Ionicons name="notifications-outline" size={22} color={themeColors.text} />
                  </View>
                  <View>
                    <Text style={[styles.toggleLabel, { color: themeColors.text }]}>Notifications push</Text>
                    <Text style={[styles.toggleSubtext, { color: themeColors.textMuted }]}>Recevoir les alertes sur cet appareil</Text>
                  </View>
                </View>
                <Switch 
                  value={pushEnabled} 
                  onValueChange={handlePushToggle} 
                  trackColor={{ false: '#D1D1D6', true: colors.encre }} 
                  thumbColor={colors.blanc}
                />
              </View>
              
              <Separator themeColors={themeColors} />
              
              <View style={styles.toggleItem}>
                <View style={styles.toggleLeft}>
                  <View style={[styles.iconContainer, { backgroundColor: themeColors.iconBackground }]}>
                    <Ionicons name="moon-outline" size={22} color={themeColors.text} />
                  </View>
                  <View>
                    <Text style={[styles.toggleLabel, { color: themeColors.text }]}>Thème sombre</Text>
                    <Text style={[styles.toggleSubtext, { color: themeColors.textMuted }]}>
                      {isDarkMode ? 'Activé' : 'Désactivé'}
                    </Text>
                  </View>
                </View>
                <Switch 
                  value={isDarkMode} 
                  onValueChange={handleThemeToggle} 
                  trackColor={{ false: '#D1D1D6', true: colors.encre }}
                  thumbColor={colors.blanc}
                />
              </View>
            </View>
          </View>
        </FadeInUp>

        {/* Linked Children */}
        {parent?.eleves && parent.eleves.length > 0 && (
          <FadeInUp delay={240}>
            <View style={styles.sectionWrapper}>
              <Text style={[styles.sectionTitle, { color: themeColors.textMuted }]}>Enfants liés</Text>
              <View style={[styles.section, { 
                backgroundColor: themeColors.cardBackground,
                borderColor: themeColors.cardBorder,
              }]}>
                {parent.eleves.map((e, i) => {
                  // Get class name from the child's data if available
                  const childWithClass = e as any;
                  return (
                    <View key={e.id}>
                      <View style={styles.childItem}>
                        <Avatar name={`${e.prenom} ${e.nom}`} size={32} />
                        <View style={styles.childInfo}>
                          <Text style={[styles.childName, { color: themeColors.text }]}>
                            {e.prenom} {e.nom}
                          </Text>
                          {childWithClass?.classe?.nom && (
                            <Text style={[styles.childClass, { color: themeColors.textMuted }]}>
                              {childWithClass.classe.nom}
                            </Text>
                          )}
                        </View>
                      </View>
                      {i < parent.eleves!.length - 1 && <Separator themeColors={themeColors} />}
                    </View>
                  );
                })}
              </View>
            </View>
          </FadeInUp>
        )}

        {/* Logout */}
        <FadeInUp delay={280}>
          <Pressable style={styles.logoutButton} onPress={logout}>
            <Ionicons name="log-out-outline" size={22} color={colors.brique} />
            <Text style={styles.logoutText}>Se déconnecter</Text>
          </Pressable>
        </FadeInUp>

        <View style={styles.bottomSpacer} />
      </View>
    </ScrollView>
  );
}

// Components
function MenuItem({ 
  icon, 
  label, 
  value, 
  children, 
  editing, 
  themeColors 
}: { 
  icon: string; 
  label: string; 
  value?: string; 
  children?: React.ReactNode; 
  editing?: boolean;
  themeColors: any;
}) {
  return (
    <View style={styles.menuItem}>
      <View style={styles.menuItemRow}>
        <View style={[styles.iconContainer, { backgroundColor: themeColors.iconBackground }]}>
          <Ionicons name={icon as any} size={22} color={themeColors.text} />
        </View>
        <View style={styles.menuItemContent}>
          <Text style={[styles.menuItemLabel, { color: themeColors.textMuted }]}>{label}</Text>
          {children ? (
            children
          ) : (
            <Text style={[styles.menuItemValue, { color: themeColors.text }]}>{value}</Text>
          )}
        </View>
      </View>
    </View>
  );
}

function Separator({ themeColors }: { themeColors: any }) {
  return <View style={[styles.separator, { backgroundColor: themeColors.separator }]} />;
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  content: { 
    paddingBottom: spacing.md,
  },

  sectionsContainer: {
    paddingHorizontal: spacing.md,
  },

  // Profile Header - Avatar Left, Name Right
  profileHeader: { 
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    gap: spacing.md,
  },
  avatarWrapper: {
    flexShrink: 0,
  },
  profileInfo: {
    flex: 1,
  },
  userName: { 
    fontFamily: fonts.displaySemiBold, 
    fontSize: 20, 
    letterSpacing: -0.5,
  },
  userEmail: { 
    fontFamily: fonts.body, 
    fontSize: 14, 
    marginTop: 2,
  },
  roleBadge: {
    backgroundColor: colors.encreLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
    alignSelf: 'flex-start',
    marginTop: spacing.xs,
  },
  roleBadgeText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 11,
    color: colors.encre,
    letterSpacing: 0.3,
  },

  // Sections
  sectionWrapper: {
    marginTop: spacing.lg,
  },
  sectionTitle: { 
    fontFamily: fonts.bodyMedium, 
    fontSize: 13, 
    letterSpacing: 0.3,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  section: { 
    borderRadius: radius.md,
    borderWidth: 1,
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.xs,
  },
  sectionHeaderTitle: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 14,
  },
  editButton: {
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
  },

  // Menu Items
  menuItem: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  menuItemPressable: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  menuItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.xs,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemLabel: {
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    letterSpacing: 0.3,
  },
  menuItemValue: {
    fontFamily: fonts.body,
    fontSize: 16,
    marginTop: 2,
  },
  adminNote: {
    fontFamily: fonts.body,
    fontSize: 12,
    marginTop: 2,
    opacity: 0.7,
  },
  separator: {
    height: 1,
    marginHorizontal: spacing.md,
  },

  // Input
  input: { 
    fontFamily: fonts.body, 
    fontSize: 16, 
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: radius.sm,
    marginTop: 4,
  },

  // Toggle Items
  toggleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  toggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  toggleLabel: {
    fontFamily: fonts.body,
    fontSize: 16,
  },
  toggleSubtext: {
    fontFamily: fonts.body,
    fontSize: 12,
    marginTop: 1,
  },

  // Children - Compact
  childItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  childInfo: {
    flex: 1,
  },
  childName: {
    fontFamily: fonts.body,
    fontSize: 15,
  },
  childClass: {
    fontFamily: fonts.body,
    fontSize: 12,
    marginTop: 1,
    opacity: 0.7,
  },

  // Buttons
  saveButton: { 
    backgroundColor: colors.encre, 
    borderRadius: radius.md, 
    paddingVertical: spacing.md, 
    alignItems: 'center', 
    marginTop: spacing.md,
  },
  saveButtonText: { 
    fontFamily: fonts.bodySemiBold, 
    fontSize: 14, 
    color: colors.blanc,
    letterSpacing: 0.3,
  },
  buttonDisabled: { 
    opacity: 0.6 
  },

  // Success/Error
  successRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 6, 
    marginTop: spacing.sm,
    justifyContent: 'center',
  },
  successText: { 
    fontFamily: fonts.bodyMedium, 
    fontSize: 13, 
    color: colors.sauge 
  },
  errorText: { 
    fontFamily: fonts.body, 
    fontSize: 13, 
    color: colors.brique, 
    marginTop: spacing.xs,
    textAlign: 'center',
    paddingHorizontal: spacing.md,
  },

  // Logout
  logoutButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: spacing.sm, 
    backgroundColor: '#FEF2F2', 
    borderRadius: radius.md, 
    padding: spacing.md, 
    marginTop: spacing.xl,
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  logoutText: { 
    fontFamily: fonts.bodySemiBold, 
    fontSize: 15, 
    color: colors.brique,
    letterSpacing: 0.3,
  },

  bottomSpacer: {
    height: spacing.xl,
  },
});