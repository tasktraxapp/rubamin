import { lazy } from 'react';
import { RouteObject, Navigate } from 'react-router-dom';
import { Suspense } from 'react';

const HomePage = lazy(() => import('../pages/home/page'));
const MediaPage = lazy(() => import('../pages/media/page'));
const JobsPage = lazy(() => import('../pages/jobs/page'));
const GalleryPage = lazy(() => import('../pages/gallery/page'));
const ResourcesPage = lazy(() => import('../pages/resources/page'));
const ContactPage = lazy(() => import('../pages/contact/page'));
const WebmailPage = lazy(() => import('../pages/webmail/page'));
const AdminLoginPage = lazy(() => import('../pages/admin/page'));
const AdminDashboard = lazy(() => import('../pages/admin/dashboard/page'));
const PagesManagement = lazy(() => import('../pages/admin/dashboard/pages/page'));
const PageEditor = lazy(() => import('../pages/admin/dashboard/pages/edit/page'));
const MediaCenterManagement = lazy(() => import('../pages/admin/dashboard/media-center/page'));
const JobsManagement = lazy(() => import('../pages/admin/dashboard/jobs/page'));
const GalleryManagement = lazy(() => import('../pages/admin/dashboard/gallery/page'));
const AdminGalleryPage = lazy(() => import('../pages/admin/dashboard/gallery/page'));
const ResourcesManagementPage = lazy(() => import('../pages/admin/dashboard/resources/page'));
const InquiriesManagement = lazy(() => import('../pages/admin/dashboard/inquiries/page'));
const SettingsPage = lazy(() => import('../pages/admin/dashboard/settings/page'));
const ProfilePage = lazy(() => import('../pages/admin/dashboard/profile/page'));
const AdminNotifications = lazy(() => import('../pages/admin/dashboard/notifications/page'));
const ActivityLogPage = lazy(() => import('../pages/admin/dashboard/activity-log/page'));
const DeadlinesManagementPage = lazy(() => import('../pages/admin/dashboard/deadlines/page'));
const TasksManagementPage = lazy(() => import('../pages/admin/dashboard/tasks/page'));
const NotFoundPage = lazy(() => import('../pages/NotFound'));

// Company sub-pages
const CorporateOverviewPage = lazy(() => import('../pages/company/corporate-overview/page'));
const VisionMissionPage = lazy(() => import('../pages/company/vision-mission/page'));
const ShareholdersPage = lazy(() => import('../pages/company/shareholders/page'));
const CoreTeamPage = lazy(() => import('../pages/company/core-team/page'));
const CorporateGovernancePage = lazy(() => import('../pages/company/corporate-governance/page'));

// Products sub-pages
const CopperBlisterPage = lazy(() => import('../pages/products/copper-blister/page'));
const IndustrialGasPage = lazy(() => import('../pages/products/industrial-gas/page'));
const MedicalGasPage = lazy(() => import('../pages/products/medical-gas/page'));

// Sustainability sub-pages
const HSEPage = lazy(() => import('../pages/sustainability/hse/page'));
const ESIAEMPPage = lazy(() => import('../pages/sustainability/esia-emp/page'));

// CSR sub-pages
const SocialInitiativesPage = lazy(() => import('../pages/csr/social-initiatives/page'));
const DOTPage = lazy(() => import('../pages/csr/dot/page'));

// Media sub-pages
const NoticesPage = lazy(() => import('../pages/media/notices/page'));
const TendersPage = lazy(() => import('../pages/media/tenders/page'));

// Gallery sub-pages
const FacilitiesPage = lazy(() => import('../pages/gallery/facilities/page'));
const TrainingsPage = lazy(() => import('../pages/gallery/trainings/page'));
const VisitsPage = lazy(() => import('../pages/gallery/visits/page'));

// Resources sub-pages
const StatisticsReportPage = lazy(() => import('../pages/resources/statistics-report/page'));
const FinancialsReportPage = lazy(() => import('../pages/resources/financials-report/page'));
const ContractsPage = lazy(() => import('../pages/resources/contracts/page'));
const ReportsPage = lazy(() => import('../pages/resources/reports/page'));
const PoliciesPage = lazy(() => import('../pages/resources/policies/page'));
const CertificationsPage = lazy(() => import('../pages/resources/certifications/page'));
const AffiliationsPage = lazy(() => import('../pages/resources/affiliations/page'));
const AwardsPage = lazy(() => import('../pages/resources/awards/page'));

