import { ROLES } from './constants'

export function isAdmin(role) {
  return role === ROLES.ADMIN
}

export function isProjectManager(role) {
  return role === ROLES.PROJECT_MANAGER
}

export function isAdminOrPM(role) {
  return role === ROLES.ADMIN || role === ROLES.PROJECT_MANAGER
}

export function canCreateProject(role) {
  return role === ROLES.ADMIN || role === ROLES.PROJECT_MANAGER
}

export function canAssignStage(role) {
  return role === ROLES.ADMIN || role === ROLES.PROJECT_MANAGER
}

export function canAdvanceStage(role, stageKey) {
  if (role === ROLES.ADMIN || role === ROLES.PROJECT_MANAGER) return true
  if (role === ROLES.PRODUCTION_TEAM) {
    return ['MANUSCRIPT_INTAKE', 'DESIGN_TEMPLATE', 'GLOBAL_STYLES', 'IMPORT_COMPOSITION'].includes(stageKey)
  }
  if (role === ROLES.QC_TEAM) {
    return ['QUALITY_EXPORT'].includes(stageKey)
  }
  return false
}

export function canRejectStage(role, stageKey) {
  if (role === ROLES.ADMIN || role === ROLES.PROJECT_MANAGER) return true
  if (role === ROLES.QC_TEAM && ['QUALITY_EXPORT'].includes(stageKey)) return true
  return false
}

export function canManageUsers(role) {
  return role === ROLES.ADMIN
}

export function canViewReports(role) {
  return role === ROLES.ADMIN || role === ROLES.PROJECT_MANAGER
}

export function canViewAuditLogs(role) {
  return role === ROLES.ADMIN
}

export function canDeleteProject(role) {
  return role === ROLES.ADMIN
}

export function canViewAllProjects(role) {
  return role === ROLES.ADMIN || role === ROLES.PROJECT_MANAGER
}

export function canUploadFiles(role) {
  return true
}

export function canDeleteFile(role) {
  return role === ROLES.ADMIN || role === ROLES.PROJECT_MANAGER
}

export function getRolePermissions(role) {
  return {
    createProject:   canCreateProject(role),
    assignStage:     canAssignStage(role),
    manageUsers:     canManageUsers(role),
    viewReports:     canViewReports(role),
    viewAuditLogs:   canViewAuditLogs(role),
    deleteProject:   canDeleteProject(role),
    viewAllProjects: canViewAllProjects(role),
    uploadFiles:     canUploadFiles(role),
    deleteFile:      canDeleteFile(role),
  }
}
