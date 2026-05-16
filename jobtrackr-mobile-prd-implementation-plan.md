# JobTrackr Mobile Application PRD + Implementation Plan

## 1. Document Purpose

This document defines the Product Requirements Document (PRD) and implementation plan for the **JobTrackr mobile application**.

The mobile application is the companion experience for JobTrackr. It will integrate with the existing NestJS backend API that already powers the web application. The backend remains the **single source of truth** for authentication, users, job applications, timeline events, reminders, interviews, and dashboard data.

This document should guide mobile development using **React Native with Expo and TypeScript**.

---

## 2. Product Context

### 2.1 Product Name

**JobTrackr**

### 2.2 Product Positioning

> JobTrackr is a personal CRM for job seekers that helps candidates track job applications, interviews, follow-ups, reminders, and outcomes across web and mobile.

### 2.3 Mobile App Positioning

The mobile app is not intended to replace the web dashboard.

The web app is the full workspace.  
The mobile app is the quick-action companion.

The mobile app should help users:

- Quickly check application progress
- Add a job opportunity while on the move
- Update an application status immediately
- Add notes after calls, emails, or interviews
- Check upcoming reminders
- Check upcoming interviews
- Stay aware of what needs attention

### 2.4 Core Problem

Job seekers do not only manage applications while sitting at a laptop. Many important updates happen from a phone:

- A recruiter sends a message
- A user sees a job link on mobile
- A reminder needs to be checked quickly
- An interview update needs to be logged
- A job status changes after an email
- A user wants to capture a note immediately before forgetting

The mobile app solves this by giving the user a fast, clean, and focused way to manage job-search activity without needing the full web dashboard.

---

## 3. Relationship with Existing Backend and Web App

### 3.1 Backend as Source of Truth

The existing NestJS backend is the source of truth for both clients:

```txt
Next.js Web App ─┐
                 ├── NestJS REST API ─── PostgreSQL
Expo Mobile App ─┘
```

The mobile app must not duplicate business logic locally.

The backend owns:

- User authentication
- Authorization
- Job applications
- Application timeline events
- Reminders
- Interviews
- Dashboard summary
- Data ownership rules
- Status transition history
- Validation at API level

The mobile app owns:

- Mobile UI
- Mobile navigation
- Local auth token/session handling
- Mobile form validation
- API request orchestration
- Mobile loading/error/empty states
- Optimistic UI where safe

### 3.2 Why This Matters

Using the same backend gives the product:

- consistent data across web and mobile
- one authentication system
- one database
- one set of business rules
- easier debugging
- stronger architecture
- better portfolio value

A user should be able to:

```txt
Create an application on web
→ open mobile app
→ see the same application
→ update the status on mobile
→ refresh web app
→ see the updated status and timeline event
```

That is one of the most important acceptance tests for this mobile implementation.

---

## 4. MVP Scope

### 4.1 Mobile MVP Goal

The mobile MVP should allow authenticated users to:

- Log in
- Register
- View home summary
- View job applications
- Add a job application quickly
- View application details
- Update application status
- Add timeline notes
- View reminders
- Mark reminders complete
- View interviews
- View profile/account screen
- Log out

### 4.2 Mobile MVP Features

Required MVP screens:

```txt
Login
Register
Home
Applications List
Quick Add Application
Application Details
Update Status
Add Timeline Note
Reminders
Interviews
Profile
```

Required MVP capabilities:

```txt
Authenticate user
Persist session securely
Fetch current user
Fetch dashboard summary
Fetch applications
Create application
View application details
Update application status
Create timeline event/note
Fetch reminders
Mark reminder complete
Fetch interviews
Logout
```

### 4.3 Non-MVP Features

Do not build these in the mobile MVP:

```txt
Job board aggregation
AI CV scoring
Resume upload/parsing
Payment subscriptions
Admin dashboard
Browser extension features
Email scraping
Calendar sync
Advanced notification workers
Multi-tenant teams
Recruiter/company accounts
```

These features belong to V2/V3.

The mobile app should be architected so these can be added later, but they should not block the first usable mobile release.

---

## 5. Target Users

### 5.1 Primary User

An individual job seeker who already uses JobTrackr web or wants to track job applications from mobile.

### 5.2 User Needs on Mobile

The mobile user needs to:

- check what stage an application is in
- quickly add a job opportunity
- update a status after receiving feedback
- add notes after recruiter calls
- check upcoming reminders
- check upcoming interviews
- manage job search actions with minimal friction

