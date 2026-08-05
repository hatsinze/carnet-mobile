# 📱 Carnet de Correspondance - Mobile App

<p align="center">
  <img src="https://img.shields.io/badge/Expo-54.x-000.svg" alt="Expo">
  <img src="https://img.shields.io/badge/React_Native-0.81-blue.svg" alt="React Native">
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6.svg" alt="TypeScript">
  <img src="https://img.shields.io/badge/Platform-iOS%20%26%20Android-lightgrey.svg" alt="Platform">
</p>

---

## 📋 Overview

**Carnet de Correspondance Mobile** is the mobile application companion for the Carnet de Correspondance school management platform.

Built with **React Native and Expo**, the application provides a mobile experience for:

- 👨‍👩‍👧 Parents
- 🎓 Students

The application communicates with the same backend API used by the web platform.

---

# ✨ Features

## 👨‍👩‍👧 Parent Features

- Switch between multiple children
- View academic results and rankings
- Track school fees and payments
- Download payment receipts
- Receive school announcements
- Send and receive messages
- View discipline records
- Access school calendar
- Manage account information

---

## 🎓 Student Features

- View personal results
- Check timetable
- View discipline records
- Read school announcements
- Access personal information

---

# 🛠️ Technology Stack

| Technology | Version |
|---|---|
| React Native | 0.81 |
| Expo | 54.x |
| TypeScript | 5.x |
| Navigation | Expo Router |
| Data Fetching | TanStack Query |
| Styling | NativeWind |
| Local Storage | AsyncStorage |
| Notifications | Expo Notifications |

---

# 🚀 Installation

## Requirements

Make sure you have:

- Node.js >= 18
- npm or yarn
- Expo CLI
- Android Studio or Xcode (for emulators)

---

## Setup

```bash
# Clone repository
git clone https://github.com/hatsinze/carnet-mobile.git

cd carnet-mobile

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

---

## Environment Configuration

Update `.env`:

```env
EXPO_PUBLIC_API_URL=http://localhost:8000/api/v1
```

For physical device testing, replace `localhost` with your computer's local IP:

```env
EXPO_PUBLIC_API_URL=http://192.168.x.x:8000/api/v1
```

---

# ▶️ Running the Application

Start Expo:

```bash
npx expo start
```

Run directly:

```bash
# Android
npx expo start --android

# iOS
npx expo start --ios

