import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { SnackbarProvider } from 'notistack'
import theme from './theme/theme'
import { AuthProvider } from './auth/AuthContext'
import ProtectedRoute from './auth/ProtectedRoute'
import AppShell from './components/layout/AppShell'
import LoginPage from './pages/LoginPage/LoginPage'
import DashboardPage from './pages/DashboardPage/DashboardPage'
import ProjectsPage from './pages/ProjectsPage/ProjectsPage'
import ProjectDetailPage from './pages/ProjectDetailPage/ProjectDetailPage'
import CreateProjectPage from './pages/CreateProjectPage/CreateProjectPage'
import UsersPage from './pages/UsersPage/UsersPage'
import ReportsPage from './pages/ReportsPage/ReportsPage'
import AuditLogsPage from './pages/AuditLogsPage/AuditLogsPage'
import TemplatesPage from './pages/TemplatesPage/TemplatesPage'
import IncomingPage from './pages/IncomingPage/IncomingPage'
import InputPage from './pages/InputPage/InputPage'
import AuthorPortalPage from './pages/AuthorPortalPage/AuthorPortalPage'

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        autoHideDuration={3500}
      >
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/author/review" element={<AuthorPortalPage />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <AppShell />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="projects" element={<ProjectsPage />} />
                <Route path="projects/new" element={<CreateProjectPage />} />
                <Route path="projects/:id" element={<ProjectDetailPage />} />
                <Route path="templates" element={<TemplatesPage />} />
                <Route path="incoming" element={<IncomingPage />} />
                <Route path="input" element={<InputPage />} />
                <Route
                  path="users"
                  element={
                    <ProtectedRoute roles={['ADMIN']}>
                      <UsersPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="reports"
                  element={
                    <ProtectedRoute roles={['ADMIN', 'PROJECT_MANAGER']}>
                      <ReportsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="audit-logs"
                  element={
                    <ProtectedRoute roles={['ADMIN']}>
                      <AuditLogsPage />
                    </ProtectedRoute>
                  }
                />
              </Route>
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </SnackbarProvider>
    </ThemeProvider>
  )
}
