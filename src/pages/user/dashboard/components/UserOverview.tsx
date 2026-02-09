import { useState } from 'react';
import { Link } from 'react-router-dom';

interface UserOverviewProps {
  darkMode: boolean;
  userData: { name: string; email: string; role: string; department: string };
  onNavigate: (section: string) => void;
}

// Role-based permissions mapping
const ROLE_PERMISSIONS: Record<string, string[]> = {
  'Operations Manager': ['jobs', 'inquiries', 'resources'],
  'HSE Officer': ['media', 'resources', 'inquiries'],
  'Plant Supervisor': ['jobs', 'resources'],
  'Production Engineer': ['jobs', 'media'],
  'HR Manager': ['jobs', 'inquiries'],
  'Finance Officer': ['resources', 'inquiries'],
  'Maintenance Technician': ['resources'],
  'Quality Control Specialist': ['media', 'resources'],
};

const UserOverview = ({ darkMode, userData, onNavigate }: UserOverviewProps) => {
  // Get permissions for current user role
  const userPermissions = ROLE_PERMISSIONS[userData.role] || [];
  const hasPermission = (section: string) => userPermissions.includes(section);

  // Dynamic stats based on permissions
  const allStats = [
    { label: 'Active Jobs', value: '12', icon: 'ri-briefcase-line', change: '+3 this week', trend: 'up', section: 'jobs' },
    { label: 'Media Releases', value: '8', icon: 'ri-newspaper-line', change: '+2 pending', trend: 'up', section: 'media' },
    { label: 'Resources', value: '45', icon: 'ri-folder-line', change: '5 updated', trend: 'up', section: 'resources' },
    { label: 'Inquiries', value: '23', icon: 'ri-mail-line', change: '7 unread', trend: 'up', section: 'inquiries' },
  ];

  const stats = allStats.filter(stat => hasPermission(stat.section));

  // Dynamic quick actions based on permissions
  const allQuickActions = [
    { label: 'Post New Job', icon: 'ri-add-circle-line', section: 'jobs', permission: 'jobs' },
    { label: 'View Applications', icon: 'ri-file-user-line', section: 'jobs', permission: 'jobs' },
    { label: 'Upload Media', icon: 'ri-upload-2-line', section: 'media', permission: 'media' },
    { label: 'Manage Notices', icon: 'ri-megaphone-line', section: 'media', permission: 'media' },
    { label: 'Upload Resource', icon: 'ri-folder-add-line', section: 'resources', permission: 'resources' },
    { label: 'View Downloads', icon: 'ri-download-line', section: 'resources', permission: 'resources' },
    { label: 'Reply to Inquiries', icon: 'ri-reply-line', section: 'inquiries', permission: 'inquiries' },
    { label: 'View All Inquiries', icon: 'ri-mail-open-line', section: 'inquiries', permission: 'inquiries' },
  ];

  const quickActions = allQuickActions.filter(action => hasPermission(action.permission)).slice(0, 6);

  // Dynamic recent activities based on permissions
  const allRecentActivities = [
    { action: 'Published new job posting - Plant Operator', time: '2 hours ago', icon: 'ri-briefcase-line', type: 'submit', permission: 'jobs' },
    { action: 'Received 5 new applications for HSE Officer', time: '4 hours ago', icon: 'ri-file-user-line', type: 'complete', permission: 'jobs' },
    { action: 'Replied to inquiry from ABC Suppliers', time: '5 hours ago', icon: 'ri-mail-line', type: 'complete', permission: 'inquiries' },
    { action: 'Uploaded media release - Q4 Report', time: '1 day ago', icon: 'ri-newspaper-line', type: 'submit', permission: 'media' },
    { action: 'Updated Resources - Safety Manual v3.2', time: '2 days ago', icon: 'ri-folder-line', type: 'update', permission: 'resources' },
    { action: 'Published tender notice - Equipment Supply', time: '2 days ago', icon: 'ri-megaphone-line', type: 'submit', permission: 'media' },
    { action: 'Archived 5 expired job postings', time: '3 days ago', icon: 'ri-archive-line', type: 'view', permission: 'jobs' },
    { action: 'Uploaded Annual Report 2024', time: '4 days ago', icon: 'ri-file-chart-line', type: 'submit', permission: 'resources' },
  ];

  const recentActivities = allRecentActivities.filter(activity => hasPermission(activity.permission)).slice(0, 12);

  // Recent Activity filtering and pagination state
  const [activityTypeFilter, setActivityTypeFilter] = useState('all');
  const [activityPage, setActivityPage] = useState(1);
  const activitiesPerPage = 4;

  const activityTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'submit', label: 'Submitted' },
    { value: 'complete', label: 'Completed' },
    { value: 'update', label: 'Updated' },
    { value: 'view', label: 'Viewed' },
  ];

  const filteredActivities = recentActivities.filter(activity => {
    return activityTypeFilter === 'all' || activity.type === activityTypeFilter;
  });

  const totalActivityPages = Math.ceil(filteredActivities.length / activitiesPerPage);
  const paginatedActivities = filteredActivities.slice(
    (activityPage - 1) * activitiesPerPage,
    activityPage * activitiesPerPage
  );

  const handleActivityTypeFilterChange = (value: string) => {
    setActivityTypeFilter(value);
    setActivityPage(1);
  };

  // Dynamic upcoming deadlines based on permissions
  interface Deadline {
    id: number;
    title: string;
    type: string;
    date: string;
    daysLeft: number;
    priority: string;
    description: string;
    assignedTo: string;
    department: string;
    details: string[];
    permission: string;
  }

  const allDeadlines: Deadline[] = [
    { id: 1, title: 'Job Application Deadline - Plant Operator', type: 'Job', date: 'Jan 22, 2025', daysLeft: 2, priority: 'urgent', description: 'Application deadline for Plant Operator position closing soon.', assignedTo: 'HR Department', department: 'Human Resources', details: ['32 applications received', 'Shortlisting in progress', 'Interview panel confirmed'], permission: 'jobs' },
    { id: 2, title: 'Media Release Review - Q4 Report', type: 'Media', date: 'Jan 23, 2025', daysLeft: 3, priority: 'urgent', description: 'Review and approval of Q4 media release before publication.', assignedTo: 'Communications Team', department: 'Media', details: ['Draft completed', 'Awaiting final approval', 'Distribution list prepared'], permission: 'media' },
    { id: 3, title: 'Resource Audit - Safety Manual', type: 'Resource', date: 'Jan 28, 2025', daysLeft: 8, priority: 'high', description: 'Annual audit of safety manual and related documentation.', assignedTo: 'HSE Team', department: 'HSE', details: ['Previous version reviewed', 'Updates identified', 'Compliance check pending'], permission: 'resources' },
    { id: 4, title: 'Inquiry Response Deadline - ABC Suppliers', type: 'Inquiry', date: 'Feb 01, 2025', daysLeft: 12, priority: 'high', description: 'Deadline to respond to supplier inquiry regarding equipment procurement.', assignedTo: 'Procurement Team', department: 'Procurement', details: ['Quotation received', 'Technical evaluation done', 'Budget approval needed'], permission: 'inquiries' },
    { id: 5, title: 'Tender Submission Closes - Equipment Supply', type: 'Media', date: 'Feb 05, 2025', daysLeft: 16, priority: 'medium', description: 'Tender notice for equipment supply closing for submissions.', assignedTo: 'Procurement Team', department: 'Operations', details: ['12 vendors notified', 'Pre-qualification completed', 'Evaluation criteria set'], permission: 'media' },
    { id: 6, title: 'Quarterly Report Due - Annual Report 2024', type: 'Resource', date: 'Feb 10, 2025', daysLeft: 21, priority: 'medium', description: 'Submission of quarterly report and annual report compilation.', assignedTo: 'Finance Team', department: 'Finance', details: ['Data collection 85% complete', 'Charts and graphs prepared', 'Executive summary drafted'], permission: 'resources' },
    { id: 7, title: 'HSE Officer Position Closing', type: 'Job', date: 'Feb 12, 2025', daysLeft: 23, priority: 'medium', description: 'Recruitment for HSE Officer position nearing deadline.', assignedTo: 'HR Department', department: 'Human Resources', details: ['18 applications received', 'Skills assessment planned', 'Salary range approved'], permission: 'jobs' },
    { id: 8, title: 'Supplier Inquiry Follow-up', type: 'Inquiry', date: 'Feb 15, 2025', daysLeft: 26, priority: 'low', description: 'Follow-up on pending supplier inquiries for logistics services.', assignedTo: 'Logistics Team', department: 'Operations', details: ['3 inquiries pending', 'Vendor responses awaited', 'Comparison analysis needed'], permission: 'inquiries' },
    { id: 9, title: 'Press Release - Community Initiative', type: 'Media', date: 'Feb 18, 2025', daysLeft: 29, priority: 'low', description: 'Press release for upcoming community social initiative program.', assignedTo: 'CSR Team', department: 'CSR', details: ['Content drafted', 'Photos selected', 'Distribution scheduled'], permission: 'media' },
    { id: 10, title: 'Policy Document Update', type: 'Resource', date: 'Feb 20, 2025', daysLeft: 31, priority: 'low', description: 'Update company policy documents for regulatory compliance.', assignedTo: 'Legal Team', department: 'Legal', details: ['Review completed', 'Changes documented', 'Approval workflow started'], permission: 'resources' },
  ];

  const deadlines = allDeadlines.filter(d => hasPermission(d.permission));

  // Deadline filtering, pagination, and modal state
  const [deadlineTypeFilter, setDeadlineTypeFilter] = useState('all');
  const [deadlinePriorityFilter, setDeadlinePriorityFilter] = useState('all');
  const [deadlinePage, setDeadlinePage] = useState(1);
  const [selectedDeadline, setSelectedDeadline] = useState<Deadline | null>(null);
  const deadlinesPerPage = 4;

  const deadlineTypes = ['all', ...Array.from(new Set(deadlines.map(d => d.type)))];
  const deadlinePriorities = [
    { value: 'all', label: 'All Priorities' },
    { value: 'urgent', label: 'Urgent' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' },
  ];

  const filteredDeadlines = deadlines.filter(d => {
    const typeMatch = deadlineTypeFilter === 'all' || d.type === deadlineTypeFilter;
    const priorityMatch = deadlinePriorityFilter === 'all' || d.priority === deadlinePriorityFilter;
    return typeMatch && priorityMatch;
  });

  const totalDeadlinePages = Math.ceil(filteredDeadlines.length / deadlinesPerPage);
  const paginatedDeadlines = filteredDeadlines.slice(
    (deadlinePage - 1) * deadlinesPerPage,
    deadlinePage * deadlinesPerPage
  );

  const handleDeadlineTypeFilter = (value: string) => {
    setDeadlineTypeFilter(value);
    setDeadlinePage(1);
  };

  const handleDeadlinePriorityFilter = (value: string) => {
    setDeadlinePriorityFilter(value);
    setDeadlinePage(1);
  };

  const getDeadlineTypeIcon = (type: string) => {
    switch (type) {
      case 'Job': return 'ri-briefcase-line';
      case 'Media': return 'ri-newspaper-line';
      case 'Resource': return 'ri-folder-line';
      case 'Inquiry': return 'ri-mail-line';
      default: return 'ri-calendar-line';
    }
  };

  const getDeadlinePriorityStyle = (priority: string) => {
    switch (priority) {
      case 'urgent': return darkMode ? 'text-red-400 bg-red-600/20' : 'text-red-600 bg-red-50';
      case 'high': return darkMode ? 'text-orange-400 bg-orange-500/20' : 'text-orange-600 bg-orange-50';
      case 'medium': return darkMode ? 'text-yellow-400 bg-yellow-500/20' : 'text-yellow-600 bg-yellow-50';
      default: return darkMode ? 'text-green-400 bg-green-500/20' : 'text-green-600 bg-green-50';
    }
  };

  const getDeadlineTypeStyle = (type: string) => {
    switch (type) {
      case 'Job': return darkMode ? 'bg-teal-500/20 text-teal-400' : 'bg-teal-50 text-teal-600';
      case 'Media': return darkMode ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-50 text-amber-600';
      case 'Resource': return darkMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-50 text-emerald-600';
      case 'Inquiry': return darkMode ? 'bg-rose-500/20 text-rose-400' : 'bg-rose-50 text-rose-600';
      default: return darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-100 text-gray-600';
    }
  };

  const urgentDeadlineCount = deadlines.filter(d => d.daysLeft <= 7).length;

  // Tasks data based on permissions
  interface Task {
    id: number;
    title: string;
    status: 'pending' | 'in-progress' | 'completed';
    priority: string;
    dueDate: string;
    module: string;
    permission: string;
  }

  const allTasks: Task[] = [
    { id: 1, title: 'Review job applications for Plant Operator', status: 'in-progress', priority: 'high', dueDate: 'Jan 22, 2025', module: 'Jobs', permission: 'jobs' },
    { id: 2, title: 'Schedule interviews for HSE Officer candidates', status: 'pending', priority: 'urgent', dueDate: 'Jan 23, 2025', module: 'Jobs', permission: 'jobs' },
    { id: 3, title: 'Update safety manual documentation', status: 'in-progress', priority: 'high', dueDate: 'Jan 25, 2025', module: 'Resources', permission: 'resources' },
    { id: 4, title: 'Respond to ABC Suppliers inquiry', status: 'pending', priority: 'urgent', dueDate: 'Jan 21, 2025', module: 'Inquiries', permission: 'inquiries' },
    { id: 5, title: 'Prepare Q4 media release draft', status: 'completed', priority: 'medium', dueDate: 'Jan 20, 2025', module: 'Media', permission: 'media' },
    { id: 6, title: 'Upload annual report documents', status: 'pending', priority: 'medium', dueDate: 'Jan 28, 2025', module: 'Resources', permission: 'resources' },
    { id: 7, title: 'Review tender submissions', status: 'in-progress', priority: 'high', dueDate: 'Jan 30, 2025', module: 'Media', permission: 'media' },
    { id: 8, title: 'Follow up on pending inquiries', status: 'pending', priority: 'low', dueDate: 'Feb 01, 2025', module: 'Inquiries', permission: 'inquiries' },
    { id: 9, title: 'Archive expired job postings', status: 'completed', priority: 'low', dueDate: 'Jan 18, 2025', module: 'Jobs', permission: 'jobs' },
    { id: 10, title: 'Update policy documents', status: 'pending', priority: 'medium', dueDate: 'Feb 05, 2025', module: 'Resources', permission: 'resources' },
  ];

  const tasks = allTasks.filter(t => hasPermission(t.permission));

  // Task filtering and pagination state
  const [taskStatusFilter, setTaskStatusFilter] = useState('all');
  const [taskPage, setTaskPage] = useState(1);
  const tasksPerPage = 4;

  const taskStatuses = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
  ];

  const filteredTasks = tasks.filter(t => {
    return taskStatusFilter === 'all' || t.status === taskStatusFilter;
  });

  const totalTaskPages = Math.ceil(filteredTasks.length / tasksPerPage);
  const paginatedTasks = filteredTasks.slice(
    (taskPage - 1) * tasksPerPage,
    taskPage * tasksPerPage
  );

  const handleTaskStatusFilter = (value: string) => {
    setTaskStatusFilter(value);
    setTaskPage(1);
  };

  const getTaskStatusStyle = (status: string) => {
    switch (status) {
      case 'completed': return darkMode ? 'text-green-400 bg-green-600/20' : 'text-green-600 bg-green-50';
      case 'in-progress': return darkMode ? 'text-blue-400 bg-blue-500/20' : 'text-blue-600 bg-blue-50';
      default: return darkMode ? 'text-yellow-400 bg-yellow-500/20' : 'text-yellow-600 bg-yellow-50';
    }
  };

  const getTaskPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'urgent': return darkMode ? 'text-red-400 bg-red-600/20' : 'text-red-600 bg-red-50';
      case 'high': return darkMode ? 'text-orange-400 bg-orange-500/20' : 'text-orange-600 bg-orange-50';
      case 'medium': return darkMode ? 'text-yellow-400 bg-yellow-500/20' : 'text-yellow-600 bg-yellow-50';
      default: return darkMode ? 'text-green-400 bg-green-500/20' : 'text-green-600 bg-green-50';
    }
  };

  const getTaskModuleIcon = (module: string) => {
    switch (module) {
      case 'Jobs': return 'ri-briefcase-line';
      case 'Media': return 'ri-newspaper-line';
      case 'Resources': return 'ri-folder-line';
      case 'Inquiries': return 'ri-mail-line';
      default: return 'ri-task-line';
    }
  };

  const pendingTaskCount = tasks.filter(t => t.status === 'pending').length;
  const inProgressTaskCount = tasks.filter(t => t.status === 'in-progress').length;

  return (
    <div>
      {/* Welcome Section */}
      <div className="mb-6 sm:mb-8">
        <h1 className={`text-2xl sm:text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'Merriweather, serif' }}>
          Welcome back, {userData.name.split(' ')[0]}
        </h1>
        <p className={`mt-2 text-sm sm:text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {userData.role} • {userData.department} Department
        </p>
      </div>

      {/* Stats Grid */}
      <div className={`grid grid-cols-2 ${stats.length >= 4 ? 'lg:grid-cols-4' : stats.length === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-2'} gap-3 sm:gap-6 mb-6 sm:mb-8`}>
        {stats.map((stat, index) => (
          <div
            key={index}
            onClick={() => onNavigate(stat.section)}
            className={`rounded-lg p-4 sm:p-6 border hover:shadow-lg transition-all duration-300 cursor-pointer ${
              darkMode ? 'bg-gray-800 border-gray-700 hover:border-red-600' : 'bg-white border-gray-200 hover:border-red-600'
            }`}
          >
            <div className="flex items-start justify-between mb-3 sm:mb-4">
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center ${darkMode ? 'bg-red-600/20' : 'bg-red-50'}`}>
                <i className={`${stat.icon} text-base sm:text-lg ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
              </div>
              <span className={`text-xs font-semibold px-2 py-1 rounded-md hidden sm:inline-block ${
                stat.trend === 'up'
                  ? darkMode ? 'text-green-400 bg-green-500/20' : 'text-green-600 bg-green-50'
                  : darkMode ? 'text-gray-400 bg-gray-700' : 'text-gray-600 bg-gray-100'
              }`}>
                {stat.change}
              </span>
            </div>
            <h3 className={`text-2xl sm:text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'Merriweather, serif' }}>{stat.value}</h3>
            <p className={`text-sm mt-1 sm:mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* Quick Actions */}
        <div className={`rounded-lg p-4 sm:p-6 border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <h2 className={`text-base sm:text-lg font-bold mb-4 sm:mb-5 ${darkMode ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'Merriweather, serif' }}>
            Quick Actions
          </h2>
          <div className="space-y-2 sm:space-y-3">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => onNavigate(action.section)}
                className={`w-full flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg transition-all duration-300 cursor-pointer ${
                  darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center ${darkMode ? 'bg-red-600/20' : 'bg-red-50'}`}>
                  <i className={`${action.icon} text-base sm:text-lg ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
                </div>
                <span className={`text-xs sm:text-sm font-medium flex-1 text-left ${darkMode ? 'text-white' : 'text-gray-900'}`}>{action.label}</span>
                <i className={`ri-arrow-right-s-line hidden sm:block ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              </button>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className={`lg:col-span-2 rounded-lg p-4 sm:p-6 border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <h2 className={`text-base sm:text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'Merriweather, serif' }}>
              Recent Activity
            </h2>
            <span className={`text-xs font-semibold px-3 py-1.5 rounded-md self-start sm:self-auto ${darkMode ? 'text-gray-400 bg-gray-700' : 'text-gray-600 bg-gray-100'}`}>
              {filteredActivities.length} items
            </span>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 sm:gap-3 mb-4">
            <div className="relative flex-1 sm:flex-none min-w-[140px]">
              <select
                value={activityTypeFilter}
                onChange={(e) => handleActivityTypeFilterChange(e.target.value)}
                className={`w-full appearance-none pl-3 pr-8 py-2 text-sm rounded-lg border cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-600 ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-gray-50 border-gray-200 text-gray-900'
                }`}
              >
                {activityTypes.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
              <i className={`ri-arrow-down-s-line absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            </div>
            {activityTypeFilter !== 'all' && (
              <button
                onClick={() => {
                  setActivityTypeFilter('all');
                  setActivityPage(1);
                }}
                className={`text-sm px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                  darkMode
                    ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <i className="ri-close-line mr-1" />
                Clear
              </button>
            )}
          </div>

          {/* Activity List */}
          <div className="space-y-2 sm:space-y-3">
            {paginatedActivities.length > 0 ? (
              paginatedActivities.map((activity, index) => (
                <div
                  key={index}
                  className={`flex items-start sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg transition-all cursor-pointer border group ${
                    darkMode ? 'bg-gray-700 border-gray-600 hover:border-gray-500' : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    activity.type === 'complete'
                      ? darkMode ? 'bg-green-600/20' : 'bg-green-50'
                      : activity.type === 'submit'
                        ? darkMode ? 'bg-yellow-600/20' : 'bg-yellow-50'
                        : activity.type === 'update'
                          ? darkMode ? 'bg-red-600/20' : 'bg-red-50'
                          : darkMode ? 'bg-gray-600' : 'bg-gray-200'
                  }`}>
                    <i className={`${activity.icon} text-base sm:text-lg ${
                      activity.type === 'complete'
                        ? darkMode ? 'text-green-400' : 'text-green-600'
                        : activity.type === 'submit'
                          ? darkMode ? 'text-yellow-400' : 'text-yellow-600'
                          : activity.type === 'update'
                            ? darkMode ? 'text-red-400' : 'text-red-600'
                            : darkMode ? 'text-gray-300' : 'text-gray-600'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs sm:text-sm font-medium line-clamp-2 sm:line-clamp-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{activity.action}</p>
                    <p className={`text-xs mt-0.5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{activity.time}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-md capitalize hidden sm:inline-block ${
                      activity.type === 'complete'
                        ? darkMode ? 'bg-green-600/20 text-green-400' : 'bg-green-50 text-green-600'
                        : activity.type === 'submit'
                          ? darkMode ? 'bg-yellow-600/20 text-yellow-400' : 'bg-yellow-50 text-yellow-600'
                          : activity.type === 'update'
                            ? darkMode ? 'bg-red-600/20 text-red-400' : 'bg-red-50 text-red-600'
                            : darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {activity.type === 'complete' ? 'Completed' : activity.type === 'submit' ? 'Submitted' : activity.type === 'update' ? 'Updated' : 'Viewed'}
                    </span>
                    <i className={`ri-arrow-right-s-line opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  </div>
                </div>
              ))
            ) : (
              <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <i className="ri-inbox-line text-3xl mb-2" />
                <p className="text-sm">No activities match your filter</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {filteredActivities.length > activitiesPerPage && (
            <div className={`flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 pt-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Showing {((activityPage - 1) * activitiesPerPage) + 1}-{Math.min(activityPage * activitiesPerPage, filteredActivities.length)} of {filteredActivities.length}
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setActivityPage(p => Math.max(1, p - 1))}
                  disabled={activityPage === 1}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                    darkMode
                      ? 'hover:bg-gray-700 text-gray-400'
                      : 'hover:bg-gray-200 text-gray-500'
                  }`}
                >
                  <i className="ri-arrow-left-s-line" />
                </button>
                {Array.from({ length: totalActivityPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setActivityPage(page)}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                      activityPage === page
                        ? 'bg-red-600 text-white'
                        : darkMode
                          ? 'hover:bg-gray-700 text-gray-400'
                          : 'hover:bg-gray-200 text-gray-600'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setActivityPage(p => Math.min(totalActivityPages, p + 1))}
                  disabled={activityPage === totalActivityPages}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                    darkMode
                      ? 'hover:bg-gray-700 text-gray-400'
                      : 'hover:bg-gray-200 text-gray-500'
                  }`}
                >
                  <i className="ri-arrow-right-s-line" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tasks and Upcoming Deadlines - Two Column Layout */}
      {(tasks.length > 0 || deadlines.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Tasks Section */}
          {tasks.length > 0 && (
            <div className={`rounded-lg p-4 sm:p-6 border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 mb-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <h2 className={`text-base sm:text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'Merriweather, serif' }}>
                    Tasks
                  </h2>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-md ${darkMode ? 'text-yellow-400 bg-yellow-600/20' : 'text-yellow-600 bg-yellow-50'}`}>
                    {pendingTaskCount} pending
                  </span>
                </div>
                <span className={`text-xs font-semibold px-3 py-1.5 rounded-md self-start sm:self-auto ${darkMode ? 'text-gray-400 bg-gray-700' : 'text-gray-600 bg-gray-100'}`}>
                  {filteredTasks.length} items
                </span>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-2 sm:gap-3 mb-4">
                <div className="relative flex-1 sm:flex-none min-w-[120px]">
                  <select
                    value={taskStatusFilter}
                    onChange={(e) => handleTaskStatusFilter(e.target.value)}
                    className={`w-full appearance-none pl-3 pr-8 py-2 text-sm rounded-lg border cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-600 ${
                      darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
                    }`}
                  >
                    {taskStatuses.map(s => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                  <i className={`ri-arrow-down-s-line absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                </div>
                {taskStatusFilter !== 'all' && (
                  <button
                    onClick={() => {
                      setTaskStatusFilter('all');
                      setTaskPage(1);
                    }}
                    className={`text-sm px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                      darkMode ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <i className="ri-close-line mr-1" />
                    Clear
                  </button>
                )}
              </div>

              {/* Tasks List */}
              <div className="space-y-2 sm:space-y-3">
                {paginatedTasks.length > 0 ? (
                  paginatedTasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => onNavigate('tasks')}
                      className={`flex items-start sm:items-center gap-3 sm:gap-4 p-3 sm:p-3.5 rounded-lg border transition-all cursor-pointer group ${
                        darkMode ? 'bg-gray-700 border-gray-600 hover:border-gray-500' : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                      } ${task.priority === 'urgent' ? 'border-l-4 border-l-red-500' : ''}`}
                    >
                      <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${darkMode ? 'bg-gray-600' : 'bg-white'}`}>
                        <i className={`${getTaskModuleIcon(task.module)} text-base sm:text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs sm:text-sm font-medium line-clamp-2 sm:truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>{task.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{task.module}</span>
                          <span className={`text-xs hidden sm:inline ${darkMode ? 'text-gray-600' : 'text-gray-300'}`}>•</span>
                          <span className={`text-xs hidden sm:inline ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{task.dueDate}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-md whitespace-nowrap capitalize ${getTaskStatusStyle(task.status)}`}>
                          {task.status.replace('-', ' ')}
                        </span>
                        <i className={`ri-arrow-right-s-line opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <i className="ri-task-line text-3xl mb-2" />
                    <p className="text-sm">No tasks match your filters</p>
                  </div>
                )}
              </div>

              {/* Pagination */}
              {filteredTasks.length > tasksPerPage && (
                <div className={`flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 pt-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Showing {((taskPage - 1) * tasksPerPage) + 1}-{Math.min(taskPage * tasksPerPage, filteredTasks.length)} of {filteredTasks.length}
                  </p>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setTaskPage(p => Math.max(1, p - 1))}
                      disabled={taskPage === 1}
                      className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                        darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-200 text-gray-500'
                      }`}
                    >
                      <i className="ri-arrow-left-s-line" />
                    </button>
                    {Array.from({ length: totalTaskPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setTaskPage(page)}
                        className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                          taskPage === page
                            ? 'bg-red-600 text-white'
                            : darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-200 text-gray-600'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => setTaskPage(p => Math.min(totalTaskPages, p + 1))}
                      disabled={taskPage === totalTaskPages}
                      className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                        darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-200 text-gray-500'
                      }`}
                    >
                      <i className="ri-arrow-right-s-line" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Upcoming Deadlines */}
          {deadlines.length > 0 && (
            <div className={`rounded-lg p-4 sm:p-6 border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 mb-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <h2 className={`text-base sm:text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'Merriweather, serif' }}>
                    Upcoming Deadlines
                  </h2>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-md ${darkMode ? 'text-red-400 bg-red-600/20' : 'text-red-600 bg-red-50'}`}>
                    {urgentDeadlineCount} urgent
                  </span>
                </div>
                <span className={`text-xs font-semibold px-3 py-1.5 rounded-md self-start sm:self-auto ${darkMode ? 'text-gray-400 bg-gray-700' : 'text-gray-600 bg-gray-100'}`}>
                  {filteredDeadlines.length} items
                </span>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-2 sm:gap-3 mb-4">
                <div className="relative flex-1 sm:flex-none min-w-[100px]">
                  <select
                    value={deadlineTypeFilter}
                    onChange={(e) => handleDeadlineTypeFilter(e.target.value)}
                    className={`w-full appearance-none pl-3 pr-8 py-2 text-sm rounded-lg border cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-600 ${
                      darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
                    }`}
                  >
                    {deadlineTypes.map(type => (
                      <option key={type} value={type}>{type === 'all' ? 'All Types' : type}</option>
                    ))}
                  </select>
                  <i className={`ri-arrow-down-s-line absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                </div>
                <div className="relative flex-1 sm:flex-none min-w-[120px]">
                  <select
                    value={deadlinePriorityFilter}
                    onChange={(e) => handleDeadlinePriorityFilter(e.target.value)}
                    className={`w-full appearance-none pl-3 pr-8 py-2 text-sm rounded-lg border cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-600 ${
                      darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
                    }`}
                  >
                    {deadlinePriorities.map(p => (
                      <option key={p.value} value={p.value}>{p.label}</option>
                    ))}
                  </select>
                  <i className={`ri-arrow-down-s-line absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                </div>
                {(deadlineTypeFilter !== 'all' || deadlinePriorityFilter !== 'all') && (
                  <button
                    onClick={() => {
                      setDeadlineTypeFilter('all');
                      setDeadlinePriorityFilter('all');
                      setDeadlinePage(1);
                    }}
                    className={`text-sm px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                      darkMode ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <i className="ri-close-line mr-1" />
                    Clear
                  </button>
                )}
              </div>

              {/* Deadlines List */}
              <div className="space-y-2 sm:space-y-3">
                {paginatedDeadlines.length > 0 ? (
                  paginatedDeadlines.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setSelectedDeadline(item)}
                      className={`flex items-start sm:items-center gap-3 sm:gap-4 p-3 sm:p-3.5 rounded-lg border transition-all cursor-pointer group ${
                        darkMode ? 'bg-gray-700 border-gray-600 hover:border-gray-500' : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                      } ${item.daysLeft <= 3 ? 'border-l-4 border-l-red-500' : ''}`}
                    >
                      <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${darkMode ? 'bg-gray-600' : 'bg-white'}`}>
                        <i className={`${getDeadlineTypeIcon(item.type)} text-base sm:text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs sm:text-sm font-medium line-clamp-2 sm:truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>{item.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{item.type}</span>
                          <span className={`text-xs hidden sm:inline ${darkMode ? 'text-gray-600' : 'text-gray-300'}`}>•</span>
                          <span className={`text-xs hidden sm:inline ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{item.date}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-md whitespace-nowrap ${getDeadlinePriorityStyle(item.priority)}`}>
                          {item.daysLeft}d left
                        </span>
                        <i className={`ri-arrow-right-s-line opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <i className="ri-calendar-line text-3xl mb-2" />
                    <p className="text-sm">No deadlines match your filters</p>
                  </div>
                )}
              </div>

              {/* Pagination */}
              {filteredDeadlines.length > deadlinesPerPage && (
                <div className={`flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 pt-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Showing {((deadlinePage - 1) * deadlinesPerPage) + 1}-{Math.min(deadlinePage * deadlinesPerPage, filteredDeadlines.length)} of {filteredDeadlines.length}
                  </p>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setDeadlinePage(p => Math.max(1, p - 1))}
                      disabled={deadlinePage === 1}
                      className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                        darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-200 text-gray-500'
                      }`}
                    >
                      <i className="ri-arrow-left-s-line" />
                    </button>
                    {Array.from({ length: totalDeadlinePages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setDeadlinePage(page)}
                        className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                          deadlinePage === page
                            ? 'bg-red-600 text-white'
                            : darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-200 text-gray-600'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => setDeadlinePage(p => Math.min(totalDeadlinePages, p + 1))}
                      disabled={deadlinePage === totalDeadlinePages}
                      className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                        darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-200 text-gray-500'
                      }`}
                    >
                      <i className="ri-arrow-right-s-line" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Deadline Details Modal */}
      {selectedDeadline && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setSelectedDeadline(null)}
        >
          <div
            className={`w-full max-w-lg rounded-xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className={`px-4 sm:px-6 py-4 border-b flex items-center justify-between flex-shrink-0 ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getDeadlineTypeStyle(selectedDeadline.type)}`}>
                  <i className={`${getDeadlineTypeIcon(selectedDeadline.type)} text-lg`} />
                </div>
                <div>
                  <h3 className={`text-base sm:text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'Merriweather, serif' }}>
                    Deadline Details
                  </h3>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Due: {selectedDeadline.date}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedDeadline(null)}
                className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
                  darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-200 text-gray-500'
                }`}
              >
                <i className="ri-close-line text-xl" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-4 sm:px-6 py-5 space-y-5 overflow-y-auto flex-1">
              {/* Type & Priority Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${getDeadlineTypeStyle(selectedDeadline.type)}`}>
                  {selectedDeadline.type}
                </span>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-md capitalize ${getDeadlinePriorityStyle(selectedDeadline.priority)}`}>
                  {selectedDeadline.priority} Priority
                </span>
              </div>

              {/* Title */}
              <div>
                <h4 className={`text-lg sm:text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {selectedDeadline.title}
                </h4>
                <p className={`text-sm mt-1 flex items-center gap-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <i className="ri-time-line" />
                  {selectedDeadline.daysLeft} days remaining
                </p>
              </div>

              {/* Description */}
              <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {selectedDeadline.description}
                </p>
              </div>

              {/* Details List */}
              <div>
                <h5 className={`text-sm font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Status &amp; Details
                </h5>
                <ul className="space-y-2">
                  {selectedDeadline.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <i className={`ri-checkbox-circle-fill text-sm mt-0.5 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                      <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Meta Information */}
              <div className={`grid grid-cols-2 gap-3 sm:gap-4 p-4 rounded-lg border ${darkMode ? 'bg-gray-700/30 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                <div>
                  <p className={`text-xs font-medium mb-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Assigned To</p>
                  <p className={`text-xs sm:text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedDeadline.assignedTo}</p>
                </div>
                <div>
                  <p className={`text-xs font-medium mb-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Department</p>
                  <p className={`text-xs sm:text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedDeadline.department}</p>
                </div>
                <div>
                  <p className={`text-xs font-medium mb-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Due Date</p>
                  <p className={`text-xs sm:text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{selectedDeadline.date}</p>
                </div>
                <div>
                  <p className={`text-xs font-medium mb-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Time Left</p>
                  <p className={`text-xs sm:text-sm font-semibold ${
                    selectedDeadline.daysLeft <= 3
                      ? darkMode ? 'text-red-400' : 'text-red-600'
                      : selectedDeadline.daysLeft <= 7
                        ? darkMode ? 'text-orange-400' : 'text-orange-600'
                        : darkMode ? 'text-green-400' : 'text-green-600'
                  }`}>
                    {selectedDeadline.daysLeft} days
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className={`px-4 sm:px-6 py-4 border-t flex items-center justify-end gap-3 flex-shrink-0 ${darkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50'}`}>
              <button
                onClick={() => setSelectedDeadline(null)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserOverview;
