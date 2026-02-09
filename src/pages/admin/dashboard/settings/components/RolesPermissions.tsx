
import { useState } from 'react';

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Record<string, string[]>;
  userCount: number;
  color: string;
  isSystem?: boolean;
}

interface RolesPermissionsProps {
  darkMode: boolean;
}

const PERMISSION_SECTIONS = [
  { key: 'pages', label: 'Pages', icon: 'ri-file-list-3-line' },
  { key: 'media', label: 'Media Center', icon: 'ri-newspaper-line' },
  { key: 'jobs', label: 'Jobs', icon: 'ri-briefcase-line' },
  { key: 'gallery', label: 'Gallery', icon: 'ri-gallery-line' },
  { key: 'resources', label: 'Resources', icon: 'ri-folder-line' },
  { key: 'inquiries', label: 'Inquiries', icon: 'ri-mail-line' },
  { key: 'settings', label: 'Settings', icon: 'ri-settings-3-line' },
];

const PERMISSION_ACTIONS = [
  { key: 'view', label: 'View', icon: 'ri-eye-line' },
  { key: 'create', label: 'Create', icon: 'ri-add-circle-line' },
  { key: 'edit', label: 'Edit', icon: 'ri-edit-line' },
  { key: 'delete', label: 'Delete', icon: 'ri-delete-bin-line' },
];

const ROLE_COLORS = [
  { value: 'bg-red-600', label: 'Red', preview: 'bg-red-600' },
  { value: 'bg-emerald-600', label: 'Green', preview: 'bg-emerald-600' },
  { value: 'bg-amber-600', label: 'Amber', preview: 'bg-amber-600' },
  { value: 'bg-sky-600', label: 'Sky', preview: 'bg-sky-600' },
  { value: 'bg-violet-600', label: 'Violet', preview: 'bg-violet-600' },
  { value: 'bg-gray-600', label: 'Gray', preview: 'bg-gray-600' },
  { value: 'bg-rose-600', label: 'Rose', preview: 'bg-rose-600' },
  { value: 'bg-teal-600', label: 'Teal', preview: 'bg-teal-600' },
  { value: 'bg-orange-600', label: 'Orange', preview: 'bg-orange-600' },
  { value: 'bg-cyan-600', label: 'Cyan', preview: 'bg-cyan-600' },
];

const defaultRoles: Role[] = [
  {
    id: '1',
    name: 'Super Admin',
    description: 'Full access to everything including user management',
    permissions: {
      pages: ['view', 'create', 'edit', 'delete'],
      media: ['view', 'create', 'edit', 'delete'],
      jobs: ['view', 'create', 'edit', 'delete'],
      gallery: ['view', 'create', 'edit', 'delete'],
      resources: ['view', 'create', 'edit', 'delete'],
      inquiries: ['view', 'create', 'edit', 'delete'],
      settings: ['view', 'create', 'edit', 'delete'],
    },
    userCount: 1,
    color: 'bg-red-600',
    isSystem: true,
  },
  {
    id: '2',
    name: 'Content Manager',
    description: 'Manage pages, media center, resources, and gallery',
    permissions: {
      pages: ['view', 'create', 'edit', 'delete'],
      media: ['view', 'create', 'edit'],
      jobs: [],
      gallery: ['view', 'create', 'edit', 'delete'],
      resources: ['view', 'create', 'edit'],
      inquiries: ['view'],
      settings: [],
    },
    userCount: 1,
    color: 'bg-emerald-600',
  },
  {
    id: '3',
    name: 'HR Manager',
    description: 'Manage job postings and applications',
    permissions: {
      pages: [],
      media: [],
      jobs: ['view', 'create', 'edit', 'delete'],
      gallery: ['view'],
      resources: ['view'],
      inquiries: ['view'],
      settings: [],
    },
    userCount: 1,
    color: 'bg-amber-600',
  },
  {
    id: '4',
    name: 'Media Manager',
    description: 'Manage notices and tenders',
    permissions: {
      pages: [],
      media: ['view', 'create', 'edit', 'delete'],
      jobs: [],
      gallery: ['view', 'create'],
      resources: ['view'],
      inquiries: ['view'],
      settings: [],
    },
    userCount: 1,
    color: 'bg-sky-600',
  },
  {
    id: '5',
    name: 'Resource Manager',
    description: 'Manage resources, reports, and policies',
    permissions: {
      pages: [],
      media: ['view'],
      jobs: [],
      gallery: ['view'],
      resources: ['view', 'create', 'edit', 'delete'],
      inquiries: ['view'],
      settings: [],
    },
    userCount: 1,
    color: 'bg-violet-600',
  },
  {
    id: '6',
    name: 'Viewer',
    description: 'Read-only access to assigned sections',
    permissions: {
      pages: ['view'],
      media: ['view'],
      jobs: ['view'],
      gallery: ['view'],
      resources: ['view'],
      inquiries: ['view'],
      settings: [],
    },
    userCount: 1,
    color: 'bg-gray-600',
  },
];

