# Hospital Management System (HMS) - Product Requirements Document

## 1. Project Overview

### 1.1 Background
A comprehensive Hospital Management System built using Drips Wave architectural patterns and operational guidelines as the core design philosophy. The system adapts open-source collaboration paradigms (waves/cycles, maintainer-contributor roles, issue tracking with complexity scoring, two-way reviews) into a modern healthcare operations platform.

### 1.2 Core Concept Mapping (Drips Wave → Healthcare)
| Drips Wave Concept | Hospital Equivalent |
|---|---|
| Wave Program | Medical Department Program |
| Wave (Sprint Cycle) | Treatment Cycle / Appointment Scheduling Wave |
| Project Maintainer | Department Head / Senior Physician |
| Contributor | Doctor / Nurse / Medical Staff |
| Issue (Good First Issue / High Complexity) | Patient Case / Medical Task / Procedure |
| Complexity Level (Trivial/Medium/High) | Case Severity Classification |
| Points Reward System | Performance & Workload Points (PWP) |
| Contributor Application | Staff Task Assignment Request |
| Code Metrics Scorecard | Clinician Performance Dashboard |
| Two-Way Review System | Patient Feedback & Staff Peer Review |
| Issue Rollover | Unresolved Case Rollover to Next Cycle |
| Org/Repo Approval Workflow | Department & Credentialing Onboarding |
| Label-Based Workflow | Triage Tag System |

### 1.3 Target Users
- **System Administrators** (Wave Organizers): Full system access, program creation, approval workflows
- **Department Heads** (Maintainers): Manage staff, assign cases, review work, approve onboarding
- **Medical Staff** (Contributors): Doctors, nurses, technicians applying to work on cases
- **Patients**: View records, appointments, leave feedback on care received
- **Receptionists**: Registration, appointment booking, front-desk operations

---

## 2. Product Objectives

### 2.1 Primary Goals
1. **Cycle-Driven Operations**: Run hospital operations in structured waves (2-week default cycles) for predictable workload management
2. **Case Complexity Scoring**: Every patient case receives a severity/complexity rating with corresponding point values for fair workload distribution
3. **Transparent Assignment**: Medical staff apply to cases; department heads review performance metrics before assignment
4. **Feedback-Driven Quality**: Mandatory two-way review system (patient-clinician, senior-junior staff) within 14 days of case closure
5. **Automated Rollovers**: Unresolved cases automatically carry forward with history preserved

### 2.2 Success Metrics
- 95% of cases assigned within 48 hours of wave start
- Average review completion rate > 80% within 14-day window
- Case resolution rate improvement of 20% per quarter
- Staff workload balance variance < 15% across team members

---

## 3. System Modules & Feature Requirements

### 3.1 Authentication & Role-Based Access Control (RBAC)
#### User Roles & Permissions Matrix
| Feature | Admin | Dept Head | Doctor/Nurse | Receptionist | Patient |
|---|---|---|---|---|---|
| Create Programs | ✅ | ❌ | ❌ | ❌ | ❌ |
| Approve Department Onboarding | ✅ | ❌ | ❌ | ❌ | ❌ |
| Manage Staff Credentials | ✅ | ✅ | ❌ | ❌ | ❌ |
| Create & Wave Cycles | ✅ | ✅ | ❌ | ❌ | ❌ |
| Submit Cases to Program | ❌ | ✅ | ✅ | ✅ | ❌ |
| Assign Case Complexity | ❌ | ✅ | ❌ | ❌ | ❌ |
| Apply to Cases | ❌ | ❌ | ✅ | ❌ | ❌ |
| Accept Applications | ❌ | ✅ | ❌ | ❌ | ❌ |
| View Performance Metrics | ✅ | ✅ | Own Only | ❌ | ❌ |
| Submit Reviews | ✅ | ✅ | ✅ | ✅ | ✅ |
| Book Appointments | ❌ | ✅ | ✅ | ✅ | ✅ |
| Appeal Decisions | ❌ | ✅ | ✅ | ❌ | ✅ |

#### Authentication Features
- Email/password login with JWT tokens
- Session timeout after 30 minutes of inactivity
- Password reset flow with email link
- First-time credential setup for new staff

---

### 3.2 Dashboard Module
#### Admin Dashboard
- KPI overview: Active waves, total cases, staff utilization rate
- Program status cards with approval queues
- Recent appeal cases requiring review
- System-wide performance trend charts (last 6 waves)