### 5.3 Mobile Usage Pattern

The mobile app should assume short sessions.

The user may open the app for:

```txt
30 seconds to check a reminder
1 minute to update a status
2 minutes to add a job
3 minutes to write a note after an interview
```

Therefore, the mobile app should prioritize speed and clarity over dense analytics.

---

## 6. Product Principles

### 6.1 Mobile-First Simplicity

The mobile app should not copy every web dashboard feature.

Good mobile behavior:

- show the most relevant information first
- reduce form friction
- use clear action buttons
- use bottom tab navigation
- use simple lists and cards
- avoid overcrowded screens

### 6.2 Consistency with Web

The app should use the same:

- application statuses
- status labels
- core data model
- backend API
- user account
- product language
- brand direction

### 6.3 Fast Capture

The mobile app should make these actions quick:

- add application
- update status
- add note
- check reminders
- check interviews

### 6.4 Trustworthy and Professional Design

The product should feel:

- calm
- organized
- clean
- career-focused
- serious
- reliable

Avoid:

- generic AI mobile UI
- unnecessary gradients
- complex animations
- childish illustrations
- cluttered cards
- fake AI assistant screens in MVP

---

## 7. Tech Stack

### 7.1 Required Stack

```txt
Framework: React Native
Runtime/Tooling: Expo
Language: TypeScript
Navigation: React Navigation
API Client: Axios or fetch wrapper
Forms: React Hook Form
Validation: Zod
Secure Storage: Expo SecureStore
State Management: Zustand or Context API
Date Formatting: date-fns
Icons: lucide-react-native
Testing: Jest + React Native Testing Library
Preview: Expo Go / development build
```

### 7.2 Recommended Package List

Core setup:

```bash
npx create-expo-app@latest mobile --template blank-typescript
```

Install packages:

```bash
npx expo install expo-secure-store expo-constants
npm install axios zod react-hook-form @hookform/resolvers zustand date-fns
npm install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs
npx expo install react-native-screens react-native-safe-area-context react-native-gesture-handler react-native-reanimated
npm install lucide-react-native
```

Testing packages:

```bash
npm install -D jest jest-expo @testing-library/react-native @testing-library/jest-native
```

Optional later:

```bash
npx expo install expo-notifications
npx expo install expo-document-picker
npx expo install expo-file-system
```

Do not install optional packages until the feature actually needs them.

---

## 8. Environment Configuration

### 8.1 Environment Variables

Create:

```txt
.env
.env.example
```

Required variable:

```env
EXPO_PUBLIC_API_URL=http://localhost:4000/api/v1
```

Production:

```env
EXPO_PUBLIC_API_URL=https://your-production-api.com/api/v1
```

### 8.2 Important Rule

Only expose values that are safe to be public.

Allowed:

```txt
EXPO_PUBLIC_API_URL
```

Never put these in the mobile app:

```txt
DATABASE_URL
JWT_SECRET
JWT_ACCESS_SECRET
JWT_REFRESH_SECRET
STRIPE_SECRET_KEY
OPENAI_API_KEY
```

Mobile apps can be inspected. Anything packaged inside the app should be treated as public.

---

## 9. Recommended Folder Structure

Use a clean structure that separates navigation, screens, services, components, hooks, stores, and types.

```txt
mobile/
  App.tsx
  app.json
  babel.config.js
  package.json
  jest.config.js
  .env
  .env.example

  src/
    navigation/
      RootNavigator.tsx
      AuthNavigator.tsx
      AppNavigator.tsx
      ApplicationsNavigator.tsx

    screens/
      auth/
        LoginScreen.tsx
        RegisterScreen.tsx

      dashboard/
        HomeScreen.tsx

      applications/
        ApplicationsScreen.tsx
        ApplicationDetailsScreen.tsx
        QuickAddApplicationScreen.tsx
        UpdateStatusScreen.tsx
        AddTimelineNoteScreen.tsx

      reminders/
        RemindersScreen.tsx

      interviews/
        InterviewsScreen.tsx

      profile/
        ProfileScreen.tsx

    components/
      ui/
        Button.tsx
        Input.tsx
        Screen.tsx
        EmptyState.tsx
        LoadingState.tsx
        ErrorState.tsx
        StatusBadge.tsx

      applications/
        ApplicationCard.tsx
        ApplicationForm.tsx
        TimelineItem.tsx

      reminders/
        ReminderCard.tsx

      interviews/
        InterviewCard.tsx

    services/
      api.ts
      auth.service.ts
      applications.service.ts
      dashboard.service.ts
      reminders.service.ts
      interviews.service.ts

    store/
      auth.store.ts

    hooks/
      useAuth.ts
      useApplications.ts
      useDashboard.ts
      useReminders.ts
      useInterviews.ts

    constants/
      statuses.ts
      navigation.ts

    schemas/
      auth.schema.ts
      application.schema.ts
      timeline.schema.ts

    types/
      auth.ts
      application.ts
      dashboard.ts
      reminder.ts
      interview.ts
      api.ts

    utils/
      date.ts
      errors.ts
      format.ts
```

