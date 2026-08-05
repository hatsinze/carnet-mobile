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
├── app/
│   ├── (eleve)/                    # Student dashboard screens
│   │   ├── plus/                   # Student plus menu
│   │   ├── communiques/            # Student communiqués
│   │   └── [screens]               # index, resultats, comportement, emploi
│   │
│   ├── (parent)/                   # Parent dashboard screens
│   │   ├── communiques/            # Parent communiqués
│   │   ├── messages/               # Parent messages
│   │   ├── paiements/              # Parent payments
│   │   ├── plus/                   # Parent plus menu
│   │   └── [screens]               # index, resultats
│   │
│   ├── index.tsx                   # App entry
│   ├── login.tsx                   # Login screen
│   └── _layout.tsx                 # Root layout
│
├── src/
│   ├── components/                 # Reusable UI components
│   ├── features/                   # Feature modules
│   │   ├── auth/                   # Authentication
│   │   ├── children/               # Child management
│   │   └── theme/                  # Theme management
│   ├── hooks/                      # Custom React hooks
│   ├── lib/                        # Utilities & configuration
│   ├── theme/                      # Design tokens (colors, fonts, spacing)
│   └── types/                      # TypeScript type definitions
│
├── assets/                         # Images & assets
├── components/                     # Root Expo components
├── constants/                      # App constants
├── hooks/                          # Root hooks
├── .env                            # Environment variables
├── app.json                        # Expo app configuration
├── eas.json                        # EAS Build configuration
└── package.json                    # Dependencies

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
