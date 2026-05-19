# JobTrackr Mobile Application V2 PRD + Implementation Plan

## 1. Document Purpose

This document defines the Product Requirements Document (PRD) and implementation plan for the **JobTrackr V2 mobile application**.

V1 delivered the mobile companion experience for the existing JobTrackr MVP: authentication, dashboard summary, application list, quick add application, application details, status updates, timeline notes, reminders, interviews, profile, and logout.

V2 expands JobTrackr from a manual job application tracker into a more intelligent job-search platform with resume intelligence, job discovery, AI matching, job alerts, billing awareness, browser-extension support, and calendar integration.

The mobile app must continue to behave as a **companion app**, not the full control surface. The web app remains the primary workspace for complex flows such as full resume editing, admin management, subscription management, job source management, and advanced AI review screens. The backend remains the **source of truth** for both web and mobile.

---

## 2. V2 Product Context

### 2.1 Product Name

**JobTrackr**

### 2.2 V1 Product Positioning

> JobTrackr is a personal CRM for job seekers that helps candidates track job applications, interviews, follow-ups, reminders, and outcomes across web and mobile.

### 2.3 V2 Product Positioning

> JobTrackr is an AI-powered job search workspace that helps candidates discover relevant jobs, match opportunities to their resume, improve their CV, and track applications from job discovery to final offer.

### 2.4 Mobile V2 Positioning

The mobile app should be positioned as:

> The quick-action and alert companion for JobTrackr users.

The mobile app should help users quickly:

- view matched jobs
- browse jobs
- save jobs
- convert saved jobs into tracked applications
- see resume score summaries
- check AI match insights
- receive and manage job alerts
- view reminders and interviews
- sync important job-search activity with the backend
- manage lightweight account/beta-plan visibility

The mobile app should not become the full replacement for the web dashboard.

---

## 3. V2 Mobile Strategy

### 3.1 Core Strategy

V2 mobile should not try to copy every V2 web feature.

The correct strategy is:

```txt
Web = full workspace and admin/control surface
Mobile = quick-action companion and alerts surface
Backend = single source of truth
```

The mobile app should expose only the V2 features that make sense on a small screen and in short user sessions.

### 3.2 Why Mobile Still Matters in V2

V2 introduces job discovery and matching. Those are very useful on mobile because users often:

- browse opportunities from their phone
- receive job alerts while away from their laptop
- quickly save jobs for later
- open job links from email or social platforms
- check match scores before deciding whether to apply
- update application status after recruiter communication
- review reminders before follow-up deadlines

The mobile app should make these actions fast and focused.

### 3.3 Backend as Source of Truth

The mobile app must not locally compute authoritative values such as:

- job match score
- AI resume review score
- feature entitlement
- subscription status
- parsed resume profile
- job alert eligibility
- saved job ownership
- calendar sync state
- application ownership
- admin permissions

The mobile app should only display backend results and submit user actions.

---

## 4. Relationship With V1

### 4.1 Existing V1 Mobile Features

The V1 mobile app already supports or is expected to support:

```txt
Login
Register
Home summary
Applications list
Quick add application
Application details
Update application status
Add timeline note
Reminders
Interviews
Profile
Logout
```

V2 should build on this foundation instead of replacing it.

### 4.2 Existing V1 Data Foundation

The existing backend already owns:

```txt
users
authentication
job_applications
application_events
reminders
interviews
dashboard summary
```

V2 adds new backend domains:

```txt
resumes
candidate_profiles
resume_reviews
external_jobs
saved_jobs
job_match_results
job_alert_preferences
subscriptions
plans
feature_entitlements
calendar_integrations
extension-created records
notifications
```

Mobile must consume these through the backend API only.

---

## 5. V2 Mobile Scope

## 5.1 Included in V2 Mobile

The mobile V2 app should include:

1. Updated navigation for V2 modules
2. Jobs discovery page
3. Job search and filters
4. Job details page
5. Save job action
6. Convert saved job to application
7. Matched jobs page
8. Match score summary cards
9. Job match explanation view
10. Missing skills summary
11. Resume overview page
12. Resume score summary
13. Active resume status
14. Job-specific resume review summary
15. Job alert preferences
16. Job alert notifications/in-app alert list
17. Saved jobs page
18. Beta/subscription status display
19. Feature-locked states where needed
20. Calendar connection status display
21. Interview/reminder calendar-sync indicators
22. Browser extension onboarding/info screen
23. Updated profile/settings screen
24. Mobile test coverage for new flows

## 5.2 Excluded From V2 Mobile Initial Build

The following should not be included in the first V2 mobile build:

- full admin dashboard
- full resume editor with complex structured editing
- job source management
- admin user management
- subscription checkout/payment management
- Stripe customer portal management
- full AI prompt review/debugging screens
- calendar OAuth management if complex
- full two-way calendar sync controls
- browser extension management beyond onboarding/status
- recruiter/company account features
- customer team/workspace collaboration
- advanced analytics dashboards