---

## 10. Navigation Architecture

### 10.1 Navigation Structure

Use authentication-aware navigation.

```txt
RootNavigator
  ├── AuthNavigator
  │     ├── Login
  │     └── Register
  │
  └── AppNavigator
        ├── Home
        ├── Applications
        ├── Add
        ├── Reminders
        └── Profile
```

Applications can have an inner stack:

```txt
ApplicationsNavigator
  ├── ApplicationsList
  ├── ApplicationDetails
  ├── UpdateStatus
  └── AddTimelineNote
```

### 10.2 Bottom Tabs

Recommended bottom tabs:

```txt
Home
Applications
Add
Reminders
Profile
```

Reason:

- Home gives quick overview
- Applications is the primary mobile module
- Add supports fast capture
- Reminders is a high-frequency mobile use case
- Profile gives account/logout access

### 10.3 Why Not Include Interviews as a Main Tab?

Interviews can appear inside Home and Application Details first.

For MVP, avoid too many tabs. The Interviews screen can be reachable from:

- Home upcoming interviews section
- Application Details
- Profile/menu if needed

If interviews become high usage, add a dedicated tab later.

---

## 11. API Integration Plan

### 11.1 API Base URL

Mobile should call the same backend as the web app.

```ts
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;
```

### 11.2 API Client

Create a centralized API client in:

```txt
src/services/api.ts
```

Responsibilities:

- set base URL
- attach authorization token
- normalize API errors
- handle timeout
- support logout on 401 if needed

Example:

```ts
import axios from "axios";
import * as SecureStore from "expo-secure-store";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("jobtrackr_access_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
```

### 11.3 Required Backend Endpoints

Auth:

```txt
POST /auth/register
POST /auth/login
GET /auth/me
```

Dashboard:

```txt
GET /dashboard/summary
```

Applications:

```txt
GET /applications
POST /applications
GET /applications/:id
PATCH /applications/:id
DELETE /applications/:id
```

Timeline:

```txt
GET /applications/:id/events
POST /applications/:id/events
```

Reminders:

```txt
GET /reminders
GET /reminders/upcoming
POST /reminders
PATCH /reminders/:id
DELETE /reminders/:id
```

Interviews:

```txt
GET /interviews
GET /interviews/upcoming
POST /interviews
PATCH /interviews/:id
DELETE /interviews/:id
```

### 11.4 Token Handling

The backend should issue the JWT.

The mobile app should:

```txt
Receive access token after login/register
Store access token in SecureStore
Attach token to future API requests
Clear token on logout
Redirect to AuthNavigator when logged out
```

For MVP, this is enough.

Later improvement:

```txt
Access token + refresh token
Refresh-token rotation
Biometric app lock
Device/session management
```

---

## 12. Data Model Alignment

The mobile app must use the same data model as the backend and web app.

### 12.1 Application Statuses

```ts
export const APPLICATION_STATUSES = [
  "SAVED",
  "APPLIED",
  "SCREENING",
  "INTERVIEW",
  "TECHNICAL_ASSESSMENT",
  "FINAL_INTERVIEW",
  "OFFER",
  "REJECTED",
  "WITHDRAWN",
] as const;
```

### 12.2 Status Labels

```ts
export const STATUS_LABELS = {
  SAVED: "Saved",
  APPLIED: "Applied",
  SCREENING: "Screening",
  INTERVIEW: "Interview",
  TECHNICAL_ASSESSMENT: "Technical Assessment",
  FINAL_INTERVIEW: "Final Interview",
  OFFER: "Offer",
  REJECTED: "Rejected",
  WITHDRAWN: "Withdrawn",
};
```

### 12.3 Work Mode Options

