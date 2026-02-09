
import { useState, useRef } from 'react';

interface UserProfileProps {
  darkMode: boolean;
  userData: { name: string; email: string; role: string; department: string };
}

const UserProfile = ({ darkMode, userData }: UserProfileProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(
    'https://readdy.ai/api/search-image?query=professional%20business%20person%20portrait%20headshot%20in%20office%20setting%20with%20neutral%20background%20corporate%20attire%20confident%20expression%20high%20quality%20photography%20studio%20lighting&width=200&height=200&seq=user-avatar-001&orientation=squarish'
  );

  const [formData, setFormData] = useState({
    name: userData.name,
    email: userData.email,
    phone: '+243 812 345 678',
    alternatePhone: '+243 899 123 456',
    employeeId: 'EMP-2024-001',
    department: userData.department,
    role: userData.role,
    joinDate: 'January 15, 2024',
    location: 'Lubumbashi, DRC',
    manager: 'Pierre Mutombo',
    emergencyContact: '+243 998 765 432',
    emergencyName: 'Marie Kabila',
    emergencyRelation: 'Spouse',
    bloodGroup: 'O+',
    address: '45 Avenue Kasavubu, Lubumbashi, Haut-Katanga, DRC',
    dateOfBirth: 'March 12, 1988',
    nationality: 'Congolese',
    gender: 'Male',
    maritalStatus: 'Married',
    bio: 'Experienced operations professional with over 8 years in the mining and metallurgy industry. Passionate about process optimization, safety compliance, and team leadership. Currently overseeing plant operations and driving efficiency improvements across production lines.',
    linkedin: 'linkedin.com/in/jean-mukendi',
    skype: 'jean.mukendi.rubamin',
    website: '',
  });

  const [skills] = useState([
    'Plant Operations', 'Process Optimization', 'Safety Compliance',
    'Team Leadership', 'Quality Control', 'Project Management',
    'Environmental Management', 'Risk Assessment',
  ]);

  const [languages] = useState([
    { name: 'French', level: 'Native' },
    { name: 'English', level: 'Fluent' },
    { name: 'Swahili', level: 'Fluent' },
    { name: 'Lingala', level: 'Conversational' },
  ]);

  const [showSaved, setShowSaved] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);

  const handleSave = () => {
    setIsEditing(false);
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 3000);
  };

  const handlePhotoUpload = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setProfilePhoto(e.target.result as string);
          setShowPhotoModal(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handlePhotoUpload(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handlePhotoUpload(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: 'ri-user-3-line' },
    { id: 'employment', label: 'Employment', icon: 'ri-briefcase-line' },
    { id: 'emergency', label: 'Emergency', icon: 'ri-heart-pulse-line' },
    { id: 'social', label: 'Social & Skills', icon: 'ri-links-line' },
  ];

  const personalFields = [
    { label: 'Full Name', key: 'name', editable: true, icon: 'ri-user-line' },
    { label: 'Email Address', key: 'email', editable: false, icon: 'ri-mail-line' },
    { label: 'Phone Number', key: 'phone', editable: true, icon: 'ri-phone-line' },
    { label: 'Alternate Phone', key: 'alternatePhone', editable: true, icon: 'ri-phone-line' },
    { label: 'Date of Birth', key: 'dateOfBirth', editable: true, icon: 'ri-calendar-line' },
    { label: 'Gender', key: 'gender', editable: false, icon: 'ri-genderless-line' },
    { label: 'Nationality', key: 'nationality', editable: false, icon: 'ri-flag-line' },
    { label: 'Marital Status', key: 'maritalStatus', editable: true, icon: 'ri-heart-line' },
    { label: 'Blood Group', key: 'bloodGroup', editable: true, icon: 'ri-drop-line' },
    { label: 'Address', key: 'address', editable: true, icon: 'ri-map-pin-line', fullWidth: true },
  ];

  const employmentFields = [
    { label: 'Employee ID', key: 'employeeId', editable: false, icon: 'ri-hashtag' },
    { label: 'Department', key: 'department', editable: false, icon: 'ri-building-line' },
    { label: 'Role / Position', key: 'role', editable: false, icon: 'ri-shield-user-line' },
    { label: 'Join Date', key: 'joinDate', editable: false, icon: 'ri-calendar-check-line' },
    { label: 'Work Location', key: 'location', editable: false, icon: 'ri-map-pin-2-line' },
    { label: 'Reporting Manager', key: 'manager', editable: false, icon: 'ri-user-star-line' },
  ];

  const emergencyFields = [
    { label: 'Contact Name', key: 'emergencyName', editable: true, icon: 'ri-user-heart-line' },
    { label: 'Relationship', key: 'emergencyRelation', editable: true, icon: 'ri-group-line' },
    { label: 'Contact Number', key: 'emergencyContact', editable: true, icon: 'ri-phone-line' },
  ];

  const renderField = (field: { label: string; key: string; editable: boolean; icon: string; fullWidth?: boolean }) => (
    <div key={field.key} className={field.fullWidth ? 'col-span-1 md:col-span-2' : ''}>
      <label className={`flex items-center gap-1.5 text-xs font-semibold mb-2 uppercase tracking-wider ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
        <i className={`${field.icon} text-sm`} />
        {field.label}
      </label>
      {isEditing && field.editable ? (
        field.fullWidth ? (
          <textarea
            value={formData[field.key as keyof typeof formData]}
            onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
            rows={2}
            className={`w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all resize-none ${
              darkMode
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                : 'bg-gray-50 border-gray-200 text-gray-900'
            }`}
          />
        ) : (
          <input
            type="text"
            value={formData[field.key as keyof typeof formData]}
            onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
            className={`w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all ${
              darkMode
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                : 'bg-gray-50 border-gray-200 text-gray-900'
            }`}
          />
        )
      ) : (
        <p className={`text-sm font-medium py-2.5 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
          {formData[field.key as keyof typeof formData] || '—'}
        </p>
      )}
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'Merriweather, serif' }}>
            My Profile
          </h1>
          <p className={`mt-2 text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Manage your personal and employment information</p>
        </div>
        <div className="flex items-center gap-3">
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors cursor-pointer whitespace-nowrap"
              >
                <i className="ri-save-line mr-1.5" />
                Save Changes
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors cursor-pointer whitespace-nowrap"
            >
              <i className="ri-edit-line mr-1.5" />
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Success Toast */}
      {showSaved && (
        <div className={`mb-6 p-4 rounded-lg border flex items-center gap-3 ${darkMode ? 'bg-green-600/10 border-green-600/30' : 'bg-green-50 border-green-200'}`}>
          <i className={`ri-check-double-line text-lg ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
          <p className={`text-sm font-medium ${darkMode ? 'text-green-400' : 'text-green-700'}`}>Profile updated successfully!</p>
        </div>
      )}

      {/* Profile Header Card */}
      <div className={`rounded-lg border mb-6 overflow-hidden ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        {/* Cover Banner */}
        <div className="h-32 bg-gradient-to-r from-red-700 via-red-600 to-red-800 relative">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.15\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
        </div>

        <div className="px-6 pb-6">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-5 -mt-12">
            {/* Profile Photo with Upload */}
            <div className="relative group">
              <div className="w-24 h-24 rounded-xl border-4 overflow-hidden shadow-lg flex-shrink-0" style={{ borderColor: darkMode ? '#1f2937' : '#ffffff' }}>
                <img
                  src={profilePhoto}
                  alt={userData.name}
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <button
                onClick={() => setShowPhotoModal(true)}
                className="absolute inset-0 rounded-xl bg-black/0 group-hover:bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer"
              >
                <i className="ri-camera-line text-white text-xl" />
              </button>
              <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-red-600 rounded-lg flex items-center justify-center shadow-md cursor-pointer hover:bg-red-700 transition-colors" onClick={() => setShowPhotoModal(true)}>
                <i className="ri-camera-line text-white text-xs" />
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1 pt-2 md:pt-0">
              <div className="flex flex-col md:flex-row md:items-center gap-3">
                <div>
                  <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{formData.name}</h2>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{formData.role} &bull; {formData.department}</p>
                </div>
                <div className="flex items-center gap-2 md:ml-auto">
                  <span className={`text-xs font-semibold px-3 py-1.5 rounded-md ${darkMode ? 'bg-green-600/20 text-green-400' : 'bg-green-50 text-green-600'}`}>
                    <i className="ri-checkbox-circle-line mr-1" />
                    Active
                  </span>
                  <span className={`text-xs font-medium px-3 py-1.5 rounded-md ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                    {formData.employeeId}
                  </span>
                </div>
              </div>
              {/* Quick Contact Row */}
              <div className={`flex flex-wrap items-center gap-4 mt-3 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <span className="flex items-center gap-1.5">
                  <i className="ri-mail-line" />
                  {formData.email}
                </span>
                <span className="flex items-center gap-1.5">
                  <i className="ri-phone-line" />
                  {formData.phone}
                </span>
                <span className="flex items-center gap-1.5">
                  <i className="ri-map-pin-line" />
                  {formData.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <i className="ri-calendar-line" />
                  Joined {formData.joinDate}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bio Section */}
      <div className={`rounded-lg p-6 border mb-6 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'Merriweather, serif' }}>
          <i className={`ri-quill-pen-line ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
          About Me
        </h3>
        {isEditing ? (
          <textarea
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            rows={4}
            maxLength={500}
            className={`w-full px-4 py-3 rounded-lg border text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all resize-none ${
              darkMode
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                : 'bg-gray-50 border-gray-200 text-gray-900'
            }`}
            placeholder="Write a short bio about yourself..."
          />
        ) : (
          <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {formData.bio || 'No bio added yet.'}
          </p>
        )}
      </div>

      {/* Tabs */}
      <div className={`flex items-center gap-1 p-1 rounded-lg mb-6 ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-red-600 text-white shadow-sm'
                : darkMode
                  ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white'
            }`}
          >
            <i className={`${tab.icon} text-base`} />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className={`rounded-lg p-6 border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        {activeTab === 'personal' && (
          <div>
            <h3 className={`text-lg font-bold mb-5 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'Merriweather, serif' }}>
              <i className={`ri-user-3-line ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {personalFields.map(renderField)}
            </div>
          </div>
        )}

        {activeTab === 'employment' && (
          <div>
            <h3 className={`text-lg font-bold mb-5 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'Merriweather, serif' }}>
              <i className={`ri-briefcase-line ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
              Employment Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {employmentFields.map(renderField)}
            </div>
          </div>
        )}

        {activeTab === 'emergency' && (
          <div>
            <h3 className={`text-lg font-bold mb-5 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'Merriweather, serif' }}>
              <i className={`ri-heart-pulse-line ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
              Emergency Contact
            </h3>
            <div className={`p-4 rounded-lg border mb-5 ${darkMode ? 'bg-yellow-600/10 border-yellow-600/20' : 'bg-yellow-50 border-yellow-200'}`}>
              <p className={`text-xs flex items-center gap-2 ${darkMode ? 'text-yellow-400' : 'text-yellow-700'}`}>
                <i className="ri-information-line" />
                This information will be used in case of an emergency. Please keep it up to date.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {emergencyFields.map(renderField)}
            </div>
          </div>
        )}

        {activeTab === 'social' && (
          <div className="space-y-8">
            {/* Social Links */}
            <div>
              <h3 className={`text-lg font-bold mb-5 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'Merriweather, serif' }}>
                <i className={`ri-links-line ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
                Social & Contact Links
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className={`flex items-center gap-1.5 text-xs font-semibold mb-2 uppercase tracking-wider ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    <i className="ri-linkedin-box-line text-sm" />
                    LinkedIn
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.linkedin}
                      onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                      placeholder="linkedin.com/in/username"
                      className={`w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all ${
                        darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-200 text-gray-900'
                      }`}
                    />
                  ) : (
                    <p className={`text-sm font-medium py-2.5 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                      {formData.linkedin || '—'}
                    </p>
                  )}
                </div>
                <div>
                  <label className={`flex items-center gap-1.5 text-xs font-semibold mb-2 uppercase tracking-wider ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    <i className="ri-skype-line text-sm" />
                    Skype
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.skype}
                      onChange={(e) => setFormData({ ...formData, skype: e.target.value })}
                      placeholder="skype username"
                      className={`w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all ${
                        darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-200 text-gray-900'
                      }`}
                    />
                  ) : (
                    <p className={`text-sm font-medium py-2.5 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                      {formData.skype || '—'}
                    </p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className={`flex items-center gap-1.5 text-xs font-semibold mb-2 uppercase tracking-wider ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    <i className="ri-global-line text-sm" />
                    Personal Website
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      placeholder="https://yourwebsite.com"
                      className={`w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all ${
                        darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-200 text-gray-900'
                      }`}
                    />
                  ) : (
                    <p className={`text-sm font-medium py-2.5 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                      {formData.website || '—'}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Skills & Expertise */}
            <div>
              <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'Merriweather, serif' }}>
                <i className={`ri-tools-line ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
                Skills &amp; Expertise
              </h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                      darkMode
                        ? 'bg-gray-700 text-gray-300 border border-gray-600'
                        : 'bg-gray-100 text-gray-700 border border-gray-200'
                    }`}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div>
              <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'Merriweather, serif' }}>
                <i className={`ri-translate-2 ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
                Languages
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {languages.map((lang, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center justify-between p-4 rounded-lg border ${
                      darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${darkMode ? 'bg-gray-600' : 'bg-white'}`}>
                        <i className={`ri-chat-3-line text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                      </div>
                      <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{lang.name}</span>
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${
                      lang.level === 'Native'
                        ? darkMode ? 'bg-red-600/20 text-red-400' : 'bg-red-50 text-red-600'
                        : lang.level === 'Fluent'
                          ? darkMode ? 'bg-green-600/20 text-green-400' : 'bg-green-50 text-green-600'
                          : darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {lang.level}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Photo Upload Modal */}
      {showPhotoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowPhotoModal(false)}>
          <div
            className={`w-full max-w-md mx-4 rounded-xl shadow-2xl border overflow-hidden ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className={`flex items-center justify-between px-6 py-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'Merriweather, serif' }}>
                Update Profile Photo
              </h3>
              <button
                onClick={() => setShowPhotoModal(false)}
                className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
              >
                <i className="ri-close-line text-lg" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {/* Current Photo Preview */}
              <div className="flex justify-center mb-6">
                <div className="w-28 h-28 rounded-xl overflow-hidden border-2 shadow-md" style={{ borderColor: darkMode ? '#374151' : '#e5e7eb' }}>
                  <img src={profilePhoto} alt="Current" className="w-full h-full object-cover object-top" />
                </div>
              </div>

              {/* Drop Zone */}
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
                  isDragging
                    ? 'border-red-500 bg-red-600/10'
                    : darkMode
                      ? 'border-gray-600 hover:border-gray-500 bg-gray-700/50'
                      : 'border-gray-300 hover:border-gray-400 bg-gray-50'
                }`}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className={`w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                  <i className={`ri-upload-cloud-2-line text-2xl ${isDragging ? 'text-red-500' : darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                </div>
                <p className={`text-sm font-medium mb-1 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  {isDragging ? 'Drop your photo here' : 'Drag & drop your photo here'}
                </p>
                <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  or click to browse &bull; JPG, PNG up to 5MB
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className={`flex items-center justify-end gap-3 px-6 py-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <button
                onClick={() => setShowPhotoModal(false)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