// Auth pages
const LoginPage = lazy(() => import('../pages/auth/login/page'));
const RegisterPage = lazy(() => import('../pages/auth/register/page'));

// User dashboard
const UserDashboard = lazy(() => import('../pages/user/dashboard/page'));

// Loading component
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <i className="ri-loader-4-line text-4xl text-red-600 animate-spin mb-4 block" />
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Suspense fallback={<LoadingFallback />}><HomePage /></Suspense>,
  },
  {
    path: '/company/corporate-overview',
    element: <Suspense fallback={<LoadingFallback />}><CorporateOverviewPage /></Suspense>,
  },
  {
    path: '/company/vision-mission',
    element: <Suspense fallback={<LoadingFallback />}><VisionMissionPage /></Suspense>,
  },
  {
    path: '/company/shareholders',
    element: <Suspense fallback={<LoadingFallback />}><ShareholdersPage /></Suspense>,
  },
  {
    path: '/company/core-team',
    element: <Suspense fallback={<LoadingFallback />}><CoreTeamPage /></Suspense>,
  },
  {
    path: '/company/corporate-governance',
    element: <Suspense fallback={<LoadingFallback />}><CorporateGovernancePage /></Suspense>,
  },
  {
    path: '/products/copper-blister',
    element: <Suspense fallback={<LoadingFallback />}><CopperBlisterPage /></Suspense>,
  },
  {
    path: '/products/industrial-gas',
    element: <Suspense fallback={<LoadingFallback />}><IndustrialGasPage /></Suspense>,
  },
  {
    path: '/products/medical-gas',
    element: <Suspense fallback={<LoadingFallback />}><MedicalGasPage /></Suspense>,
  },
  {
    path: '/sustainability',
    element: <Navigate to="/sustainability/hse" replace />,
  },
  {
    path: '/sustainability/hse',
    element: <Suspense fallback={<LoadingFallback />}><HSEPage /></Suspense>,
  },
  {
    path: '/sustainability/esia-emp',
    element: <Suspense fallback={<LoadingFallback />}><ESIAEMPPage /></Suspense>,
  },
  {
    path: '/csr/social-initiatives',
    element: <Suspense fallback={<LoadingFallback />}><SocialInitiativesPage /></Suspense>,
  },
  {
    path: '/csr/dot',
    element: <Suspense fallback={<LoadingFallback />}><DOTPage /></Suspense>,
  },
  {
    path: '/media',
    element: <Suspense fallback={<LoadingFallback />}><MediaPage /></Suspense>,
  },
  {
    path: '/media/notices',
    element: <Suspense fallback={<LoadingFallback />}><NoticesPage /></Suspense>,
  },
  {
    path: '/media/tenders',
    element: <Suspense fallback={<LoadingFallback />}><TendersPage /></Suspense>,
  },
  {
    path: '/jobs',
    element: <Suspense fallback={<LoadingFallback />}><JobsPage /></Suspense>,
  },
  {
    path: '/webmail',
    element: <Suspense fallback={<LoadingFallback />}><WebmailPage /></Suspense>,
  },
  {
    path: '/admin',
    element: <Suspense fallback={<LoadingFallback />}><AdminLoginPage /></Suspense>,
  },
  {
    path: '/admin/dashboard',
    element: <Suspense fallback={<LoadingFallback />}><AdminDashboard /></Suspense>,
  },
  {
    path: '/admin/dashboard/pages',
    element: <Suspense fallback={<LoadingFallback />}><PagesManagement /></Suspense>,
  },
  {
    path: '/admin/dashboard/pages/new',
    element: <Suspense fallback={<LoadingFallback />}><PageEditor /></Suspense>,
  },
  {
    path: '/admin/dashboard/pages/edit/:id',
    element: <Suspense fallback={<LoadingFallback />}><PageEditor /></Suspense>,
  },
  {
    path: '/admin/dashboard/media-center',
    element: <Suspense fallback={<LoadingFallback />}><MediaCenterManagement /></Suspense>,
  },
  {
    path: '/admin/dashboard/jobs',
    element: <Suspense fallback={<LoadingFallback />}><JobsManagement /></Suspense>,
  },
  {
    path: '/admin/dashboard/gallery',
    element: <Suspense fallback={<LoadingFallback />}><GalleryManagement /></Suspense>,
  },
  {
    path: '/admin/dashboard/resources',
    element: <Suspense fallback={<LoadingFallback />}><ResourcesManagementPage /></Suspense>,
  },
  {
    path: '/admin/dashboard/inquiries',
    element: <Suspense fallback={<LoadingFallback />}><InquiriesManagement /></Suspense>,
  },
  {
    path: '/admin/dashboard/settings',
    element: <Suspense fallback={<LoadingFallback />}><SettingsPage /></Suspense>,
  },
  {
    path: '/admin/dashboard/profile',
    element: <Suspense fallback={<LoadingFallback />}><ProfilePage /></Suspense>,
  },
  {
    path: '/admin/dashboard/notifications',
    element: <Suspense fallback={<LoadingFallback />}><AdminNotifications /></Suspense>,
  },
  {
    path: '/admin/dashboard/activity-log',
    element: <Suspense fallback={<LoadingFallback />}><ActivityLogPage /></Suspense>,
  },
  {
    path: '/admin/dashboard/deadlines',
    element: <Suspense fallback={<LoadingFallback />}><DeadlinesManagementPage /></Suspense>,
  },
  {
    path: '/admin/dashboard/tasks',
    element: <Suspense fallback={<LoadingFallback />}><TasksManagementPage /></Suspense>,
  },
  {
    path: '/gallery',
    element: <Suspense fallback={<LoadingFallback />}><GalleryPage /></Suspense>,
  },
  {
    path: '/gallery/facilities',
    element: <Suspense fallback={<LoadingFallback />}><FacilitiesPage /></Suspense>,
  },
  {
    path: '/gallery/trainings',
    element: <Suspense fallback={<LoadingFallback />}><TrainingsPage /></Suspense>,
  },
  {
    path: '/gallery/visits',
    element: <Suspense fallback={<LoadingFallback />}><VisitsPage /></Suspense>,
  },
  {
    path: '/resources',
    element: <Suspense fallback={<LoadingFallback />}><ResourcesPage /></Suspense>,
  },
  {
    path: '/resources/statistics-report',
    element: <Suspense fallback={<LoadingFallback />}><StatisticsReportPage /></Suspense>,
  },
  {
    path: '/resources/financials-report',
    element: <Suspense fallback={<LoadingFallback />}><FinancialsReportPage /></Suspense>,
  },
  {
    path: '/resources/contracts',
    element: <Suspense fallback={<LoadingFallback />}><ContractsPage /></Suspense>,
  },
  {
    path: '/resources/reports',
    element: <Suspense fallback={<LoadingFallback />}><ReportsPage /></Suspense>,
  },
  {
    path: '/resources/policies',
    element: <Suspense fallback={<LoadingFallback />}><PoliciesPage /></Suspense>,
  },
  {
    path: '/resources/certifications',
    element: <Suspense fallback={<LoadingFallback />}><CertificationsPage /></Suspense>,
  },
  {
    path: '/resources/affiliations',
    element: <Suspense fallback={<LoadingFallback />}><AffiliationsPage /></Suspense>,
  },
  {
    path: '/resources/awards',
    element: <Suspense fallback={<LoadingFallback />}><AwardsPage /></Suspense>,
  },
  {
    path: '/contact',
    element: <Suspense fallback={<LoadingFallback />}><ContactPage /></Suspense>,
  },
  {
    path: '/auth/login',
    element: <Suspense fallback={<LoadingFallback />}><LoginPage /></Suspense>,
  },
  {
    path: '/auth/register',
    element: <Suspense fallback={<LoadingFallback />}><RegisterPage /></Suspense>,
  },
  {
    path: '/user/dashboard',
    element: <Suspense fallback={<LoadingFallback />}><UserDashboard /></Suspense>,
  },
  {
    path: '*',
    element: <Suspense fallback={<LoadingFallback />}><NotFoundPage /></Suspense>,
  },
];

export default routes;
