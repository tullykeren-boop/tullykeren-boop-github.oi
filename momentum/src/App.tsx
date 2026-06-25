import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { GoalsList } from './pages/GoalsList';
import { GoalDetail } from './pages/GoalDetail';
import { CreateGoal } from './pages/CreateGoal';
import { Settings } from './pages/Settings';
import { ToastProvider } from './components/ui/Toast';

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/goals" element={<GoalsList />} />
            <Route path="/goals/new" element={<CreateGoal />} />
            <Route path="/goals/:id" element={<GoalDetail />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </ToastProvider>
    </BrowserRouter>
  );
}
