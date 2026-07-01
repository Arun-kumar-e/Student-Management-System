import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { StudentList } from './pages/StudentList';
import { StudentDetails } from './pages/StudentDetails';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/students" element={<StudentList />} />
          <Route path="/students/:id" element={<StudentDetails />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
      
      {/* Toast Notification Handler */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'var(--color-surface-card)',
            color: 'var(--color-text-title)',
            border: '1px solid var(--color-surface-border)',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            boxShadow: 'none',
          },
          duration: 3500,
        }}
      />
    </Router>
  );
}

export default App;