These should remain web-first or future mobile enhancements.

---

## 6. Key Product Decisions

## 6.1 Mobile is not an admin surface

Admin should remain **web-only** for V2.

Reason:

Admin workflows require:

- large tables
- filtering
- user inspection
- role management
- billing controls
- job source monitoring
- AI usage visibility
- audit trails

These workflows are not suitable for mobile-first management and increase security risk if exposed too broadly.

Mobile can later include a lightweight internal admin monitoring app, but that is not part of V2.

## 6.2 Mobile should show subscription state, not manage billing deeply

Mobile can display:

- current plan
- beta access status
- feature availability
- feature locked messages
- upgrade prompt

But checkout, billing portal, invoice management, and plan configuration should remain web-first.

## 6.3 Mobile should support resume intelligence, but not full resume editing

Mobile should allow users to view:

- active resume
- resume parsing status
- resume review summary
- overall resume score
- job-specific score summary
- missing skills
- improvement suggestions

But complex resume upload, detailed correction, and structured candidate-profile editing should be handled primarily on web.

Optional mobile upload can be added later if file selection and document upload UX is stable.

## 6.4 Mobile should emphasize alerts and quick decisions

The strongest V2 mobile value is:

```txt
Matched job appears
→ user opens mobile alert
→ sees score and reason
→ saves job
→ converts to application later
```

This is more valuable than trying to replicate every web dashboard capability.

---

## 7. Target Users

## 7.1 Primary User: Job Seeker

A job seeker who wants to:

- discover matching jobs
- save roles quickly
- check AI match scores
- review resume improvement summaries
- update applications on the move
- receive alerts about relevant opportunities
- track interviews and reminders from mobile

## 7.2 Secondary User: Existing Web User

A user who primarily manages their job search on web but uses mobile to:

- check updates
- capture notes
- save jobs
- update statuses
- view matched jobs
- respond to reminders

## 7.3 Non-Target User for V2 Mobile

The V2 mobile app is not for:

- platform admins
- recruiters
- company users
- team workspace managers
- billing administrators

Those surfaces belong to web or future products.

---

## 8. V2 Mobile Information Architecture

## 8.1 Recommended Bottom Tabs

V2 mobile should use bottom tab navigation.

Recommended tabs:

```txt
Home
Jobs
Matches
Applications
Profile
```

Alternative if reminders are still a central mobile use case:

```txt
Home
Jobs
Matches
Track
Profile
```

Where `Track` contains:

```txt
Applications
Reminders
Interviews
Timeline activity
```

Recommended choice:

```txt
Home
Jobs
Matches
Track
Profile
```

Reason:

This keeps the bottom tab bar from becoming overcrowded as V2 adds more modules.

## 8.2 Stack Screens

### Home Stack

```txt
Home
JobAlertDetails
UpcomingReminderDetails
UpcomingInterviewDetails
```

### Jobs Stack

```txt
JobsSearch
JobDetails
SavedJobs
SaveJobSuccess
ConvertSavedJobToApplication
```

### Matches Stack

```txt
MatchedJobs
MatchDetails
ResumeMatchSummary
JobSpecificReviewSummary
```

### Track Stack

```txt
Applications
ApplicationDetails
QuickAddApplication
UpdateStatus
AddTimelineNote
Reminders
Interviews
```

### Profile Stack

```txt
Profile
ResumeOverview
ResumeReviewHistory
JobAlertPreferences
SubscriptionStatus
CalendarStatus
ExtensionOnboarding
Settings
```

---

## 9. V2 Mobile User Flows

## 9.1 Job Discovery Flow

```txt
User opens Jobs tab
→ Searches by role/location/work mode
→ Backend returns normalized jobs
→ User opens job details
→ User views company, location, source, requirements, and apply link
→ User saves job
→ Saved job appears in Saved Jobs
```

Reason:

This gives users job discovery on mobile without leaving JobTrackr immediately.

Acceptance criteria:

- User can search jobs from mobile
- User can filter jobs by role, location, work mode, and source if backend supports it
- User can open job details
- User can save a job
- User can view saved jobs
- User can open the original application URL externally
- User sees source attribution where required

---

## 9.2 Save Job to Tracker Flow

```txt
User opens job details
→ Taps Save Job
→ Backend creates saved job record
→ User can choose to keep as saved or convert to application
→ If converted, backend creates job application record
→ Application appears in V1 tracker
```

Reason:

This connects V2 discovery to the V1 tracker. It is one of the most important product loops.

Acceptance criteria:

- User can save external job
- User cannot save duplicates without clear feedback
- User can convert saved job to application
- Converted application appears in Applications
- Converted saved job status changes to converted

---

## 9.3 AI Matched Jobs Flow

