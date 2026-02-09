
import { useState } from 'react';

interface UserDocumentsProps {
  darkMode: boolean;
}

const UserDocuments = ({ darkMode }: UserDocumentsProps) => {
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [docPage, setDocPage] = useState(1);
  const docsPerPage = 6;

  const documents = [
    { id: 1, name: 'Employment Contract', category: 'hr', date: 'Jan 15, 2024', size: '1.2 MB', type: 'PDF', icon: 'ri-file-pdf-line', status: 'active' },
    { id: 2, name: 'HSE Safety Certificate', category: 'safety', date: 'Dec 10, 2024', size: '850 KB', type: 'PDF', icon: 'ri-file-pdf-line', status: 'active' },
    { id: 3, name: 'Q4 2024 Financial Report', category: 'finance', date: 'Jan 05, 2025', size: '2.4 MB', type: 'PDF', icon: 'ri-file-chart-line', status: 'new' },
    { id: 4, name: 'Annual Performance Review 2024', category: 'hr', date: 'Dec 20, 2024', size: '540 KB', type: 'DOCX', icon: 'ri-file-word-line', status: 'active' },
    { id: 5, name: 'Environmental Policy v3.2', category: 'policy', date: 'Nov 15, 2024', size: '1.8 MB', type: 'PDF', icon: 'ri-file-pdf-line', status: 'updated' },
    { id: 6, name: 'Training Completion - Module 3', category: 'training', date: 'Jan 10, 2025', size: '320 KB', type: 'PDF', icon: 'ri-file-pdf-line', status: 'new' },
    { id: 7, name: 'Leave Policy 2025', category: 'policy', date: 'Jan 01, 2025', size: '680 KB', type: 'PDF', icon: 'ri-file-pdf-line', status: 'active' },
    { id: 8, name: 'ISO 14001 Certificate', category: 'safety', date: 'Oct 22, 2024', size: '1.1 MB', type: 'PDF', icon: 'ri-award-line', status: 'active' },
    { id: 9, name: 'Payslip - December 2024', category: 'finance', date: 'Dec 28, 2024', size: '210 KB', type: 'PDF', icon: 'ri-file-pdf-line', status: 'active' },
    { id: 10, name: 'Emergency Procedures Manual', category: 'safety', date: 'Sep 05, 2024', size: '3.2 MB', type: 'PDF', icon: 'ri-file-pdf-line', status: 'active' },
    { id: 11, name: 'IT Security Guidelines', category: 'policy', date: 'Aug 18, 2024', size: '920 KB', type: 'PDF', icon: 'ri-shield-line', status: 'active' },
    { id: 12, name: 'Payslip - November 2024', category: 'finance', date: 'Nov 28, 2024', size: '205 KB', type: 'PDF', icon: 'ri-file-pdf-line', status: 'active' },
  ];

  const categories = [
    { value: 'all', label: 'All Documents' },
    { value: 'hr', label: 'HR' },
    { value: 'safety', label: 'Safety' },
    { value: 'finance', label: 'Finance' },
    { value: 'policy', label: 'Policies' },
    { value: 'training', label: 'Training' },
  ];

  const filtered = documents.filter(d => categoryFilter === 'all' || d.category === categoryFilter);
  const totalPages = Math.ceil(filtered.length / docsPerPage);
  const paginated = filtered.slice((docPage - 1) * docsPerPage, docPage * docsPerPage);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'Merriweather, serif' }}>
            My Documents
          </h1>
          <p className={`mt-2 text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Access and download your documents and certificates</p>
        </div>
        <span className={`text-xs font-semibold px-3 py-1.5 rounded-md ${darkMode ? 'text-gray-400 bg-gray-700' : 'text-gray-600 bg-gray-100'}`}>
          {filtered.length} documents
        </span>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map(cat => (
          <button
            key={cat.value}
            onClick={() => { setCategoryFilter(cat.value); setDocPage(1); }}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              categoryFilter === cat.value
                ? 'bg-red-600 text-white'
                : darkMode
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Documents List */}
      <div className={`rounded-lg border overflow-hidden ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className={`grid grid-cols-12 gap-4 px-6 py-3 text-xs font-semibold uppercase tracking-wider border-b ${
          darkMode ? 'bg-gray-700/50 border-gray-700 text-gray-400' : 'bg-gray-50 border-gray-200 text-gray-500'
        }`}>
          <div className="col-span-5">Document</div>
          <div className="col-span-2">Category</div>
          <div className="col-span-2">Date</div>
          <div className="col-span-1">Size</div>
          <div className="col-span-2 text-right">Action</div>
        </div>
        {paginated.map((doc) => (
          <div
            key={doc.id}
            className={`grid grid-cols-12 gap-4 px-6 py-4 items-center border-b last:border-b-0 transition-colors ${
              darkMode ? 'border-gray-700 hover:bg-gray-700/50' : 'border-gray-100 hover:bg-gray-50'
            }`}
          >
            <div className="col-span-5 flex items-center gap-3 min-w-0">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${darkMode ? 'bg-red-600/20' : 'bg-red-50'}`}>
                <i className={`${doc.icon} text-lg ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
              </div>
              <div className="min-w-0">
                <p className={`text-sm font-medium truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>{doc.name}</p>
                <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{doc.type}</p>
              </div>
              {doc.status === 'new' && (
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-red-600 text-white flex-shrink-0">NEW</span>
              )}
              {doc.status === 'updated' && (
                <span className={`text-xs font-bold px-2 py-0.5 rounded flex-shrink-0 ${darkMode ? 'bg-yellow-600/20 text-yellow-400' : 'bg-yellow-50 text-yellow-600'}`}>UPDATED</span>
              )}
            </div>
            <div className="col-span-2">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-md capitalize ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                {doc.category}
              </span>
            </div>
            <div className="col-span-2">
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{doc.date}</p>
            </div>
            <div className="col-span-1">
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{doc.size}</p>
            </div>
            <div className="col-span-2 flex items-center justify-end gap-2">
              <button className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
                darkMode ? 'hover:bg-gray-600 text-gray-400' : 'hover:bg-gray-200 text-gray-500'
              }`} title="View">
                <i className="ri-eye-line" />
              </button>
              <button className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
                darkMode ? 'hover:bg-gray-600 text-gray-400' : 'hover:bg-gray-200 text-gray-500'
              }`} title="Download">
                <i className="ri-download-line" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className={`flex items-center justify-between mt-4 pt-4`}>
          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Showing {((docPage - 1) * docsPerPage) + 1}-{Math.min(docPage * docsPerPage, filtered.length)} of {filtered.length}
          </p>
          <div className="flex items-center gap-1">
            <button onClick={() => setDocPage(p => Math.max(1, p - 1))} disabled={docPage === 1}
              className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-200 text-gray-500'}`}>
              <i className="ri-arrow-left-s-line" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button key={page} onClick={() => setDocPage(page)}
                className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  docPage === page ? 'bg-red-600 text-white' : darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-200 text-gray-600'
                }`}>
                {page}
              </button>
            ))}
            <button onClick={() => setDocPage(p => Math.min(totalPages, p + 1))} disabled={docPage === totalPages}
              className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-200 text-gray-600'}`}>
              <i className="ri-arrow-right-s-line" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDocuments;
