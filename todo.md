# Mohasb App - Project TODO

## Core Features - الميزات الأساسية

### Authentication & Security
- [ ] Splash Screen (2 second delay)
- [ ] PIN Authentication Screen (default PIN: 0000)
- [ ] Login Screen
- [ ] Register Screen (name, email)

### Main Navigation & Screens
- [x] Home Screen with dashboard
- [x] Accounts Management Screen
- [x] Add Transaction Screen
- [x] Statement/Transactions List Screen
- [x] Settings Screen
- [x] Tab-based navigation (Home, Accounts, Add Transaction, Settings)
- [x] Bottom navigation bar

## Data Management - إدارة البيانات

### Local Storage
- [ ] AsyncStorage setup for local data persistence
- [ ] Account model and CRUD operations
- [ ] Transaction model and CRUD operations
- [ ] User profile storage (name, email)
- [ ] PIN storage and verification

### Account Types
- [ ] Customer (زبون) account type
- [ ] Agent (مندوب) account type
- [ ] Company (شركة) account type

### Transactions
- [ ] Support multiple currencies: SYP, USD, EUR, TRY
- [ ] Transaction statement field (بيان)
- [ ] Transaction history and filtering

## Google Sheets Integration - تكامل Google Sheets

- [ ] Google Sign-In setup
- [ ] Create/manage spreadsheet
- [ ] Export accounts to Sheets
- [ ] Export transactions to Sheets
- [ ] Bidirectional sync
- [ ] Auto-sync toggle

## PDF Export Feature - ميزة تصدير PDF

- [ ] Create PDF export library
- [ ] Account statement PDF export
- [ ] Transactions report PDF export
- [ ] Balance summary PDF export
- [ ] Date range filtering for reports
- [ ] Full Arabic language support in PDF
- [ ] Share functionality for PDF files
- [ ] Test PDF generation on Android

## UI/UX & Design - التصميم وتجربة المستخدم

### Visual Design
- [x] Dark theme (primary color: #0D0F2D)
- [x] Custom app logo and icons
- [x] Responsive design for mobile screens
- [x] Modern and professional UI design
- [ ] Smooth transitions and animations

### Localization
- [ ] Arabic language support
- [ ] RTL layout support
- [ ] Arabic font support

### Mobile Optimization
- [ ] Optimize padding and margins for mobile screens
- [ ] Adjust font sizes for better readability
- [ ] Optimize button sizes for touch interaction
- [ ] Improve spacing between elements
- [ ] Test on various screen sizes (small, medium, large)
- [ ] Optimize home screen layout
- [ ] Optimize accounts screen layout
- [ ] Optimize add transaction screen layout
- [ ] Optimize settings screen layout
- [ ] Optimize statement screen layout

## Advanced Features - الميزات المتقدمة

- [ ] Backup/Restore functionality
- [ ] Transaction filtering and search
- [ ] Account balance calculations
- [ ] Multi-currency balance display
- [ ] Quick action buttons
- [ ] Pull-to-refresh functionality

## Testing & Deployment - الاختبار والنشر

- [ ] Test all user flows
- [ ] Test on Android device
- [ ] Test PDF generation
- [ ] Test Google Sheets integration
- [ ] Generate APK
- [ ] Verify RTL layout on all screens
- [ ] Verify Arabic text rendering

## Current Status
- Project initialized with Expo SDK 54
- Theme configured with dark colors
- Basic project structure created