```txt
User has active resume/candidate profile
→ User opens Matches tab
→ Backend returns recommended jobs ranked by fit
→ User sees match score cards
→ User opens match details
→ User reviews matched skills, missing skills, and reason
→ User saves or dismisses job
```

Reason:

This is the central V2 intelligence experience for mobile.

Acceptance criteria:

- User sees matched jobs only if resume/profile exists
- Empty state guides user to upload/complete resume on web if needed
- Each match shows score, job title, company, location, and reason
- User can save matched job
- User can dismiss irrelevant job if backend supports it
- Missing skills are displayed clearly

---

## 9.4 Resume Summary Flow

```txt
User opens Profile → Resume Overview
→ Mobile fetches active resume/profile summary
→ User sees parsing status, active resume, core skills, and latest review score
→ User can open latest review summary
→ User is directed to web for full editing if needed
```

Reason:

Mobile users need visibility into resume intelligence, but full resume management is better handled on web.

Acceptance criteria:

- User can see active resume status
- User can see latest resume score summary
- User can see key extracted skills
- User can see whether profile is confirmed
- User sees clear CTA to complete/edit profile on web when required

---

## 9.5 AI Resume Review Summary Flow

```txt
User opens Resume Review History
→ Selects a review
→ Views score breakdown and suggestions
→ For job-specific review, user sees relation to selected job
```

Reason:

This keeps AI value visible on mobile without overloading the mobile UI.

Acceptance criteria:

- User can view previous resume reviews
- User can view general and job-specific review summaries
- Suggestions are grouped into readable sections
- Long AI output is not dumped as one paragraph
- User is directed to web for deeper editing

---

## 9.6 Job Alerts Flow

```txt
User opens Job Alert Preferences
→ Sets roles, location, work mode, keywords, and frequency
→ Backend stores preferences
→ User sees matching job alerts in Home/Jobs
```

Reason:

Job alerts make mobile valuable because the phone is the natural notification surface.

Acceptance criteria:

- User can view and update alert preferences
- User can enable/disable alerts
- User can view alert list or recent matched jobs
- If push notifications are not ready, user sees in-app alerts first
- Alert preferences are stored in backend

---

## 9.7 Subscription/Beta Access Flow

```txt
User opens Profile → Plan Status
→ Mobile fetches current plan and entitlements
→ User sees Beta Free, Free, Pro, or Premium status
→ Feature-locked screens show appropriate message
→ User is directed to web for billing actions
```

Reason:

Mobile should respect feature access without owning billing.

Acceptance criteria:

- User sees current plan
- User sees beta expiry if applicable
- Feature access states are respected
- Locked features show clear upgrade/beta message
- Mobile does not expose sensitive billing logic

---

## 9.8 Calendar Status Flow

```txt
User opens Profile → Calendar Status
→ Mobile shows whether Google Calendar is connected
→ User sees synced interview/reminder indicators
→ User is directed to web if connection setup is not supported on mobile yet
```

Reason:

Calendar sync is useful on mobile, but OAuth and settings can start web-first.

Acceptance criteria:

- User can see calendar connection status
- User can see which interviews/reminders are synced if backend provides this
- User can open web setup link if mobile OAuth is deferred

---

## 9.9 Browser Extension Onboarding Flow

```txt
User opens Profile → Browser Extension
→ Mobile explains what the extension does
→ User sees installation link or QR/web link
→ User understands extension saves jobs from external job boards to JobTrackr
```

Reason:

The browser extension is not a mobile feature, but mobile users should understand that JobTrackr supports external capture from desktop browsing.

Acceptance criteria:

- User can view extension explanation
- User can open installation/help link
- User sees connection status if backend exposes it

---

## 10. V2 Mobile Screens and Requirements

## 10.1 Home Screen

Purpose:

Provide a quick summary of job-search activity and alerts.

Required sections:

```txt
Greeting
Application summary
New matched jobs
Upcoming reminders
Upcoming interviews
Recent activity
Resume/profile completion status
Beta/plan badge if relevant
```

Acceptance criteria:

- Home screen loads from backend dashboard/mobile summary endpoint
- User sees actionable items first
- User can navigate to matched jobs, reminders, interviews, and resume overview
- New users see useful empty states

---

## 10.2 Jobs Search Screen

Purpose:

Allow mobile users to browse aggregated jobs.

Features:

```txt
Search input
Location filter
Work mode filter
Experience level filter
Source filter if available
Job cards
Save job action
Open job details
```

Job card should show:

```txt
Job title
Company
Location
Remote/hybrid/onsite
Source
Posted date
Match score if available
Save button
```

Acceptance criteria:

- User can search jobs
- User can paginate or infinite-scroll results if backend supports pagination
- Loading, empty, and error states exist
- Saved jobs show saved state

---

## 10.3 Job Details Screen

