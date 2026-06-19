export const projectStatusColors = {
  DRAFT:     { bg: '#F4F5F7', text: '#5E6C84', border: '#DFE1E6' },
  ACTIVE:    { bg: '#E3FCEF', text: '#006644', border: '#57D9A3' },
  ON_HOLD:   { bg: '#FFFAE6', text: '#172B4D', border: '#FFE380' },
  COMPLETED: { bg: '#DEEBFF', text: '#0747A6', border: '#4C9AFF' },
  CANCELLED: { bg: '#FFEBE6', text: '#BF2600', border: '#FF8F73' },
}

export const stageStatusColors = {
  PENDING:        { bg: '#F4F5F7', text: '#5E6C84',  border: '#B3BAC5' },
  IN_PROGRESS:    { bg: '#E9F2FF', text: '#0052CC',  border: '#4C9AFF' },
  REVIEW_PENDING: { bg: '#EAE6FF', text: '#403294',  border: '#8777D9' },
  APPROVED:       { bg: '#E3FCEF', text: '#006644',  border: '#57D9A3' },
  REJECTED:       { bg: '#FFEBE6', text: '#BF2600',  border: '#FF8F73' },
  COMPLETED:      { bg: '#DEEBFF', text: '#0747A6',  border: '#2684FF' },
  SKIPPED:        { bg: '#F4F5F7', text: '#97A0AF',  border: '#DFE1E6' },
}

export const priorityColors = {
  LOW:    { bg: '#F4F5F7', text: '#5E6C84',  icon: '#97A0AF' },
  MEDIUM: { bg: '#DEEBFF', text: '#0052CC',  icon: '#4C9AFF' },
  HIGH:   { bg: '#FFFAE6', text: '#172B4D',  icon: '#FF991F' },
  URGENT: { bg: '#FFEBE6', text: '#BF2600',  icon: '#FF5630' },
}

export const roleColors = {
  ADMIN:            { bg: '#EAE6FF', text: '#403294' },
  PROJECT_MANAGER:  { bg: '#E9F2FF', text: '#0052CC' },
  PRODUCTION_TEAM:  { bg: '#E3FCEF', text: '#006644' },
  QC_TEAM:          { bg: '#FFF0B3', text: '#172B4D' },
}

export const avatarColors = [
  '#0052CC', '#6554C0', '#00875A', '#FF991F',
  '#DE350B', '#0065FF', '#403294', '#006644',
]

export function getAvatarColor(name = '') {
  const idx = name.charCodeAt(0) % avatarColors.length
  return avatarColors[idx]
}
