import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import RequireAuth from './components/layout/RequireAuth';
import { Role } from './types/enums';

import LoginPage from './pages/auth/LoginPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import Page404 from './pages/Page404';
import DashboardPage from './pages/DashboardPage';

import PatientListPage from './pages/patients/PatientListPage';
import PatientNewPage from './pages/patients/PatientNewPage';
import PatientDetailPage from './pages/patients/PatientDetailPage';

import CaseListPage from './pages/cases/CaseListPage';
import CaseKanbanPage from './pages/cases/CaseKanbanPage';
import CaseNewPage from './pages/cases/CaseNewPage';
import CaseDetailPage from './pages/cases/CaseDetailPage';

import AppointmentCalendarPage from './pages/appointments/AppointmentCalendarPage';
import AppointmentNewPage from './pages/appointments/AppointmentNewPage';

import StaffListPage from './pages/staff/StaffListPage';
import StaffDetailPage from './pages/staff/StaffDetailPage';
import OnboardingPage from './pages/admin/OnboardingPage';
import AppealsPage from './pages/admin/AppealsPage';

import ProgramListPage from './pages/programs/ProgramListPage';
import ProgramDetailPage from './pages/programs/ProgramDetailPage';

import WaveListPage from './pages/waves/WaveListPage';
import WaveDetailPage from './pages/waves/WaveDetailPage';

import ReviewQueuePage from './pages/reviews/ReviewQueuePage';
import ReviewSubmitPage from './pages/reviews/ReviewSubmitPage';

import ReportsPage from './pages/reports/ReportsPage';
import AdmissionListPage from './pages/admissions/AdmissionListPage';
import RoomListPage from './pages/rooms/RoomListPage';
import ClinicalNotesPage from './pages/notes/ClinicalNotesPage';
import PharmacyPage from './pages/pharmacy/PharmacyPage';
import PrescriptionsPage from './pages/pharmacy/PrescriptionsPage';
import LabPage from './pages/lab/LabPage';
import OrdersPage from './pages/lab/OrdersPage';
import BillingPage from './pages/billing/BillingPage';
import PaymentsPage from './pages/billing/PaymentsPage';

const ADMIN_ROLES = [Role.ADMIN, Role.DEPT_HEAD, Role.PROGRAM_MANAGER];

function App() {
  return (
    <Routes>
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />

      <Route
        element={
          <RequireAuth>
            <AppLayout />
          </RequireAuth>
        }
      >
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />

        <Route path="/patients" element={<PatientListPage />} />
        <Route path="/patients/new" element={<PatientNewPage />} />
        <Route path="/patients/:id" element={<PatientDetailPage />} />

        <Route path="/cases" element={<CaseListPage />} />
        <Route path="/cases/kanban" element={<CaseKanbanPage />} />
        <Route path="/cases/new" element={<CaseNewPage />} />
        <Route path="/cases/:id" element={<CaseDetailPage />} />

        <Route path="/appointments" element={<AppointmentCalendarPage />} />
        <Route path="/appointments/new" element={<AppointmentNewPage />} />
        <Route path="/admissions" element={<AdmissionListPage />} />
        <Route path="/rooms" element={<RoomListPage />} />
        <Route path="/clinical-notes" element={<ClinicalNotesPage />} />
        <Route path="/pharmacy/inventory" element={<PharmacyPage />} />
        <Route path="/pharmacy/prescriptions" element={<PrescriptionsPage />} />
        <Route path="/lab/tests" element={<LabPage />} />
        <Route path="/lab/orders" element={<OrdersPage />} />
        <Route path="/billing/invoices" element={<BillingPage />} />
        <Route path="/billing/payments" element={<PaymentsPage />} />

        <Route path="/staff" element={<StaffListPage />} />
        <Route path="/staff/:id" element={<StaffDetailPage />} />
        <Route
          path="/onboarding"
          element={
            <RequireAuth allowedRoles={ADMIN_ROLES}>
              <OnboardingPage />
            </RequireAuth>
          }
        />
        <Route
          path="/appeals"
          element={
            <RequireAuth allowedRoles={ADMIN_ROLES}>
              <AppealsPage />
            </RequireAuth>
          }
        />

        <Route path="/programs" element={<ProgramListPage />} />
        <Route path="/programs/:id" element={<ProgramDetailPage />} />

        <Route path="/waves" element={<WaveListPage />} />
        <Route path="/waves/:id" element={<WaveDetailPage />} />

        <Route path="/reviews" element={<ReviewQueuePage />} />
        <Route path="/reviews/submit/:caseId" element={<ReviewSubmitPage />} />

        <Route path="/reports" element={<ReportsPage />} />
      </Route>

      <Route path="*" element={<Page404 />} />
    </Routes>
  );
}

export default App;