# Clear cache
npx expo start -c
```

---

# 📱 Physical Device Testing

1. Start the backend API:

```bash
php artisan serve --host=0.0.0.0
```

2. Update `.env`:

```env
EXPO_PUBLIC_API_URL=http://YOUR_LOCAL_IP:8000/api/v1
```

3. Start Expo:

```bash
npx expo start
```

4. Scan the QR code using **Expo Go**.

---

# 📁 Project Structure

```text
carnet-mobile/
│
├── app/                              # Expo Router - File-based navigation
│   ├── (eleve)/                      # Student dashboard routes
│   │   ├── plus/                     # Student plus menu
│   │   │   ├── compte.tsx            # Student account page
│   │   │   ├── index.tsx             # Student plus menu
│   │   │   └── _layout.tsx           # Student plus layout
│   │   ├── communiques/              # Student communiqués
│   │   │   ├── index.tsx             # Communiqués list
│   │   │   ├── [id].tsx              # Communiqué detail
│   │   │   └── _layout.tsx           # Communiqués layout
│   │   ├── comportement.tsx          # Student behavior
│   │   ├── emploi.tsx                # Student timetable
│   │   ├── index.tsx                 # Student home
│   │   ├── resultats.tsx             # Student results
│   │   └── _layout.tsx               # Student layout
│   │
│   ├── (parent)/                     # Parent dashboard routes
│   │   ├── communiques/              # Parent communiqués
│   │   │   ├── index.tsx             # Communiqués list
│   │   │   ├── [id].tsx              # Communiqué detail
│   │   │   └── _layout.tsx           # Communiqués layout
│   │   ├── messages/                 # Parent messages
│   │   │   ├── index.tsx             # Messages list
│   │   │   ├── new.tsx               # New message
│   │   │   ├── [id].tsx              # Message thread
│   │   │   └── _layout.tsx           # Messages layout
│   │   ├── paiements/                # Parent payments
│   │   │   ├── index.tsx             # Payments list
│   │   │   ├── [id].tsx              # Payment detail
│   │   │   └── _layout.tsx           # Payments layout
│   │   ├── plus/                     # Parent plus menu
│   │   │   ├── calendrier.tsx        # School calendar
│   │   │   ├── communiques.tsx       # Communiqués redirect
│   │   │   ├── comportement.tsx      # Behavior
│   │   │   ├── compte.tsx            # My account
│   │   │   ├── index.tsx             # Plus menu
│   │   │   └── _layout.tsx           # Plus layout
│   │   ├── index.tsx                 # Parent home
│   │   ├── resultats.tsx             # Parent results
│   │   └── _layout.tsx               # Parent layout
│   │
│   ├── index.tsx                     # App entry
│   ├── login.tsx                     # Login screen
│   └── _layout.tsx                   # Root layout
│
├── src/                              # Source code
│   ├── components/                   # Reusable UI components
│   │   ├── Avatar.tsx
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── ChildSwitcher.tsx
│   │   ├── EmptyState.tsx
│   │   ├── ErrorBoundary.tsx
│   │   ├── ErrorState.tsx
│   │   ├── IconTile.tsx
│   │   ├── InfoChip.tsx
│   │   ├── Input.tsx
│   │   ├── LastUpdated.tsx
│   │   ├── LoadingState.tsx
│   │   ├── MonthCalendar.tsx
│   │   ├── Motion.tsx
│   │   ├── OfflineBanner.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── ProgressRing.tsx
│   │   ├── ScreenHeader.tsx
│   │   ├── SegmentedControl.tsx
│   │   ├── Skeleton.tsx
│   │   └── StatusBadge.tsx
│   │
│   ├── features/                     # Feature modules
│   │   ├── auth/                     # Authentication
│   │   │   └── AuthContext.tsx
│   │   ├── children/                 # Child management
│   │   │   ├── ChildContext.tsx
│   │   │   └── ChildLoader.tsx
│   │   └── theme/                    # Theme management
│   │       └── ThemeContext.tsx
│   │
│   ├── hooks/                        # Custom React hooks
│   │   ├── useAccueilExtras.ts
│   │   ├── useBilanEleve.ts
│   │   ├── useChangePassword.ts
│   │   ├── useCommuniques.ts
│   │   ├── useContactableStaff.ts
│   │   ├── useConversations.ts
│   │   ├── useDeviceToken.ts
│   │   ├── useEleveCalendrier.ts
│   │   ├── useEleveResultats.ts
│   │   ├── useEleveSanctions.ts
│   │   ├── useEleveStats.ts
│   │   ├── useFinancialSummary.ts
│   │   ├── useIsOnline.ts
│   │   ├── useMinervalEleves.ts
│   │   ├── useMoyennes.ts
│   │   ├── useMyEleves.ts
│   │   ├── usePaiementsHistory.ts
│   │   ├── usePeriodes.ts
│   │   └── useUpdateAccount.ts
│   │
│   ├── lib/                          # Utilities & configuration
│   │   ├── api-client.ts             # API client
│   │   ├── calendar-utils.ts         # Calendar utilities
│   │   ├── download.ts               # Download helper
│   │   ├── notifications.ts          # Notifications
│   │   └── query-client.ts           # TanStack Query client
│   │
│   ├── theme/                        # Design system
│   │   └── tokens.ts                 # Colors, fonts, spacing
│   │
│   └── types/                        # TypeScript type definitions
│       ├── auth.ts
│       ├── calendrier.ts
│       ├── communique.ts
│       ├── contact.ts
│       ├── conversation.ts
│       ├── discipline.ts
│       ├── eleve-resultats.ts
│       ├── eleve.ts
│       ├── finance.ts
│       ├── moyenne.ts
│       ├── pagination.ts
│       ├── periode.ts
│       └── sanction.ts
│
├── components/                       # Root components (Expo)
│   ├── external-link.tsx
│   ├── haptic-tab.tsx
│   ├── hello-wave.tsx
│   ├── parallax-scroll-view.tsx
│   ├── themed-text.tsx
│   ├── themed-view.tsx
│   └── ui/
│       ├── collapsible.tsx
│       ├── icon-symbol.ios.tsx
│       └── icon-symbol.tsx
│
├── constants/                        # App constants
│   └── theme.ts
│
├── hooks/                            # Root hooks
│   ├── use-color-scheme.ts
│   ├── use-color-scheme.web.ts
│   └── use-theme-color.ts
│
├── assets/                           # Images & assets
│   └── images/
│
├── .env                              # Environment variables
├── .env.example                      # Environment example
├── app.json                          # Expo app configuration
├── eas.json                          # EAS Build configuration
├── google-services.json              # Firebase config
├── package.json                      # Dependencies
└── tsconfig.json                     # TypeScript configuration

```

---

# 📦 Production Build

Production builds are handled using **Expo Application Services (EAS)**.

Install EAS CLI:

```bash
npm install -g eas-cli
```

Login:

```bash
eas login
```

Build Android:

```bash
eas build --platform android
```

Build iOS:

```bash
eas build --platform ios
```

---

# 👥 Test Accounts

The application uses the same authentication system as the backend.

| Role | Email | Password |
|---|---|---|
| Direction | direction@ecole-test.com | password |
| Enseignant | enseignant@ecole-test.com | password |
| Personnel Admin | admin@ecole-test.com | password |
| Parent | jean.parent@test.com | password |
| Élève | aimee@ecole-test.com | password |

> All test accounts use `password` as the password.

---

# 👨‍💻 Contributor

**Hatsinze Crédo Adorate**  
Full Stack Developer

---

# 📄 License

MIT License