```txt
REMOTE
HYBRID
ONSITE
UNSPECIFIED
```

### 12.4 Application Source Options

```txt
LINKEDIN
COMPANY_WEBSITE
REFERRAL
INDEED
TWITTER_X
EMAIL
OTHER
```

### 12.5 Important Rule

If the backend uses enums, the mobile app must send the enum values exactly as the backend expects.

Do not send display labels like:

```txt
Technical Assessment
```

Send backend values like:

```txt
TECHNICAL_ASSESSMENT
```

---

## 13. Screen Requirements

## 13.1 Login Screen

Purpose:

Allow existing users to authenticate.

Fields:

```txt
Email
Password
```

Actions:

```txt
Login
Navigate to Register
```

Acceptance criteria:

```txt
User can enter email and password
Invalid form values are blocked
Login request is sent to backend
Token is stored securely after success
User is redirected to Home
Generic error is shown for invalid credentials
Loading state appears while request is pending
```

Security considerations:

```txt
Do not show whether email or password is wrong
Do not store password
Do not log token in console
Do not expose raw backend stack traces
```

---

## 13.2 Register Screen

Purpose:

Allow new users to create an account.

Fields:

```txt
Full name
Email
Password
Confirm password
```

Acceptance criteria:

```txt
User can register with valid details
Password confirmation is validated
Duplicate email error is shown cleanly
Token/session is handled according to backend behavior
User can navigate to Login
```

---

## 13.3 Home Screen

Purpose:

Give the user a quick mobile summary of their job search.

Required sections:

```txt
Greeting/user name
Total applications
Active applications
Upcoming reminder
Upcoming interview
Recent applications
Quick actions
```

Suggested quick actions:

```txt
Add Job
Update Status
Add Note
View Reminders
```

Acceptance criteria:

```txt
Home fetches dashboard summary from backend
User sees useful empty state if no data exists
Cards navigate to related screens
Home remains readable on small screens
```

Reason:

The Home screen helps the user answer: “What needs my attention now?”

---

## 13.4 Applications List Screen

Purpose:

Show the user’s job applications in a mobile-friendly list.

Features:

```txt
Application cards
Search by job title/company
Filter by status
Pull to refresh
Tap to view details
Empty state
```

Each card should show:

```txt
Job title
Company name
Status badge
Location/work mode
Deadline if available
Last updated date
```

Acceptance criteria:

```txt
Applications are loaded from backend
Only authenticated user data is shown
Search/filter works
Pull-to-refresh reloads data
Tap opens Application Details
Loading, error, and empty states exist
```

---

## 13.5 Quick Add Application Screen

Purpose:

Allow users to quickly capture a job opportunity from mobile.

Required fields:

```txt
Job title
Company name
Status
```

Optional fields:

```txt
Job URL
Location
Work mode
Deadline
Source
Notes
Salary min
Salary max
Currency
```

Acceptance criteria:

```txt
Required fields are validated
Invalid URL is handled
Salary min cannot exceed salary max
Application is created through backend
User sees success message
User is redirected to details screen or applications list
```

Reason:

Fast capture is one of the main reasons the mobile app exists.

---

## 13.6 Application Details Screen

Purpose:

Show full information for a selected job application and provide quick management actions.

Sections:

```txt
Job/company header
Current status
Job metadata
Notes
Timeline preview
Related reminders
Related interviews
Action buttons
```

Primary actions:

```txt
Update Status
Add Note
Create Reminder
Create Interview
Open Job Link
```

Acceptance criteria:

```txt
Application details load correctly
User can open job URL if available
User can navigate to update status
User can navigate to add note
Timeline preview is shown
Related reminders/interviews are visible if supported by backend
```

---

## 13.7 Update Status Screen

Purpose:

Allow user to update the application pipeline status quickly.

Status options:

```txt
SAVED
APPLIED
SCREENING
INTERVIEW
TECHNICAL_ASSESSMENT
FINAL_INTERVIEW
OFFER
REJECTED
WITHDRAWN
```

Acceptance criteria:

```txt
Current status is highlighted
User can select a new status
PATCH request is sent to backend
Backend creates status-change timeline event
UI refreshes with updated status
Error message appears if update fails
```

Reason:

This is one of the highest-value mobile actions. Many status updates happen after messages, emails, or phone calls.

---

## 13.8 Add Timeline Note Screen

Purpose:

Allow users to record a quick note/update.