Purpose:

Show full details of a job listing.

Sections:

```txt
Job title/company
Location/work mode
Source/apply URL
Description
Requirements
Salary if available
Posted/expires dates
Match score if available
Save button
Convert to application button if already saved
Open original job link
```

Acceptance criteria:

- User can view job details
- User can save job
- User can convert saved job to application
- User can open external apply URL
- Long descriptions are readable and collapsible where necessary

---

## 10.4 Saved Jobs Screen

Purpose:

Allow users to manage jobs they saved from discovery or matching.

Features:

```txt
Saved jobs list
Filter saved/converted/dismissed where relevant
Open job details
Convert to application
Remove saved job
```

Acceptance criteria:

- User can view saved jobs
- User can convert saved job into application
- Converted jobs are visibly marked
- User can remove saved job if backend supports it

---

## 10.5 Matched Jobs Screen

Purpose:

Show AI-ranked jobs based on resume/candidate profile.

Features:

```txt
Recommended job cards
Match score
Matched skills
Missing skills preview
Reason for recommendation
Save/dismiss action
```

Acceptance criteria:

- User can view matched jobs
- User sees clear match scores
- User can open detailed explanation
- User can save or dismiss jobs
- User sees profile-required empty state if no candidate profile exists

---

## 10.6 Match Details Screen

Purpose:

Explain why a job matches the user.

Sections:

```txt
Overall score
Skill score
Experience score
Location score
Salary fit if available
Matched skills
Missing skills
AI explanation
Recommendation
CTA: Save Job
CTA: Review Resume Against This Job
```

Acceptance criteria:

- User sees structured match explanation
- Scores are displayed clearly without overwhelming the user
- Missing skills are actionable
- User can save the job or run/view job-specific review if backend supports it

---

## 10.7 Resume Overview Screen

Purpose:

Show the user’s active resume and candidate profile summary.

Sections:

```txt
Active resume file
Parsing status
Profile confirmation status
Top skills
Target roles
Years of experience
Preferred locations/work modes
Latest review score
CTA to manage resume on web
```

Acceptance criteria:

- User sees active resume status
- User sees whether profile is ready for matching
- User sees clear next step if profile is incomplete
- User is not forced into complex mobile editing

---

## 10.8 Resume Review Summary Screen

Purpose:

Show AI resume review results in mobile-friendly format.

Sections:

```txt
Overall score
ATS score
Keyword score
Structure score
Clarity score
Strengths
Weaknesses
Missing keywords
Top suggestions
Job-specific context if applicable
```

Acceptance criteria:

- User can view review summary
- Suggestions are grouped and readable
- Job-specific reviews link back to job/application
- Long content is expandable

---

## 10.9 Job Alert Preferences Screen

Purpose:

Allow the user to define what jobs they want to be notified about.

Fields:

```txt
Target roles
Keywords
Locations
Work modes
Salary minimum
Experience level
Frequency
Enabled/disabled
```

Acceptance criteria:

- User can view current preferences
- User can update preferences
- User can disable alerts
- Backend persists changes
- Mobile validates required fields lightly but backend validates authoritatively

---

## 10.10 Plan/Beta Status Screen

Purpose:

Display subscription/beta access without making mobile the billing control surface.

Sections:

```txt
Current plan
Beta status
Beta expiry date
Available features
Locked features
CTA to manage billing on web
```

Acceptance criteria:

- User can see current plan
- User can see if beta access is active
- Feature gates are explained clearly
- Billing actions route to web if needed

---

## 10.11 Calendar Status Screen

Purpose:

Show calendar integration status.

Sections:

```txt
Connected provider
Connection status
Last sync time
Synced interviews
Synced reminders if supported
CTA to connect/manage on web
```

Acceptance criteria:

- User can see whether calendar is connected
- User sees sync state for interviews/reminders
- User gets clear guidance if setup must be done on web

---

## 10.12 Browser Extension Onboarding Screen

Purpose:

Educate users about saving jobs from external sites through the browser extension.

Sections:

```txt
What the extension does
How it saves jobs
Supported browser
Install/open link
Connection status if available
Safety note: user-controlled capture
```

Acceptance criteria:

- User understands the extension value
- User can open installation/help link
- Screen does not imply mobile browser automation

---

## 11. Backend API Dependencies

Mobile V2 depends on the backend V2 APIs.

Expected endpoint groups:

```txt
/resumes
/candidate-profile
/resume-reviews
/jobs
/saved-jobs
/job-matches
/job-alerts
/subscriptions
/entitlements
/calendar-integrations
/extension
/mobile/summary or /dashboard/mobile-summary
```

The mobile app should not call internal admin APIs.

## 11.1 Mobile-Specific Summary Endpoint

Recommended backend endpoint:

```txt
GET /api/v1/mobile/summary
```

Purpose:

Return a compact mobile-optimized summary instead of making mobile call many heavy endpoints on launch.

Possible response:

```json
{
  "applications": {
    "total": 24,
    "active": 11,
    "interviews": 3
  },
  "matches": {
    "newCount": 8,
    "topMatches": []
  },
  "resume": {
    "hasActiveResume": true,
    "profileConfirmed": true,
    "latestScore": 82
  },
  "reminders": {
    "upcoming": []
  },
  "interviews": {
    "upcoming": []
  },
  "plan": {
    "code": "BETA_FREE",
    "status": "BETA"
  }
}
```

Reason:

Mobile startup should be fast and should avoid unnecessary network calls.

---

## 12. Data and State Management

## 12.1 State Categories

Mobile state should be divided into:

```txt
Server state
Local UI state
Auth/session state
Form state
```

### Server state

Examples:

```txt
jobs
matched jobs
saved jobs
resume summary
review history
alert preferences
subscription status
calendar status
```

Recommended handling:

```txt
TanStack Query or equivalent query library
```

### Local UI state

Examples:

```txt
selected filters
bottom sheet state
modal state
active tab state
```

Recommended handling:

```txt
component state or lightweight store
```

### Auth/session state

Examples:

```txt
access token
current user
logout state
```

Recommended handling:

```txt
SecureStore + auth store
```

### Form state

Examples:

```txt
job alert preferences
quick add application
status update
```

Recommended handling:

```txt
React Hook Form + Zod
```

---

## 13. Mobile Security Requirements

## 13.1 Auth Tokens

Mobile should store auth tokens in secure device storage.

Recommended:

```txt
Expo SecureStore
```

Rules:

- never store passwords
- never store JWT secrets
- never store API secrets
- clear tokens on logout
- handle expired tokens gracefully

## 13.2 Environment Variables

Only public runtime configuration should use `EXPO_PUBLIC_` variables.

Allowed:

```txt
EXPO_PUBLIC_API_URL
EXPO_PUBLIC_WEB_APP_URL
```

Not allowed:

```txt
JWT_SECRET
DATABASE_URL
STRIPE_SECRET_KEY
AI_API_KEY
GOOGLE_CLIENT_SECRET
```

## 13.3 Authorization

Mobile should assume every request can fail with:

```txt
401 Unauthorized
403 Forbidden
404 Not Found
```

The backend must enforce all ownership and entitlement rules.

Mobile must not hide forbidden data as a security mechanism. It should only improve UX.

## 13.4 Feature Entitlements

Mobile must check backend-provided entitlements before showing actions such as:

```txt
Run AI review
View unlimited matches
Enable advanced alerts
Access premium job insights
```

If a feature is locked:

- show clear explanation
- show plan/beta state
- direct user to web billing page if payment management is required

## 13.5 External Links

External job links should open using safe linking APIs.

Rules:

- show user they are leaving JobTrackr
- avoid opening unknown deep links blindly
- validate URLs where possible
- backend should sanitize stored URLs

## 13.6 AI Output Safety

AI-generated output should be treated as untrusted display content.

Rules:

- render as plain text
- do not render raw HTML
- avoid copying unsafe markup into UI
- structure suggestions into cards/lists

---

## 14. Mobile Design Requirements

## 14.1 Design Direction

The mobile app should remain:

```txt
clean
professional
calm
fast
focused
career-oriented
```

Avoid:

```txt
dense dashboards
generic AI gradients
unnecessary illustrations
complex admin tables
overloaded screens
```

## 14.2 V2 Visual Priorities

Prioritize:

- clear job cards
- clean match score indicators
- readable explanations
- quick save buttons
- simple filters
- clear empty states
- bottom sheets for actions
- concise AI summaries
- calm alerts

## 14.3 Empty States

Important empty states:

### No resume/profile

```txt
Upload and confirm your resume on web to unlock matched jobs and AI scoring.
```

### No matched jobs

```txt
No strong matches yet. Update your profile or adjust your job alert preferences.
```

### No saved jobs

```txt
Save jobs from search or matched jobs to review and apply later.
```

### Feature locked

```txt
This feature is not available on your current plan. You are currently on Beta Free/Free.
```

---

## 15. Recommended Mobile Folder Structure Expansion

Existing mobile app structure can be expanded as follows:

```txt
mobile/
  src/
    screens/
      auth/
      dashboard/
      applications/
      reminders/
      interviews/
      jobs/
        JobsSearchScreen.tsx
        JobDetailsScreen.tsx
        SavedJobsScreen.tsx
      matches/
        MatchedJobsScreen.tsx
        MatchDetailsScreen.tsx
      resume/
        ResumeOverviewScreen.tsx
        ResumeReviewSummaryScreen.tsx
        ResumeReviewHistoryScreen.tsx
      alerts/
        JobAlertPreferencesScreen.tsx
        JobAlertsScreen.tsx
      account/
        PlanStatusScreen.tsx
        CalendarStatusScreen.tsx
        ExtensionOnboardingScreen.tsx
    navigation/
      RootNavigator.tsx
      AppTabs.tsx
      JobsNavigator.tsx
      MatchesNavigator.tsx
      TrackNavigator.tsx
      ProfileNavigator.tsx
    services/
      api.ts
      auth.service.ts
      jobs.service.ts
      saved-jobs.service.ts
      matches.service.ts
      resume.service.ts
      alerts.service.ts
      subscription.service.ts
      calendar.service.ts
    hooks/
      useJobs.ts
      useSavedJobs.ts
      useMatchedJobs.ts
      useResumeSummary.ts
      useJobAlerts.ts
      useSubscription.ts
    components/
      jobs/
        JobCard.tsx
        JobFilters.tsx
        SaveJobButton.tsx
      matches/
        MatchScoreCard.tsx
        SkillGapList.tsx
      resume/
        ResumeScoreCard.tsx
        ResumeSummaryCard.tsx
      billing/
        PlanBadge.tsx
        FeatureLockedState.tsx
      common/
        EmptyState.tsx
        LoadingState.tsx
        ErrorState.tsx
    types/
      job.ts
      saved-job.ts
      match.ts
      resume.ts
      subscription.ts
      alert.ts
```

---

## 16. Implementation Plan

V2 mobile should be implemented in slices. Do not build all UI screens first and then integrate later.

Correct approach:

```txt
Backend contract → mobile UI → integration → test → next slice
```

The backend should lead slightly, but mobile should follow immediately so API shapes are validated by real user flows.

---

## 16.1 Phase 0: V2 Mobile Preparation

### Goal

Prepare the mobile app architecture for V2 modules.

### Tasks

1. Review existing mobile navigation.
2. Decide final bottom tab structure.
3. Add Jobs, Matches, and Profile sub-navigation.
4. Add shared API response types for V2 modules.
5. Add or standardize TanStack Query if not already used.
6. Add reusable loading, empty, and error states.
7. Add shared feature-locked UI component.
8. Add plan/beta badge component.
9. Confirm environment variables:

```txt
EXPO_PUBLIC_API_URL
EXPO_PUBLIC_WEB_APP_URL
```

### Deliverables

- Updated navigation shell
- V2 folder structure
- Shared API service pattern
- Shared UI states

### Acceptance criteria

- App still supports all V1 mobile flows
- Existing auth/session behavior remains stable
- V2 tabs/screens can be added without breaking V1

---

## 16.2 Phase 1: Mobile Summary and Plan Awareness

### Goal

Give mobile a V2-aware home screen and basic SaaS/beta awareness.

### Backend dependency

```txt
GET /mobile/summary
GET /subscriptions/me
GET /entitlements/me
```

### Screens/components

```txt
HomeScreen update
PlanBadge
FeatureLockedState
PlanStatusScreen
```

### Tasks

1. Integrate mobile summary endpoint.
2. Display new matched job count.
3. Display resume/profile readiness.
4. Display plan/beta badge.
5. Display upcoming reminders/interviews as before.
6. Add plan status screen under Profile.
7. Add locked feature display pattern.

### Deliverables

- V2-aware home screen
- Plan/beta status visibility
- Entitlement-aware UI foundation

### Acceptance criteria

- User can see current plan/beta status
- Home screen shows resume and match readiness
- Locked states display consistently

---

## 16.3 Phase 2: Jobs Search and Job Details

### Goal

Allow mobile users to search and view aggregated jobs.

### Backend dependency

```txt
GET /jobs
GET /jobs/:id
```

### Screens/components

```txt
JobsSearchScreen
JobDetailsScreen
JobCard
JobFilters
```

### Tasks

1. Build Jobs tab.
2. Add search input.
3. Add filters for location, work mode, source, and experience level.
4. Fetch jobs from backend.
5. Render job cards.
6. Add pagination/infinite scrolling if backend supports it.
7. Build job details screen.
8. Add external apply link handling.
9. Add loading, empty, and error states.

### Deliverables

- User can browse/search jobs on mobile
- User can open job details
- User can open external apply URL

### Acceptance criteria

- Jobs come from backend only
- Search/filter state is usable on mobile
- Job cards are readable and fast
- External links work safely

---

## 16.4 Phase 3: Saved Jobs and Convert to Application

### Goal

Connect job discovery to the existing V1 application tracker.

### Backend dependency

```txt
POST /saved-jobs
GET /saved-jobs
DELETE /saved-jobs/:id
POST /saved-jobs/:id/convert-to-application
```

### Screens/components

```txt
SavedJobsScreen
SaveJobButton
ConvertSavedJobToApplication flow
```

### Tasks

