export const ROLES = {
  ADMIN: 'ADMIN',
  PROJECT_MANAGER: 'PROJECT_MANAGER',
  PRODUCTION_TEAM: 'PRODUCTION_TEAM',
  QC_TEAM: 'QC_TEAM',
}

export const ROLE_LABELS = {
  ADMIN: 'Admin',
  PROJECT_MANAGER: 'Project Manager',
  PRODUCTION_TEAM: 'Production Team',
  QC_TEAM: 'QC Team',
}

export const WORKFLOW_STAGES = [
  { key: 'MANUSCRIPT_INTAKE',  label: 'Manuscript Intake & Content Prep', order: 1, description: 'Standardize files, clean text, and lock down fully-edited content' },
  { key: 'DESIGN_TEMPLATE',    label: 'Design Template & Geometry Setup', order: 2, description: 'Define trim size, margins, baseline grid, typography and master pages' },
  { key: 'GLOBAL_STYLES',      label: 'Global Styles Definition',         order: 3, description: 'Define paragraph, character and object/table styles' },
  { key: 'IMPORT_COMPOSITION', label: 'Import & Composition',             order: 4, description: 'Flow text, apply hierarchy and run the copy-fitting pass' },
  { key: 'QUALITY_EXPORT',     label: 'Quality Assurance & Export',       order: 5, description: 'Visual proofing, preflight check and final export' },
]

// Colours matching the client's phase diagram (blue → purple → orange → green → red)
export const PHASE_COLORS = {
  MANUSCRIPT_INTAKE:  { main: '#2D6CC0', bg: '#E7F0FB' },
  DESIGN_TEMPLATE:    { main: '#8B3FA3', bg: '#F3E9F7' },
  GLOBAL_STYLES:      { main: '#E07B1E', bg: '#FCEEDD' },
  IMPORT_COMPOSITION: { main: '#2E9E4F', bg: '#E5F6EA' },
  QUALITY_EXPORT:     { main: '#C13B2F', bg: '#FBE7E5' },
}

export const PROJECT_STATUS = {
  DRAFT: 'DRAFT',
  ACTIVE: 'ACTIVE',
  ON_HOLD: 'ON_HOLD',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
}

export const PROJECT_PRIORITY = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  URGENT: 'URGENT',
}

export const STAGE_STATUS = {
  PENDING: 'PENDING',
  IN_PROGRESS: 'IN_PROGRESS',
  REJECTED: 'REJECTED',
  COMPLETED: 'COMPLETED',
  SKIPPED: 'SKIPPED',
}

export const UPLOAD_CATEGORIES = [
  { value: 'CUSTOMER_BRIEF',    label: 'Customer Brief' },
  { value: 'SAMPLE_FILE',       label: 'Sample File' },
  { value: 'REVIEW_FEEDBACK',   label: 'Review Feedback' },
  { value: 'TYPESET_DRAFT',     label: 'Typeset Draft' },
  { value: 'PAGINATED_FILE',    label: 'Paginated File' },
  { value: 'QC_REPORT',         label: 'QC Report' },
  { value: 'FINAL_DELIVERABLE', label: 'Final Deliverable' },
  { value: 'OTHER',             label: 'Other' },
]

export const NOTIFICATION_TYPES = {
  STAGE_ADVANCED: 'STAGE_ADVANCED',
  STAGE_REJECTED: 'STAGE_REJECTED',
  STAGE_ASSIGNED: 'STAGE_ASSIGNED',
  COMMENT_ADDED:  'COMMENT_ADDED',
  FILE_UPLOADED:  'FILE_UPLOADED',
  PROJECT_CREATED:'PROJECT_CREATED',
  PROJECT_UPDATED:'PROJECT_UPDATED',
}

export const AUDIT_ACTIONS = {
  LOGIN:             'LOGIN',
  LOGOUT:            'LOGOUT',
  PROJECT_CREATED:   'PROJECT_CREATED',
  PROJECT_UPDATED:   'PROJECT_UPDATED',
  PROJECT_DELETED:   'PROJECT_DELETED',
  STAGE_ADVANCED:    'STAGE_ADVANCED',
  STAGE_REJECTED:    'STAGE_REJECTED',
  STAGE_ASSIGNED:    'STAGE_ASSIGNED',
  FILE_UPLOADED:     'FILE_UPLOADED',
  FILE_DELETED:      'FILE_DELETED',
  COMMENT_ADDED:     'COMMENT_ADDED',
  USER_CREATED:      'USER_CREATED',
  USER_UPDATED:      'USER_UPDATED',
  USER_DEACTIVATED:  'USER_DEACTIVATED',
}