const RolesPermissions = ({ darkMode }: RolesPermissionsProps) => {
  const [roles, setRoles] = useState<Role[]>(defaultRoles);
  const [viewMode, setViewMode] = useState<'cards' | 'matrix'>('cards');
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Role | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [expandedRole, setExpandedRole] = useState<string | null>(null);

  const [roleForm, setRoleForm] = useState<{
    name: string;
    description: string;
    color: string;
    permissions: Record<string, string[]>;
  }>({
    name: '',
    description: '',
    color: 'bg-emerald-600',
    permissions: {},
  });

  const toast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const openAddRole = () => {
    setEditingRole(null);
    setRoleForm({
      name: '',
      description: '',
      color: 'bg-emerald-600',
      permissions: PERMISSION_SECTIONS.reduce((acc, s) => ({ ...acc, [s.key]: [] }), {}),
    });
    setShowRoleModal(true);
  };

  const openEditRole = (role: Role) => {
    setEditingRole(role);
    setRoleForm({
      name: role.name,
      description: role.description,
      color: role.color,
      permissions: { ...role.permissions },
    });
    setShowRoleModal(true);
  };

  const handleSaveRole = () => {
    if (!roleForm.name.trim() || !roleForm.description.trim()) return;

    if (editingRole) {
      setRoles(roles.map(r =>
        r.id === editingRole.id
          ? { ...r, name: roleForm.name, description: roleForm.description, color: roleForm.color, permissions: roleForm.permissions }
          : r
      ));
      toast(`Role "${roleForm.name}" updated successfully`);
    } else {
      const newRole: Role = {
        id: Date.now().toString(),
        name: roleForm.name,
        description: roleForm.description,
        color: roleForm.color,
        permissions: roleForm.permissions,
        userCount: 0,
      };
      setRoles([...roles, newRole]);
      toast(`Role "${roleForm.name}" created successfully`);
    }
    setShowRoleModal(false);
  };

  const handleDeleteRole = () => {
    if (!deleteTarget) return;
    setRoles(roles.filter(r => r.id !== deleteTarget.id));
    toast(`Role "${deleteTarget.name}" deleted`);
    setShowDeleteConfirm(false);
    setDeleteTarget(null);
  };

  const togglePermission = (section: string, action: string) => {
    setRoleForm(prev => {
      const current = prev.permissions[section] || [];
      const updated = current.includes(action)
        ? current.filter(a => a !== action)
        : [...current, action];
      return { ...prev, permissions: { ...prev.permissions, [section]: updated } };
    });
  };

  const toggleAllSection = (section: string) => {
    setRoleForm(prev => {
      const current = prev.permissions[section] || [];
      const allActions = PERMISSION_ACTIONS.map(a => a.key);
      const hasAll = allActions.every(a => current.includes(a));
      return { ...prev, permissions: { ...prev.permissions, [section]: hasAll ? [] : [...allActions] } };
    });
  };

  const toggleAllForAction = (action: string) => {
    setRoleForm(prev => {
      const allHave = PERMISSION_SECTIONS.every(s => (prev.permissions[s.key] || []).includes(action));
      const updated = { ...prev.permissions };
      PERMISSION_SECTIONS.forEach(s => {
        const current = updated[s.key] || [];
        if (allHave) {
          updated[s.key] = current.filter(a => a !== action);
        } else if (!current.includes(action)) {
          updated[s.key] = [...current, action];
        }
      });
      return { ...prev, permissions: updated };
    });
  };

  const selectAllPermissions = () => {
    const allActions = PERMISSION_ACTIONS.map(a => a.key);
    const allPerms = PERMISSION_SECTIONS.reduce((acc, s) => ({ ...acc, [s.key]: [...allActions] }), {} as Record<string, string[]>);
    setRoleForm(prev => ({ ...prev, permissions: allPerms }));
  };

  const clearAllPermissions = () => {
    const emptyPerms = PERMISSION_SECTIONS.reduce((acc, s) => ({ ...acc, [s.key]: [] }), {} as Record<string, string[]>);
    setRoleForm(prev => ({ ...prev, permissions: emptyPerms }));
  };

  const getPermissionCount = (perms: Record<string, string[]>) => {
    return Object.values(perms).reduce((sum, arr) => sum + arr.length, 0);
  };

  const totalPermissions = PERMISSION_SECTIONS.length * PERMISSION_ACTIONS.length;

  return (
    <div>
      {/* Header Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`flex items-center rounded-lg border ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
            <button
              onClick={() => setViewMode('cards')}
              className={`flex items-center gap-2 px-4 py-2 rounded-l-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                viewMode === 'cards' ? 'bg-red-600 text-white' : darkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <i className="ri-layout-grid-line" />
              Cards
            </button>
            <button
              onClick={() => setViewMode('matrix')}
              className={`flex items-center gap-2 px-4 py-2 rounded-r-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                viewMode === 'matrix' ? 'bg-red-600 text-white' : darkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <i className="ri-table-line" />
              Matrix
            </button>
          </div>
          <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{roles.length} roles configured</span>
        </div>
        <button
          onClick={openAddRole}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg text-sm font-medium transition-all cursor-pointer whitespace-nowrap"
        >
          <i className="ri-add-line" />
          Add Role
        </button>
      </div>

      {/* Cards View */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {roles.map((role) => {
            const permCount = getPermissionCount(role.permissions);
            const isExpanded = expandedRole === role.id;
            return (
              <div
                key={role.id}
                className={`rounded-xl border transition-all ${
                  isExpanded ? 'ring-2 ring-red-600/30' : ''
                } ${darkMode ? 'bg-gray-800 border-gray-700 hover:border-gray-600' : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-md'}`}
              >
                {/* Card Header */}
                <div className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 rounded-lg flex items-center justify-center ${role.color}`}>
                        <i className="ri-shield-user-line text-xl text-white" />
                      </div>
                      <div>
                        <h3 className={`text-base font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{role.name}</h3>
                        <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                          {role.userCount} user{role.userCount !== 1 ? 's' : ''} &middot; {permCount}/{totalPermissions} permissions
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditRole(role)}
                        className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
                          darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                        }`}
                        title="Edit Role"
                      >
                        <i className="ri-edit-line text-sm" />
                      </button>
                      {!role.isSystem && (
                        <button
                          onClick={() => { setDeleteTarget(role); setShowDeleteConfirm(true); }}
                          className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
                            darkMode ? 'hover:bg-red-600/20 text-red-400' : 'hover:bg-red-50 text-red-500'
                          }`}
                          title="Delete Role"
                        >
                          <i className="ri-delete-bin-line text-sm" />
                        </button>
                      )}
                    </div>
                  </div>
                  <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{role.description}</p>

                  {/* Permission Progress */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Access Level</span>
                      <span className={`text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {Math.round((permCount / totalPermissions) * 100)}%
                      </span>
                    </div>
                    <div className={`w-full h-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                      <div
                        className={`h-2 rounded-full transition-all ${role.color}`}
                        style={{ width: `${(permCount / totalPermissions) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Quick Permission Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {PERMISSION_SECTIONS.filter(s => (role.permissions[s.key] || []).length > 0).slice(0, isExpanded ? undefined : 4).map(s => {
                      const actions = role.permissions[s.key] || [];
                      const hasAll = PERMISSION_ACTIONS.every(a => actions.includes(a.key));
                      return (
                        <span
                          key={s.key}
                          className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md ${
                            hasAll
                              ? darkMode ? 'bg-emerald-600/20 text-emerald-400' : 'bg-emerald-50 text-emerald-700'
                              : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          <i className={`${s.icon} text-[10px]`} />
                          {s.label}
                          {!hasAll && <span className="opacity-60">({actions.length})</span>}
                        </span>
                      );
                    })}
                    {!isExpanded && PERMISSION_SECTIONS.filter(s => (role.permissions[s.key] || []).length > 0).length > 4 && (
                      <span className={`text-xs px-2 py-1 rounded-md ${darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
                        +{PERMISSION_SECTIONS.filter(s => (role.permissions[s.key] || []).length > 0).length - 4} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Expand/Collapse */}
                <button
                  onClick={() => setExpandedRole(isExpanded ? null : role.id)}
                  className={`w-full flex items-center justify-center gap-2 py-2.5 text-xs font-medium border-t transition-colors cursor-pointer ${
                    darkMode ? 'border-gray-700 text-gray-400 hover:bg-gray-700/50 hover:text-gray-300' : 'border-gray-100 text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                  } rounded-b-xl`}
                >
                  <i className={`${isExpanded ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'}`} />
                  {isExpanded ? 'Hide Details' : 'View Details'}
                </button>

                {/* Expanded Permission Details */}
                {isExpanded && (
                  <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                    <div className="p-4 space-y-3">
                      {PERMISSION_SECTIONS.map(section => {
                        const actions = role.permissions[section.key] || [];
                        return (
                          <div key={section.key} className={`flex items-center justify-between py-2 px-3 rounded-lg ${darkMode ? 'bg-gray-700/30' : 'bg-gray-50'}`}>
                            <div className="flex items-center gap-2.5">
                              <i className={`${section.icon} text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                              <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{section.label}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {PERMISSION_ACTIONS.map(action => (
                                <span
                                  key={action.key}
                                  className={`w-7 h-7 flex items-center justify-center rounded-md text-xs ${
                                    actions.includes(action.key)
                                      ? 'bg-emerald-600 text-white'
                                      : darkMode ? 'bg-gray-600 text-gray-500' : 'bg-gray-200 text-gray-400'
                                  }`}
                                  title={`${action.label}: ${actions.includes(action.key) ? 'Allowed' : 'Denied'}`}
                                >
                                  <i className={`${action.icon}`} />
                                </span>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Add Role Card */}
          <button
            onClick={openAddRole}
            className={`rounded-xl border-2 border-dashed flex flex-col items-center justify-center min-h-[240px] transition-all cursor-pointer ${
              darkMode ? 'border-gray-600 hover:border-gray-500 hover:bg-gray-800/50' : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
            }`}
          >
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <i className={`ri-add-line text-xl ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            </div>
            <span className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Add New Role</span>
            <span className={`text-xs mt-1 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>Define custom permissions</span>
          </button>
        </div>
      )}

      {/* Matrix View */}
      {viewMode === 'matrix' && (
        <div className={`rounded-xl border overflow-hidden ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}>
                  <th className={`px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Section / Action
                  </th>
                  {roles.map(role => (
                    <th key={role.id} className="px-3 py-3.5 text-center min-w-[100px]">
                      <div className="flex flex-col items-center gap-1.5">
                        <div className={`w-8 h-8 rounded-md flex items-center justify-center ${role.color}`}>
                          <i className="ri-shield-user-line text-sm text-white" />
                        </div>
                        <span className={`text-xs font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{role.name}</span>
                        <button
                          onClick={() => openEditRole(role)}
                          className={`text-[10px] px-2 py-0.5 rounded cursor-pointer transition-colors ${
                            darkMode ? 'text-gray-500 hover:text-gray-300 hover:bg-gray-600' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          Edit
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-100'}`}>
                {PERMISSION_SECTIONS.map(section => (
                  <>
                    {/* Section Header Row */}
                    <tr key={`header-${section.key}`} className={darkMode ? 'bg-gray-700/20' : 'bg-gray-50/50'}>
                      <td className="px-5 py-2.5" colSpan={roles.length + 1}>
                        <div className="flex items-center gap-2">
                          <i className={`${section.icon} text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                          <span className={`text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{section.label}</span>
                        </div>
                      </td>
                    </tr>
                    {/* Action Rows */}
                    {PERMISSION_ACTIONS.map(action => (
                      <tr key={`${section.key}-${action.key}`} className={`${darkMode ? 'hover:bg-gray-700/30' : 'hover:bg-gray-50'} transition-colors`}>
                        <td className="px-5 py-2.5 pl-10">
                          <div className="flex items-center gap-2">
                            <i className={`${action.icon} text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                            <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{action.label}</span>
                          </div>
                        </td>
                        {roles.map(role => {
                          const hasPermission = (role.permissions[section.key] || []).includes(action.key);
                          return (
                            <td key={role.id} className="px-3 py-2.5 text-center">
                              <div className="flex items-center justify-center">
                                {hasPermission ? (
                                  <span className="w-7 h-7 flex items-center justify-center rounded-md bg-emerald-600 text-white">
                                    <i className="ri-check-line text-sm" />
                                  </span>
                                ) : (
                                  <span className={`w-7 h-7 flex items-center justify-center rounded-md ${darkMode ? 'bg-gray-700 text-gray-600' : 'bg-gray-100 text-gray-300'}`}>
                                    <i className="ri-close-line text-sm" />
                                  </span>
                                )}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </>
                ))}
              </tbody>
            </table>
          </div>
          {/* Matrix Legend */}
          <div className={`px-5 py-3 border-t flex items-center gap-5 ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-100 bg-gray-50/50'}`}>
            <span className={`text-xs font-medium ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Legend:</span>
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 flex items-center justify-center rounded bg-emerald-600 text-white"><i className="ri-check-line text-[10px]" /></span>
              <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Allowed</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`w-5 h-5 flex items-center justify-center rounded ${darkMode ? 'bg-gray-700 text-gray-600' : 'bg-gray-100 text-gray-300'}`}><i className="ri-close-line text-[10px]" /></span>
              <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Denied</span>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Role Modal */}
      {showRoleModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-2xl rounded-xl shadow-2xl max-h-[90vh] flex flex-col ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            {/* Modal Header */}
            <div className={`p-6 border-b flex-shrink-0 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${roleForm.color}`}>
                    <i className="ri-shield-user-line text-xl text-white" />
                  </div>
                  <div>
                    <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {editingRole ? 'Edit Role' : 'Create New Role'}
                    </h2>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {editingRole ? 'Modify role settings and permissions' : 'Define a new role with custom permissions'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowRoleModal(false)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
                    darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                  }`}
                >
                  <i className="ri-close-line text-xl" />
                </button>
              </div>
            </div>

            {/* Modal Body - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Role Name *</label>
                  <input
                    type="text"
                    value={roleForm.name}
                    onChange={(e) => setRoleForm({ ...roleForm, name: e.target.value })}
                    placeholder="e.g. Content Editor"
                    className={`w-full px-4 py-2.5 ${darkMode ? 'bg-gray-700 text-white placeholder-gray-400 border-gray-600' : 'bg-gray-50 text-gray-900 placeholder-gray-500 border-gray-200'} border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-600`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Color</label>
                  <div className="flex items-center gap-2 flex-wrap">
                    {ROLE_COLORS.map(c => (
                      <button
                        key={c.value}
                        onClick={() => setRoleForm({ ...roleForm, color: c.value })}
                        className={`w-8 h-8 rounded-lg ${c.preview} cursor-pointer transition-all ${
                          roleForm.color === c.value ? 'ring-2 ring-offset-2 ring-red-600 scale-110' : 'hover:scale-105'
                        } ${darkMode && roleForm.color === c.value ? 'ring-offset-gray-800' : ''}`}
                        title={c.label}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Description *</label>
                <textarea
                  value={roleForm.description}
                  onChange={(e) => setRoleForm({ ...roleForm, description: e.target.value.slice(0, 500) })}
                  placeholder="Describe what this role can do..."
                  rows={2}
                  maxLength={500}
                  className={`w-full px-4 py-2.5 ${darkMode ? 'bg-gray-700 text-white placeholder-gray-400 border-gray-600' : 'bg-gray-50 text-gray-900 placeholder-gray-500 border-gray-200'} border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-600 resize-none`}
                />
              </div>

              {/* Permissions Matrix */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <label className={`block text-sm font-bold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Permissions</label>
                    <p className={`text-xs mt-0.5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      {getPermissionCount(roleForm.permissions)}/{totalPermissions} permissions selected
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={selectAllPermissions}
                      className={`text-xs px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                        darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      Select All
                    </button>
                    <button
                      onClick={clearAllPermissions}
                      className={`text-xs px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                        darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      Clear All
                    </button>
                  </div>
                </div>

                <div className={`rounded-lg border overflow-hidden ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  {/* Table Header */}
                  <div className={`grid grid-cols-[1fr_repeat(4,64px)] items-center px-4 py-2.5 ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                    <span className={`text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Section</span>
                    {PERMISSION_ACTIONS.map(action => (
                      <button
                        key={action.key}
                        onClick={() => toggleAllForAction(action.key)}
                        className={`text-center text-xs font-semibold uppercase tracking-wider cursor-pointer transition-colors ${
                          darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
                        }`}
                        title={`Toggle all ${action.label}`}
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>

                  {/* Permission Rows */}
                  <div className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-100'}`}>
                    {PERMISSION_SECTIONS.map(section => {
                      const sectionPerms = roleForm.permissions[section.key] || [];
                      const allChecked = PERMISSION_ACTIONS.every(a => sectionPerms.includes(a.key));
                      return (
                        <div
                          key={section.key}
                          className={`grid grid-cols-[1fr_repeat(4,64px)] items-center px-4 py-3 transition-colors ${
                            darkMode ? 'hover:bg-gray-700/30' : 'hover:bg-gray-50'
                          }`}
                        >
                          <button
                            onClick={() => toggleAllSection(section.key)}
                            className="flex items-center gap-2.5 cursor-pointer group"
                          >
                            <div className={`w-8 h-8 rounded-md flex items-center justify-center transition-colors ${
                              allChecked
                                ? 'bg-emerald-600 text-white'
                                : sectionPerms.length > 0
                                ? darkMode ? 'bg-amber-600/20 text-amber-400' : 'bg-amber-50 text-amber-600'
                                : darkMode ? 'bg-gray-700 text-gray-500' : 'bg-gray-100 text-gray-400'
                            }`}>
                              <i className={`${section.icon} text-sm`} />
                            </div>
                            <div className="text-left">
                              <span className={`text-sm font-medium block ${darkMode ? 'text-gray-200 group-hover:text-white' : 'text-gray-700 group-hover:text-gray-900'}`}>
                                {section.label}
                              </span>
                              <span className={`text-[10px] ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                {sectionPerms.length}/{PERMISSION_ACTIONS.length} enabled
                              </span>
                            </div>
                          </button>
                          {PERMISSION_ACTIONS.map(action => {
                            const isChecked = sectionPerms.includes(action.key);
                            return (
                              <div key={action.key} className="flex items-center justify-center">
                                <button
                                  onClick={() => togglePermission(section.key, action.key)}
                                  className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                                    isChecked
                                      ? 'bg-emerald-600 text-white shadow-sm hover:bg-emerald-700'
                                      : darkMode
                                      ? 'bg-gray-700 text-gray-600 hover:bg-gray-600 hover:text-gray-400'
                                      : 'bg-gray-100 text-gray-300 hover:bg-gray-200 hover:text-gray-500'
                                  }`}
                                >
                                  <i className={`${isChecked ? 'ri-check-line' : 'ri-close-line'} text-sm`} />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className={`p-6 border-t flex-shrink-0 flex items-center justify-between ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                {getPermissionCount(roleForm.permissions)} of {totalPermissions} permissions selected
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowRoleModal(false)}
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                    darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveRole}
                  disabled={!roleForm.name.trim() || !roleForm.description.trim()}
                  className="px-5 py-2.5 bg-red-600 text-white hover:bg-red-700 rounded-lg text-sm font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {editingRole ? 'Save Changes' : 'Create Role'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && deleteTarget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-md rounded-xl shadow-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="p-6 text-center">
              <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${darkMode ? 'bg-red-600/20' : 'bg-red-50'}`}>
                <i className={`ri-delete-bin-line text-3xl ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
              </div>
              <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Delete Role?</h3>
              <p className={`text-sm mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Are you sure you want to delete <span className="font-semibold">{deleteTarget.name}</span>?
              </p>
              {deleteTarget.userCount > 0 && (
                <div className={`p-3 rounded-lg mb-4 ${darkMode ? 'bg-amber-600/10' : 'bg-amber-50'}`}>
                  <div className="flex items-start gap-2 justify-center">
                    <i className={`ri-alert-line text-sm mt-0.5 ${darkMode ? 'text-amber-400' : 'text-amber-600'}`} />
                    <p className={`text-xs ${darkMode ? 'text-amber-400' : 'text-amber-700'}`}>
                      {deleteTarget.userCount} user{deleteTarget.userCount > 1 ? 's' : ''} currently assigned to this role will need to be reassigned.
                    </p>
                  </div>
                </div>
              )}
              <div className="flex items-center justify-center gap-3 mt-6">
                <button
                  onClick={() => { setShowDeleteConfirm(false); setDeleteTarget(null); }}
                  className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                    darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteRole}
                  className="px-5 py-2.5 bg-red-600 text-white hover:bg-red-700 rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap"
                >
                  Delete Role
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      <div className={`fixed top-6 right-6 z-[60] transition-all duration-300 ${showToast ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
        <div className="flex items-center gap-3 px-5 py-3.5 bg-emerald-600 text-white rounded-lg shadow-xl">
          <i className="ri-check-line text-lg" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      </div>
    </div>
  );
};

export default RolesPermissions;