Fields:

```txt
Event type
Title
Description
```

Example notes:

```txt
Recruiter replied and asked for availability
Sent follow-up email
Completed technical assessment
Company said they will respond next week
```

Acceptance criteria:

```txt
User can add a note linked to application
Note appears in application timeline
Form validates required fields
Success/error feedback appears
```

Reason:

This makes the app more than a status tracker. It captures context.

---

## 13.9 Reminders Screen

Purpose:

Show follow-up reminders and allow basic reminder management.

Features:

```txt
Upcoming reminders
All reminders
Mark as completed
Pull to refresh
Open related application
```

MVP actions:

```txt
View reminders
Mark completed
Open related application
```

Optional if backend already supports it:

```txt
Create reminder
Delete reminder
```

Acceptance criteria:

```txt
Reminders load from backend
Upcoming reminders are clearly visible
Completed reminders are visually different
User can mark reminder complete
Reminder links back to application
```

---

## 13.10 Interviews Screen

Purpose:

Show upcoming and past interviews.

Features:

```txt
Upcoming interviews
Interview details
Application link
Meeting link/location
Notes
Outcome if available
```

MVP actions:

```txt
View interviews
Open related application
Open meeting link if available
```

Optional if backend already supports it:

```txt
Create interview
Update interview notes
```

Acceptance criteria:

```txt
Interviews load from backend
Upcoming interviews are visible
User can open related application
User can view notes/outcome
```

---

## 13.11 Profile Screen

Purpose:

Show user account information and logout.

Required sections:

```txt
User name
Email
App version if desired
Logout button
```

Acceptance criteria:

```txt
Current user is shown
Logout clears SecureStore token
User returns to Login screen
```

---

## 14. UI Component Requirements

Build reusable mobile components.

### 14.1 Screen Component

Purpose:

Standard wrapper for safe area, spacing, background, and optional scrolling.

### 14.2 Button Component

Variants:

```txt
primary
secondary
outline
danger
ghost
```

### 14.3 Input Component

Supports:

```txt
label
placeholder
error message
secure text entry
keyboard type
multiline
```

### 14.4 StatusBadge Component

Displays application status consistently.

### 14.5 EmptyState Component

Used when there are no applications, reminders, interviews, or timeline notes.

### 14.6 LoadingState Component

Used while fetching data.

### 14.7 ErrorState Component

Used when API request fails.

### 14.8 ApplicationCard Component

Displays application information in mobile card format.

### 14.9 ReminderCard Component

Displays reminder information.

### 14.10 InterviewCard Component

Displays interview information.

---

## 15. State Management Plan

### 15.1 Auth State

Use Zustand or Context API.

Auth state should include:

```txt
user
isAuthenticated
isLoading
login()
register()
logout()
restoreSession()
```

### 15.2 Server State

For MVP, you can use simple hooks with local loading/error state.

Better option:

```txt
TanStack Query
```

If the web app already uses TanStack Query and you want consistency, use it in mobile too.

Recommended for maintainability:

```bash
npm install @tanstack/react-query
```

Use it for:

```txt
applications
dashboard summary
reminders
interviews
application details
timeline events
```

Benefits:

```txt
Caching
Refetching
Loading/error states
Mutation handling
Cleaner API calls
```

Tradeoff:

```txt
Slightly more setup
More concepts to understand
```

Recommendation:

Use TanStack Query if you can. If speed is the priority, start with service functions and local state, then refactor.

---

## 16. Security Requirements

### 16.1 Token Storage

Use Expo SecureStore for auth tokens.

Do not use:

```txt
AsyncStorage for JWT tokens
Hardcoded tokens
Plain text files
```

### 16.2 API Secrets

Mobile app must not contain backend secrets.

Never include:

```txt
DATABASE_URL
JWT_SECRET
Stripe secret key
AI provider API keys
```

### 16.3 Authorization

The mobile app must not assume ownership.

Even if the UI hides another user's data, the backend must enforce user ownership.

Mobile should handle authorization failures:

```txt
401 Unauthorized → logout or ask user to login again
403 Forbidden → show access denied message
404 Not Found → show not found message
```

### 16.4 Input Validation

Validate forms on mobile using Zod.

Backend validation still remains the final authority.

### 16.5 Logging

Do not log sensitive values:

```txt
JWT tokens
Passwords
Authorization headers
Full error responses containing secrets
```

### 16.6 Network Security

In production:

```txt
Use HTTPS API URL
Do not call localhost
Do not use insecure backend URLs
```

### 16.7 Session Expiry

If backend returns 401:

```txt
Clear local token
Redirect to Login
Show: Your session has expired. Please log in again.
```

---

## 17. Testing Strategy

Testing is a required part of the mobile implementation.

### 17.1 Testing Goals

Tests should verify:

```txt
Auth screens validate inputs
Login calls backend service correctly
Navigation changes based on auth state
Applications list renders data correctly
Application cards show status/company/title
Quick add form validates required fields
Status update sends correct enum value
Reminder cards render due dates correctly
Logout clears auth state
```

### 17.2 Recommended Testing Tools

```txt
Jest
jest-expo
React Native Testing Library
```

### 17.3 Test File Pattern

```txt
src/screens/auth/__tests__/LoginScreen.test.tsx
src/screens/applications/__tests__/ApplicationsScreen.test.tsx
src/components/applications/__tests__/ApplicationCard.test.tsx
src/store/__tests__/auth.store.test.ts
```

### 17.4 Required Test Scripts

Add to `package.json`:

```json
{
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "lint": "eslint ."
  }
}
```

### 17.5 Jest Config

Create `jest.config.js`:

```js
module.exports = {
  preset: "jest-expo",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|@react-native|expo(nent)?|@expo(nent)?/.*|@react-navigation/.*|react-native-reanimated|lucide-react-native)/)"
  ],
};
```

Create `jest.setup.ts`:

```ts
import "@testing-library/jest-native/extend-expect";

jest.mock("expo-secure-store", () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));
```

### 17.6 Minimum Tests Before MVP Release

Minimum test checklist:

```txt
Login form validation test
Register form validation test
Auth store login/logout test
ApplicationCard render test
Applications list empty state test
Quick Add form validation test
StatusBadge render test
ReminderCard render test
```

### 17.7 Manual Test Checklist

Auth:

```txt
Can register
Can login
Wrong credentials show error
Token persists after app reload
Logout clears session
Expired/invalid token redirects to login
```

Applications:

```txt
Can fetch applications
Can quick add application
Can view application details
Can update status
Status update appears on web after refresh
Can add timeline note
Timeline note appears on web after refresh
```

Reminders:

```txt
Can view reminders
Can mark reminder completed
Completed state reflects on web
```

Interviews:

```txt
Can view interviews
Can open related application
Can open meeting link if available
```

Cross-platform:

```txt
Test on Expo Go Android
Test on Expo Go iOS if available
Test small screen layout
Test slow network state
Test offline/error state
```

---

## 18. Implementation Plan

## Day 1: Setup, Architecture, Navigation, Auth Foundation

### Goals

Set up the mobile app foundation and connect the app to the existing backend authentication system.

### Tasks

1. Create Expo React Native TypeScript app

```bash
npx create-expo-app@latest mobile --template blank-typescript
```

2. Install required packages

```bash
npx expo install expo-secure-store expo-constants
npm install axios zod react-hook-form @hookform/resolvers zustand date-fns
npm install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs
npx expo install react-native-screens react-native-safe-area-context react-native-gesture-handler react-native-reanimated
npm install lucide-react-native
```

3. Set up project folders

```bash
mkdir -p src/navigation src/services src/store src/hooks src/constants src/schemas src/types src/utils
mkdir -p src/screens/auth src/screens/dashboard src/screens/applications src/screens/reminders src/screens/interviews src/screens/profile
mkdir -p src/components/ui src/components/applications src/components/reminders src/components/interviews
```

4. Configure environment variables

```bash
touch .env .env.example
```

5. Add API base URL

```env
EXPO_PUBLIC_API_URL=http://localhost:4000/api/v1
```

6. Create centralized API client

```txt
src/services/api.ts
```

7. Create auth service

```txt
src/services/auth.service.ts
```

8. Create auth store

```txt
src/store/auth.store.ts
```

9. Set up navigation

```txt
RootNavigator
AuthNavigator
AppNavigator
ApplicationsNavigator
```

10. Build Login screen UI

11. Build Register screen UI

12. Connect login/register to backend

13. Store token in SecureStore

14. Restore session on app start

### Deliverables

```txt
Expo app runs
Navigation works
Login screen exists
Register screen exists
API client exists
Auth store exists
User can log in against backend
Token persists securely
Authenticated user enters app tabs
```

### Acceptance Criteria

