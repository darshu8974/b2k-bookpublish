import { Box } from '@mui/material'
import PageHeader from '../../components/common/PageHeader'
import CreateProjectForm from './CreateProjectForm'

export default function CreateProjectPage() {
  return (
    <Box>
      <PageHeader
        title="Create New Project"
        subtitle="Set up a new publishing project and initialize its workflow stages"
        breadcrumbs={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Projects', path: '/projects' },
          { label: 'New Project' },
        ]}
      />
      <CreateProjectForm />
    </Box>
  )
}
