import { useState } from 'react';
import { Link } from 'react-router-dom';

interface UpcomingDeadlinesProps {
  darkMode?: boolean;
}

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
}

const UpcomingDeadlines: React.FC<UpcomingDeadlinesProps> = ({
  darkMode = false,
}) => {
  const deadlines: Deadline[] = [
    {
      id: 1,
      title: 'Mining Equipment Tender',
      type: 'Tender',
      date: 'Jan 28, 2025',
      daysLeft: 3,
      priority: 'urgent',
      description: 'Procurement tender for heavy mining equipment including excavators and haul trucks.',
      assignedTo: 'Procurement Team',
      department: 'Procurement',
      details: ['Bid submission deadline', 'Technical evaluation pending', 'Budget: $2.5M allocated'],
    },
    {
      id: 2,
      title: 'Senior Geologist Application',
      type: 'Job',
      date: 'Jan 30, 2025',
      daysLeft: 5,
      priority: 'high',
      description: 'Job posting for Senior Geologist position closing soon. 45 applications received.',
      assignedTo: 'HR Department',
      department: 'Human Resources',
      details: ['45 applications received', 'Shortlisting in progress', 'Interview panel confirmed'],
    },
    {
      id: 3,
      title: 'Annual HSE Report Submission',
      type: 'Report',
      date: 'Feb 01, 2025',
      daysLeft: 7,
      priority: 'high',
      description: 'Annual Health, Safety & Environment report submission to regulatory authorities.',
      assignedTo: 'HSE Manager',
      department: 'HSE',
      details: ['Data collection 90% complete', 'Awaiting final incident statistics', 'Regulatory compliance required'],
    },
    {
      id: 4,
      title: 'Transport Services Tender',
      type: 'Tender',
      date: 'Feb 05, 2025',
      daysLeft: 11,
      priority: 'medium',
      description: 'Tender for transportation and logistics services for mining operations.',
      assignedTo: 'Logistics Team',
      department: 'Operations',
      details: ['Pre-qualification completed', '8 vendors shortlisted', 'Site visits scheduled'],
    },
    {
      id: 5,
      title: 'Electrical Engineer Position',
      type: 'Job',
      date: 'Feb 10, 2025',
      daysLeft: 16,
      priority: 'medium',
      description: 'Recruitment for Electrical Engineer to support plant maintenance operations.',
      assignedTo: 'HR Department',
      department: 'Human Resources',
      details: ['28 applications received', 'Technical test prepared', 'Salary range approved'],
    },
    {
      id: 6,
      title: 'Q4 Financial Report',
      type: 'Report',
      date: 'Feb 15, 2025',
      daysLeft: 21,
      priority: 'low',
      description: 'Quarterly financial report for Q4 2024 to be submitted to board of directors.',
      assignedTo: 'Finance Team',
      department: 'Finance',
      details: ['Revenue analysis complete', 'Expense reconciliation ongoing', 'Audit review scheduled'],
    },
    {
      id: 7,
      title: 'Safety Equipment Tender',
      type: 'Tender',
      date: 'Feb 18, 2025',
      daysLeft: 24,
      priority: 'medium',
      description: 'Procurement of personal protective equipment and safety gear for all departments.',
      assignedTo: 'HSE Team',
      department: 'HSE',
      details: ['Specifications finalized', 'Vendor list prepared', 'Budget: $150K approved'],
    },
    {
      id: 8,
      title: 'Environmental Impact Report',
      type: 'Report',
      date: 'Feb 20, 2025',
      daysLeft: 26,
      priority: 'high',
      description: 'Annual environmental impact assessment report for regulatory submission.',
      assignedTo: 'Environmental Team',
      department: 'Sustainability',
      details: ['Field surveys completed', 'Lab results pending', 'Stakeholder consultation done'],
    },
    {
      id: 9,
      title: 'Maintenance Technician Role',
      type: 'Job',
      date: 'Feb 25, 2025',
      daysLeft: 31,
      priority: 'low',
      description: 'Hiring maintenance technicians for plant equipment servicing.',
      assignedTo: 'HR Department',
      department: 'Human Resources',
      details: ['15 applications received', 'Skills assessment planned', 'Training program ready'],
    },
    {
      id: 10,
      title: 'Production Statistics Report',
      type: 'Report',
      date: 'Feb 28, 2025',
      daysLeft: 34,
      priority: 'medium',
      description: 'Monthly production statistics and performance metrics report.',
      assignedTo: 'Operations Team',
      department: 'Operations',
      details: ['Data collection ongoing', 'KPI dashboard updated', 'Comparison analysis pending'],
    },
  ];

  // State for filtering, pagination, and modal
  const [typeFilter, setTypeFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDeadline, setSelectedDeadline] = useState<Deadline | null>(null);
  const itemsPerPage = 4;

  const types = ['all', 'Tender', 'Job', 'Report'];
  const priorities = [
    { value: 'all', label: 'All Priorities' },
    { value: 'urgent', label: 'Urgent' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' },
  ];

  // Filter deadlines
  const filteredDeadlines = deadlines.filter(deadline => {
    const typeMatch = typeFilter === 'all' || deadline.type === typeFilter;
    const priorityMatch = priorityFilter === 'all' || deadline.priority === priorityFilter;
    return typeMatch && priorityMatch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredDeadlines.length / itemsPerPage);
  const paginatedDeadlines = filteredDeadlines.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset page when filters change
  const handleTypeFilterChange = (value: string) => {
    setTypeFilter(value);
    setCurrentPage(1);
  };

  const handlePriorityFilterChange = (value: string) => {
    setPriorityFilter(value);
    setCurrentPage(1);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Tender':
        return 'ri-auction-line';
      case 'Job':
        return 'ri-briefcase-line';
      case 'Report':
        return 'ri-file-chart-line';
      default:
        return 'ri-calendar-line';
    }
  };

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return darkMode
          ? 'text-red-400 bg-red-600/20'
          : 'text-red-600 bg-red-50';
      case 'high':
        return darkMode
          ? 'text-orange-400 bg-orange-500/20'
          : 'text-orange-600 bg-orange-50';
      case 'medium':
        return darkMode
          ? 'text-yellow-400 bg-yellow-500/20'
          : 'text-yellow-600 bg-yellow-50';
      default:
        return darkMode
          ? 'text-green-400 bg-green-500/20'
          : 'text-green-600 bg-green-50';
    }
  };

  const getTypeStyle = (type: string) => {
    switch (type) {
      case 'Tender':
        return darkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-50 text-blue-600';
      case 'Job':
        return darkMode ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-50 text-purple-600';
      case 'Report':
        return darkMode ? 'bg-teal-500/20 text-teal-400' : 'bg-teal-50 text-teal-600';
      default:
        return darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-100 text-gray-600';
    }
  };

  const urgentCount = deadlines.filter((d) => d.daysLeft <= 7).length;

  return (
    <>
      <div
        className={`rounded-lg p-6 border ${
          darkMode
            ? 'bg-gray-800 border-gray-700'
            : 'bg-white border-gray-200'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h2
              className={`text-lg font-bold ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}
              style={{ fontFamily: 'Merriweather, serif' }}
            >
              Upcoming Deadlines
            </h2>
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-md ${
                darkMode ? 'text-red-400 bg-red-600/20' : 'text-red-600 bg-red-50'
              }`}
            >
              {urgentCount} urgent
            </span>
          </div>
          <Link 
            to="/admin/dashboard/deadlines"
            className={`text-sm font-medium flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              darkMode 
                ? 'text-red-400 hover:bg-red-600/10' 
                : 'text-red-600 hover:bg-red-50'
            }`}
          >
            View All
            <i className="ri-arrow-right-line" />
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-4">
          <div className="relative">
            <select
              value={typeFilter}
              onChange={(e) => handleTypeFilterChange(e.target.value)}
              className={`appearance-none pl-3 pr-8 py-2 text-sm rounded-lg border cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-600 ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-gray-50 border-gray-200 text-gray-900'
              }`}
            >
              {types.map(type => (
                <option key={type} value={type}>
                  {type === 'all' ? 'All Types' : type}
                </option>
              ))}
            </select>
            <i className={`ri-arrow-down-s-line absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          </div>
          <div className="relative">
            <select
              value={priorityFilter}
              onChange={(e) => handlePriorityFilterChange(e.target.value)}
              className={`appearance-none pl-3 pr-8 py-2 text-sm rounded-lg border cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-600 ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-gray-50 border-gray-200 text-gray-900'
              }`}
            >
              {priorities.map(p => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
            <i className={`ri-arrow-down-s-line absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          </div>
          {(typeFilter !== 'all' || priorityFilter !== 'all') && (
            <button
              onClick={() => {
                setTypeFilter('all');
                setPriorityFilter('all');
                setCurrentPage(1);
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

        {/* Deadlines List */}
        <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
          {paginatedDeadlines.length > 0 ? (
            paginatedDeadlines.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedDeadline(item)}
                className={`flex items-center gap-4 p-3.5 rounded-lg border transition-all cursor-pointer group ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600 hover:border-gray-500'
                    : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                } ${
                  item.daysLeft <= 3
                    ? 'border-l-4 border-l-red-500'
                    : ''
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    darkMode ? 'bg-gray-600' : 'bg-white'
                  }`}
                >
                  <i
                    className={`${getTypeIcon(item.type)} text-lg ${
                      darkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-medium truncate ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    {item.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`text-xs ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}
                    >
                      {item.type}
                    </span>
                    <span
                      className={`text-xs ${
                        darkMode ? 'text-gray-600' : 'text-gray-300'
                      }`}
                    >
                      •
                    </span>
                    <span
                      className={`text-xs ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}
                    >
                      {item.date}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-md flex-shrink-0 whitespace-nowrap ${getPriorityStyle(
                      item.priority
                    )}`}
                  >
                    {item.daysLeft}d left
                  </span>
                  <i className={`ri-arrow-right-s-line opacity-0 group-hover:opacity-100 transition-opacity ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
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
        {filteredDeadlines.length > itemsPerPage && (
          <div className={`flex items-center justify-between mt-4 pt-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Showing {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, filteredDeadlines.length)} of {filteredDeadlines.length}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                  darkMode 
                    ? 'hover:bg-gray-700 text-gray-400' 
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                <i className="ri-arrow-left-s-line" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                    currentPage === page
                      ? 'bg-red-600 text-white'
                      : darkMode 
                        ? 'hover:bg-gray-700 text-gray-400' 
                        : 'hover:bg-gray-100 text-gray-600'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                  darkMode 
                    ? 'hover:bg-gray-700 text-gray-400' 
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                <i className="ri-arrow-right-s-line" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Deadline Details Modal */}
      {selectedDeadline && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setSelectedDeadline(null)}
        >
          <div 
            className={`w-full max-w-lg rounded-xl shadow-2xl overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className={`px-6 py-4 border-b flex items-center justify-between ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getTypeStyle(selectedDeadline.type)}`}>
                  <i className={`${getTypeIcon(selectedDeadline.type)} text-lg`} />
                </div>
                <div>
                  <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'Merriweather, serif' }}>
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
            <div className="px-6 py-5 space-y-5 max-h-[60vh] overflow-y-auto">
              {/* Type & Priority Badges */}
              <div className="flex items-center gap-2">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${getTypeStyle(selectedDeadline.type)}`}>
                  {selectedDeadline.type}
                </span>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-md capitalize ${getPriorityStyle(selectedDeadline.priority)}`}>
                  {selectedDeadline.priority} Priority
                </span>
              </div>

              {/* Title */}
              <div>
                <h4 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
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
                  Status & Details
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
              <div className={`grid grid-cols-2 gap-4 p-4 rounded-lg border ${darkMode ? 'bg-gray-700/30 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                <div>
                  <p className={`text-xs font-medium mb-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Assigned To</p>
                  <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {selectedDeadline.assignedTo}
                  </p>
                </div>
                <div>
                  <p className={`text-xs font-medium mb-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Department</p>
                  <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedDeadline.department}</p>
                </div>
                <div>
                  <p className={`text-xs font-medium mb-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Due Date</p>
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{selectedDeadline.date}</p>
                </div>
                <div>
                  <p className={`text-xs font-medium mb-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Time Left</p>
                  <p className={`text-sm font-semibold ${
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
            <div className={`px-6 py-4 border-t flex items-center justify-end gap-3 ${darkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50'}`}>
              <button
                onClick={() => setSelectedDeadline(null)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  darkMode 
                    ? 'text-gray-300 hover:bg-gray-700' 
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                Close
              </button>
              <button
                className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors cursor-pointer whitespace-nowrap"
              >
                <i className="ri-edit-line mr-1.5" />
                Edit Deadline
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UpcomingDeadlines;
