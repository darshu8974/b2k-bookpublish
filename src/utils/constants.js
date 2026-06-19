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
  { key: 'CUSTOMER_INPUT',   label: 'Customer Input',    order: 1, description: 'Receive and document client requirements and briefs' },
  { key: 'SAMPLE_CREATION',  label: 'Sample Creation',   order: 2, description: 'Create initial sample based on customer brief' },
  { key: 'SAMPLE_REVIEW',    label: 'Sample Review',     order: 3, description: 'Review sample and collect client feedback' },
  { key: 'APPROVAL',         label: 'Approval',          order: 4, description: 'Client signs off on the approved sample' },
  { key: 'TYPESETTING',      label: 'Typesetting',       order: 5, description: 'Full typesetting of the complete manuscript' },
  { key: 'PAGINATION',       label: 'Pagination',        order: 6, description: 'Page layout, numbering and final formatting' },
  { key: 'QC',               label: 'Quality Check',     order: 7, description: 'Thorough quality inspection before delivery' },
  { key: 'FINAL_DELIVERY',   label: 'Final Delivery',    order: 8, description: 'Deliver final files to client' },
]

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