```txt
Invalid login shows error
Valid login redirects to Home
Logout removes token
Closing/reopening app keeps session if token is valid
No token is logged in console
```

---

## Day 2: Home, Applications List, Quick Add

### Goals

Build the main mobile job tracking experience.

### Tasks

1. Create dashboard service

```txt
src/services/dashboard.service.ts
```

2. Build Home screen

Required sections:

```txt
Greeting
Summary cards
Upcoming reminder
Upcoming interview
Recent applications
Quick actions
```

3. Create applications service

```txt
src/services/applications.service.ts
```

4. Build ApplicationCard component

5. Build StatusBadge component

6. Build Applications List screen

Features:

```txt
Fetch applications
Search
Filter by status
Pull to refresh
Empty state
Error state
```

7. Build Quick Add Application screen

8. Add application schema with Zod

9. Connect create application API

10. Navigate to details or list after success

### Deliverables

```txt
Home screen loads backend dashboard data
Applications list loads backend applications
Application cards render correctly
Quick Add screen creates new application
New mobile-created application appears in web app
```

### Acceptance Criteria

```txt
User can see dashboard summary
User can see applications created on web
User can create application from mobile
User can search/filter applications
Empty state works for a new user
```

---

## Day 3: Application Details, Status Updates, Timeline Notes

### Goals

Make the mobile app useful for real job search updates.

### Tasks

1. Build Application Details screen

2. Fetch single application

3. Display:

```txt
Job title
Company
Status
Location
Work mode
Deadline
Salary if available
Notes
Timeline preview
Related reminders
Related interviews
```

4. Build Update Status screen

5. Connect status update API

6. Ensure updated status refreshes details/list

7. Build Add Timeline Note screen

8. Create timeline schema

9. Connect timeline note API

10. Add “Open Job Link” action if URL exists

### Deliverables

```txt
User can open application details
User can update application status
Status update appears on web app
User can add timeline note
Timeline note appears on web app
```

### Acceptance Criteria

```txt
Current status is shown accurately
Status enum sent to backend is correct
Failed status update shows error
Timeline note is linked to the right application
Application detail screen handles missing optional fields cleanly
```

---

## Day 4: Reminders, Interviews, Profile, Testing, Polish

### Goals

Finish the core mobile MVP and make it testable.

### Tasks

1. Create reminders service

```txt
src/services/reminders.service.ts
```

2. Build Reminders screen

3. Build ReminderCard component

4. Connect mark reminder complete

5. Create interviews service

```txt
src/services/interviews.service.ts
```

6. Build Interviews screen

7. Build InterviewCard component

8. Build Profile screen

9. Show current user data

10. Add logout

11. Add loading states

12. Add error states

13. Add empty states

14. Add toast/feedback messages if using a notification library

15. Set up Jest and React Native Testing Library

16. Add minimum MVP tests

17. Run full manual test against backend and web app

### Deliverables

```txt
Reminders screen works
Interviews screen works
Profile/logout works
Loading/error/empty states exist
Minimum tests exist
Mobile app is ready for Expo preview testing
```

### Acceptance Criteria

```txt
User can view reminders
User can mark reminder complete
User can view interviews
User can logout
All required tests pass
Mobile changes reflect on web
Web changes reflect on mobile
```

---

## 19. Release Readiness Checklist

The mobile MVP is ready when:

```txt
App runs in Expo Go
User can register/login
Token persists securely
Authenticated navigation works
Home summary loads
Applications list loads
Quick Add creates application
Application details load
Status update works
Timeline note creation works
Reminders load
Reminder completion works
Interviews load
Profile displays user info
Logout works
Loading states exist
Error states exist
Empty states exist
Minimum tests pass
Mobile app uses production API URL when configured
README setup instructions exist
```

---

## 20. Cross-Client Acceptance Tests

These tests confirm that the backend is truly the source of truth.

### Test 1: Web to Mobile

```txt
Create application on web
Open mobile app
Refresh applications list
Application appears on mobile
```

### Test 2: Mobile to Web

```txt
Create application on mobile
Open web app
Refresh applications list
Application appears on web
```

### Test 3: Status Sync

```txt
Update status on mobile
Open same application on web
Status is updated
Timeline event exists
```

### Test 4: Timeline Sync

```txt
Add timeline note on mobile
Open same application on web
Timeline note appears
```

### Test 5: Reminder Sync