1. Add Save Job button to job cards and job details.
2. Add saved state to jobs.
3. Build Saved Jobs screen.
4. Add convert-to-application action.
5. Confirm converted application appears in Applications tab.
6. Add duplicate-save handling.
7. Add success/error feedback.

### Deliverables

- User can save jobs
- User can view saved jobs
- User can convert saved jobs to tracked applications

### Acceptance criteria

- Saved jobs persist across web and mobile
- Converted jobs appear in application tracker
- Duplicate save attempts are handled cleanly

---

## 16.5 Phase 4: Resume Overview and Review Summary

### Goal

Expose resume intelligence on mobile without turning mobile into the full resume editor.

### Backend dependency

```txt
GET /resumes/active
GET /candidate-profile/me
GET /resume-reviews
GET /resume-reviews/:id
```

### Screens/components

```txt
ResumeOverviewScreen
ResumeReviewHistoryScreen
ResumeReviewSummaryScreen
ResumeScoreCard
ResumeSummaryCard
```

### Tasks

1. Add Resume Overview under Profile.
2. Fetch active resume and candidate profile summary.
3. Show parsing/profile readiness.
4. Show top skills and target roles.
5. Show latest resume review score.
6. Build review history list.
7. Build review summary screen.
8. Add CTA to manage resume on web.

### Deliverables

- User can see resume/profile status
- User can see review summaries
- User can navigate to web for full editing

### Acceptance criteria

- Mobile does not duplicate full web resume editor
- AI review output is structured and readable
- Missing resume/profile state is handled clearly

---

## 16.6 Phase 5: AI Matched Jobs

### Goal

Show recommended jobs based on the user’s resume/candidate profile.

### Backend dependency

```txt
GET /job-matches
GET /job-matches/:id
POST /job-matches/:id/dismiss
POST /saved-jobs
```

### Screens/components

```txt
MatchedJobsScreen
MatchDetailsScreen
MatchScoreCard
SkillGapList
```

### Tasks

1. Add Matches tab.
2. Fetch recommended jobs/match results.
3. Render match cards.
4. Show overall score and reason.
5. Build match details screen.
6. Show matched skills and missing skills.
7. Add save/dismiss actions.
8. Add empty state for missing resume/profile.

### Deliverables

- User can view matched jobs
- User can understand why a job matched
- User can save or dismiss recommendations

### Acceptance criteria

- Matches are backend-generated
- Scores are not calculated locally
- Missing skills are displayed clearly
- User can save matched job into saved jobs

---

## 16.7 Phase 6: Job Alerts

### Goal

Allow users to configure and view job alerts.

### Backend dependency

```txt
GET /job-alerts/preferences
PATCH /job-alerts/preferences
GET /job-alerts
```

### Screens/components

```txt
JobAlertPreferencesScreen
JobAlertsScreen
```

### Tasks

1. Add Job Alerts section under Profile or Jobs.
2. Build preferences form.
3. Allow user to enable/disable alerts.
4. Display recent alerts or matched jobs from alert runs.
5. Add alert CTA from Home screen.
6. Prepare UI for push notifications, even if push is not implemented yet.

### Deliverables

- User can manage alert preferences
- User can view job alerts in-app

### Acceptance criteria

- Preferences save to backend
- Alerts reflect backend state
- App works even before native push notifications are implemented

---

## 16.8 Phase 7: Calendar Status and Sync Indicators

### Goal

Expose calendar integration status and synced interview/reminder state.

### Backend dependency

```txt
GET /calendar-integrations/me
GET /interviews
GET /reminders
```

### Screens/components

```txt
CalendarStatusScreen
SyncedBadge
```

### Tasks

1. Add Calendar Status under Profile.
2. Fetch integration status.
3. Show connected provider and last sync time.
4. Show synced badges on interviews/reminders if backend exposes sync status.
5. Add CTA to web calendar settings if setup is web-first.

### Deliverables

- User can see calendar connection status
- User can see synced state for relevant records

### Acceptance criteria

- Mobile does not own OAuth complexity unless explicitly implemented
- Calendar state matches backend

---

## 16.9 Phase 8: Browser Extension Onboarding

### Goal

Help users understand and install/connect the browser extension.

### Backend dependency

```txt
GET /extension/me
```

Optional:

```txt
GET /extension/install-link
```

### Screens/components

```txt
ExtensionOnboardingScreen
```

### Tasks

1. Add Browser Extension screen under Profile.
2. Explain save-from-browser flow.
3. Show install/setup link.
4. Show connected status if backend provides it.
5. Add FAQ-style notes for supported behavior.

### Deliverables

- User understands browser extension purpose
- User can access install/setup link

### Acceptance criteria

- Mobile does not imply scraping/automation beyond supported extension behavior
- User can navigate to web/Chrome extension page

---

## 16.10 Phase 9: Polish, Testing, and Release Preparation

### Goal