#### Department Head Dashboard
- Pending case applications (badge count, priority ordered)
- Open PRs/Tasks requiring sign-off review
- Assigned-but-stale cases (no activity > 48hrs)
- Team workload heatmap by complexity level
- Staff performance ranking table with metrics

#### Clinician Dashboard
- Assigned active cases (with countdown to wave end)
- Open applications submitted (status tracker)
- Pending reviews to complete (14-day countdown)
- Personal performance metrics & points history
- Available cases to apply for (filtered by department/specialty)

---

### 3.3 Wave Cycles & Programs Module
#### Program Management
- Create medical department programs (Cardiology, Neurology, Pediatrics, etc.)
- Program description, specialty tags, and onboarding requirements
- Associate department(s) to a program
- Program lifecycle: Draft → Active → Archived

#### Wave Cycle Management
- Configure wave duration (default: 14 days, configurable 7-30 days)
- Wave status: Upcoming → Active → Closed → Archived
- Wave calendar with overlapping view of all departments
- Automated wave transition with notification blast
- Case carry-over logic: unresolved cases auto-roll with version history

---

### 3.4 Patient & Case Management Module
#### Patient Registration
- Demographics, contact, emergency contact
- Medical history, allergies, current medications
- Insurance & billing information
- Unique patient ID with QR code generation
- Search & filter with advanced queries

#### Case / Issue Management
- **Case Creation**: Receptionist or clinician creates a case from a patient visit
- **Complexity Assignment (by Dept Head)**:
  - **Trivial (100 pts)**: Prescription renewal, routine follow-up, minor wound dressing
  - **Medium (150 pts)**: Diagnostic workup, medication adjustment, standard procedure
  - **High (200 pts)**: Surgery, complex diagnosis, multi-specialty consult, critical care
- **Triage Tags (Label Workflow)**: Urgent, Routine, Follow-up, New Patient, Emergency
- **Case Status Pipeline**: Draft → Open in Program → Applications Received → Assigned → In Progress → Review → Resolved → Closed
- **Case Timeline**: Timestamped activity log of every state change, assignment, and note

#### Case Application & Assignment
- Clinicians browse available cases in their program
- Apply with optional cover note explaining qualification
- Dept Head views applicant metrics card before assignment
  - Total Resolved Cases, Case Resolution Rate, Average Review Score, Peer Rank
- One-click accept; other applications auto-marked "inactive"
- Explicit reject button with optional reason (visible to applicant)

---

### 3.5 Appointment Scheduling Module
- Calendar view with drag-and-drop rescheduling
- Resource conflict detection (double-booked doctor/room)
- Wave-aligned slots: Appointments assigned to current active wave
- Waiting list with auto-promotion on cancellation
- SMS/Email appointment reminders (24hrs + 1hr prior)
- Walk-in patient queue management

---

### 3.6 Staff & Clinician Management Module
#### Clinician Profile (Metrics Scorecard)
- Personal info, credentials, specialties, board certifications
- Performance metrics (sourced from case history):
  - Total Resolved Cases (lifetime + per wave)
  - Case Resolution Rate (%)
  - Average Time to Resolution (by complexity)
  - Average Patient Review Score (1-5 stars)
  - Average Peer Review Score (1-5 stars)
  - **OSS-style Activity Score**: Composite metric binned against all staff (Bottom 20%, Middle 60%, Top 20%)
- Workload points balance per wave cycle

#### Onboarding & Approval Workflow
- New staff submits profile + credentials
- Dept Head reviews and submits to Admin
- Admin approval → staff active in program
- **Rejection & Appeal**:
  - Initial rejection: applicant notified with reason
  - First appeal allowed after 14 days (require: training/certification updates)
  - Second appeal allowed after 30 days
  - Max 3 appeals total per applicant
  - All appeals handled in-app (no email bypass)

---

### 3.7 Two-Way Review System Module
#### Review Window: 14 days from case closure date
#### Review Submission (by role):
##### Dept Head → Clinician Review
- Overall Experience: Below expectations / Alright / Exceeded expectations (required)
- Star Ratings (1-5, optional):
  - Communication Quality (progress updates, question clarity)
  - Care Quality (clinical decisions, documentation)
  - Timeliness (responsiveness, deadline adherence)
  - Problem Solving (independent handling of complications)
- Free-form comment (≤5000 chars)

##### Clinician → Dept Head Review
- Overall Experience (required)
- Star Ratings:
  - Communication Quality (expectations, feedback, decisions)
  - Case Clarity (description, requirements, patient context)
  - Department Support (resources, staffing, tools)
  - Timeliness (review speed, query response)