```txt
Mark reminder complete on mobile
Open reminders page on web
Reminder is completed
```

---

## 21. Documentation Requirements

Add a README for the mobile app.

Required sections:

```txt
Project Overview
Mobile App Role
Tech Stack
Folder Structure
Environment Variables
Local Setup
Running with Expo Go
Backend Integration
Auth Flow
Testing
Known Limitations
Roadmap
```

Also include:

```txt
EXPO_PUBLIC_API_URL setup
How to run tests
How to connect to local backend
How to switch to production backend
```

---

## 22. V2 Mobile Planning

When V2 starts, mobile should support selected parts of:

```txt
Job board discovery
Save external job to tracker
Resume upload
AI CV scoring summary
Payment plan screen
Subscription status
Basic account billing view
```

### V2 Mobile Screens

Possible screens:

```txt
Job Board
Job Details
Saved Jobs
Resume Upload
Resume Review Result
Subscription Plans
Billing Status
```

### V2 Important Note

Payment processing should be handled carefully.

Mobile payment rules can differ depending on whether the feature is digital content, SaaS access, or external web subscription. Do not implement mobile subscription flows casually. Decide the billing architecture before building mobile payment screens.

For early V2, the simplest approach may be:

```txt
Manage subscription from web
Mobile only displays current plan/status
```

---

## 23. V3 Mobile Planning

V3 may include:

```txt
Push notifications
Advanced reminder workers
Calendar sync
Email sync status
Browser extension integration surfaces
Team features
Recruiter/company account views
```

### V3 Mobile Screens

Possible screens:

```txt
Notification Center
Calendar Sync
Email Sync Settings
Team Workspace
Company/Recruiter Dashboard
```

These should not be added until the core job seeker experience is stable.

---

## 24. Risks and Tradeoffs

### 24.1 Expo Go vs Development Build

Expo Go is fastest for MVP preview.

Tradeoff:

```txt
Some native packages may require development builds later
```

Recommendation:

```txt
Use Expo Go for MVP
Move to EAS development builds when native requirements increase
```

### 24.2 SecureStore vs AsyncStorage

SecureStore is better for tokens.

Tradeoff:

```txt
Slightly more async handling
```

Recommendation:

```txt
Use SecureStore for auth tokens
Use AsyncStorage only later for non-sensitive preferences
```

### 24.3 Local State vs TanStack Query

Local state is faster to start.

TanStack Query is better for app scalability.

Recommendation:

```txt
Use TanStack Query if the frontend web already uses it or if you want cleaner server-state handling.
Otherwise start simple and refactor after MVP.
```

### 24.4 Mobile Form Scope

Too many fields can make mobile forms painful.

Recommendation:

```txt
Quick Add should require only job title, company, and status.
Other fields should be optional or collapsible.
```

---

## 25. Definition of Done

The JobTrackr mobile MVP is done when:

```txt
The mobile app uses the existing backend API
The backend remains the source of truth
The user can authenticate
The user can view dashboard summary
The user can view applications
The user can add applications
The user can update application status
The user can add timeline notes
The user can view reminders
The user can mark reminders completed
The user can view interviews
The user can view profile data
The user can logout
The app has loading/error/empty states
The app has basic tests
The app has setup documentation
Web/mobile data stays synchronized
```

---

## 26. Final Implementation Order

Use this order:

```txt
1. Expo TypeScript setup
2. Package installation
3. Folder structure
4. Environment variable setup
5. API client
6. Auth service
7. Auth store
8. Navigation
9. Login/Register
10. Session restore
11. Home screen
12. Applications service
13. Applications list
14. Quick Add application
15. Application details
16. Update status
17. Add timeline note
18. Reminders screen
19. Interviews screen
20. Profile/logout
21. Loading/error/empty states
22. Tests
23. README
24. Expo preview testing
```

---

## 27. Final Notes

The mobile app should be judged by one question:

> Can a job seeker quickly manage important job-search updates from their phone while staying fully synchronized with the web dashboard?

If the answer is yes, the mobile MVP is successful.

Do not overbuild the mobile app in the first release. Build a focused companion that strengthens the product and proves the backend/web architecture was designed correctly.

---

## 28. Reference Documentation

These are the external docs used to shape the technical recommendations:

- Expo `create-expo-app` documentation
- Expo SecureStore documentation
- Expo environment variables documentation
- React Navigation bottom tabs documentation
- React Navigation native stack documentation
- React Native security documentation