Stabilize V2 mobile before release.

### Tasks

1. Test all V1 flows still work.
2. Test all V2 flows against backend.
3. Add component/unit tests for core utilities.
4. Add integration tests for services/hooks where possible.
5. Add E2E/manual test checklist.
6. Test Android emulator.
7. Test iOS simulator.
8. Test physical device if available.
9. Test with slow network.
10. Test expired session behavior.
11. Test empty states for new users.
12. Test feature-locked states.
13. Test production API environment.

### Deliverables

- V2 mobile release candidate
- Updated README/mobile docs
- Test checklist completed

---

## 17. Testing Plan

Testing is a required deliverable, not optional.

## 17.1 Unit Tests

Test:

```txt
status formatting
match score formatting
subscription/entitlement helpers
URL validation/opening helpers
API response mapping
filter serialization
empty-state logic
```

## 17.2 Component Tests

Test components:

```txt
JobCard
MatchScoreCard
SkillGapList
ResumeScoreCard
PlanBadge
FeatureLockedState
EmptyState
ErrorState
```

## 17.3 Integration Tests

Test flows:

```txt
fetch jobs
save job
convert saved job to application
fetch matched jobs
fetch resume overview
update alert preferences
fetch plan status
```

Mock API responses where needed.

## 17.4 Manual QA Checklist

### Auth regression

```txt
Can log in
Can log out
Expired token redirects/clears session
Invalid token handled cleanly
```

### Jobs

```txt
Can search jobs
Can filter jobs
Can open job details
Can save job
Can open external apply URL
```

### Saved jobs

```txt
Can view saved jobs
Can convert saved job to application
Converted application appears in tracker
```

### Matches

```txt
Can view matched jobs
Can open match details
Can save matched job
Can dismiss matched job if supported
Missing profile state is handled
```

### Resume

```txt
Can view active resume summary
Can view latest review score
Can view review history
Missing resume state is handled
```

### Alerts

```txt
Can view alert preferences
Can update preferences
Can disable alerts
Can view in-app alerts if available
```

### Plan/entitlements

```txt
Can see current plan
Locked features show correct state
Beta access displays correctly
```

### Calendar

```txt
Can view connection status
Synced badges display if available
Web setup CTA works
```

### Cross-client sync

```txt
Save job on mobile → appears on web
Convert job on mobile → appears in web applications
Update application on mobile → timeline updates on web
Change alert preferences on web → reflected on mobile
```

---

## 18. Performance Requirements

Mobile should feel fast.

Requirements:

```txt
Initial home load should avoid excessive API calls
Lists should paginate or lazy load
Large AI text should be collapsed/expandable
Images/logos should be optional and optimized
Do not fetch full job descriptions for every card if backend supports summary fields
Cache server state where safe
Show skeleton/loading states
```

Recommended:

```txt
Use compact list response for jobs and matches
Fetch full details only on detail screen
Use mobile summary endpoint for home
```

---

## 19. Error Handling Requirements

Mobile should show clean errors:

```txt
Could not load jobs. Try again.
Could not save this job.
Your session has expired. Please log in again.
Resume profile is required before viewing matches.
This feature is not available on your current plan.
Could not update alert preferences.
```

Do not show raw backend stack traces.

---

## 20. V2 Mobile Acceptance Criteria

V2 mobile is complete when:

```txt
Existing V1 mobile flows still work
User can search jobs
User can view job details
User can save jobs
User can view saved jobs
User can convert saved job into application
User can view matched jobs
User can view match score details
User can view resume/profile summary
User can view resume review summaries
User can configure job alert preferences
User can view plan/beta status
User sees feature-locked states where applicable
User can view calendar connection status
User can access browser extension onboarding
Mobile syncs correctly with web through backend
Tests/checklists are completed
```

---

## 21. Future Mobile Features After V2

Possible V3+ mobile features:

```txt
Push notifications for job alerts
Mobile resume upload
Mobile resume profile editing
AI cover letter summary
Mobile calendar OAuth connection
Offline saved jobs cache
Advanced notification center
Company/recruiter profiles
Team collaboration features if product expands
Lightweight admin metrics view only if truly needed
```

Do not add these until V2 is stable.

---

## 22. Final Implementation Guidance

The recommended build order is:

```txt
1. V2 navigation and structure
2. Mobile summary + plan awareness
3. Jobs search and job details
4. Saved jobs and convert-to-application
5. Resume overview and review summary
6. AI matched jobs
7. Job alerts
8. Calendar status
9. Browser extension onboarding
10. Testing and release prep
```

Do not build mobile admin.
Do not make mobile the billing control center.
Do not calculate AI scores locally.
Do not duplicate backend business logic.
Do not block V2 mobile on advanced push notifications.

The mobile app should remain a sharp, fast, user-facing companion that makes JobTrackr useful outside the web dashboard.