- Free-form comment

##### Patient → Clinician & Care Team Review
- Overall Experience (required)
- Star Ratings:
  - Communication Quality
  - Care Outcome
  - Wait Time & Scheduling
  - Facility Cleanliness
- Free-form comment

#### Review Anonymity Rules
- Reviews are anonymous: recipients see aggregated summary after wave closes
- Department org members can view and resubmit org-level reviews
- Edits allowed until 14-day deadline; read-only thereafter

---

### 3.8 Reporting & Analytics Module
- Workload distribution report (by staff, by dept, by complexity)
- Case resolution cycle time analysis (average, p50, p95)
- Wave-over-wave performance trends
- Patient satisfaction score trends
- Staff utilization heatmaps
- Export to CSV/PDF with date range filters

---

### 3.9 Appeal System Module
- In-app appeal submission form for rejected onboarding
- Required field: "What training/improvements have been made since rejection?"
- Automatic cooldown timers:
  - 1st appeal: 14 days post-rejection
  - 2nd appeal: 30 days post-first-appeal rejection
  - Max 3 appeals per case/rejection
- Admin-only appeal review dashboard

---

## 4. User Interface & Experience

### 4.1 Design Direction: Clinical Precision with Warmth
- **Aesthetic**: Modern medical-industrial aesthetic — clean typography, generous white space, subtle geometric patterns, restrained accent colors
- **Color Palette**:
  - Primary: Deep teal/cyan (#0F766E) — clinical trustworthiness
  - Secondary: Warm amber (#F59E0B) — for urgent/high-complexity cases
  - Neutrals: Cool slate grays for structure
  - Status colors: Emerald (resolved), Sky (in progress), Rose (urgent)
- **Typography**:
  - Display/Headings: Fraunces or similar serif (authoritative, warm)
  - Body/UI: Plus Jakarta Sans (high legibility at small sizes)
- **Motion**: Staggered page-load reveals, subtle hover micro-interactions on cards, smooth status transitions
- **Background**: Subtle noise texture + gradient mesh overlays on dashboard hero zones
- **Shadows**: Layered elevation system (2-4 shadow levels) for card hierarchy

### 4.2 Navigation Structure
- Left sidebar: Role-contextual navigation with icons
- Top bar: Notifications (with badge), user menu, wave counter
- Breadcrumbs for deep pages
- Mobile: Collapsible drawer navigation

### 4.3 Key Interaction Patterns
- **Case Cards**: Hover reveals quick actions (apply, view details, tag)
- **Kanban Board**: Drag-and-drop case status updates
- **Metrics Cards**: On click, drill-down modal with trend sparkline
- **Timeline View**: Vertical timeline for case history
- **Modal Dialogs**: All forms (create case, submit review, appeal) use centered modal with overlay

---

## 5. Non-Functional Requirements

### 5.1 Performance
- Initial page load < 2s on broadband
- Dashboard render < 500ms
- Search query response < 200ms for < 10k records

### 5.2 Accessibility
- WCAG 2.1 AA compliant
- Keyboard navigation (Tab, Enter, Esc)
- Screen reader ARIA labels on all interactive elements
- Color contrast ratios > 4.5:1 for all body text

### 5.3 Data & Security
- All patient data tagged PHI (Protected Health Information)
- Role-scoped API responses (users only see their program's data)
- Audit trail of all data access and modifications
- Form validation: client-side + server-side redundant check

### 5.4 Browser Support
- Latest 2 versions of Chrome, Firefox, Safari, Edge
- Tablet responsive breakpoint (≥768px)
- Mobile responsive breakpoint (≥375px)

---

## 6. Acceptance Criteria

### 6.1 Core User Flows
1. **Case Lifecycle Flow**: Create case → assign complexity → add to wave → receive applications → assign clinician → clinician resolves → reviews submitted → wave closes → points awarded ✅
2. **Onboarding Appeal Flow**: Staff applies → rejected → wait 14 days → submit appeal (with improvements) → admin reviews → approved/rejected ✅
3. **Review Submission Flow**: Case closed → 14-day countdown starts → all parties submit reviews → deadline passes → reviews locked & aggregated ✅
4. **Wave Rollover Flow**: Wave closes → unresolved cases identified → auto-carried to next wave → version link preserved ✅

### 6.2 Module Completeness
- All modules specified in §3 have working CRUD + list + detail views
- All role permissions from §3.1 matrix enforced client-side + mocked API
- Two-way review system with proper anonymity & deadline enforcement
- Complexity-based points system correctly calculated on case resolution
