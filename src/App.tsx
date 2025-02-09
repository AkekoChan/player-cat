import { Route, Routes } from 'react-router';
import ErrorPage from './pages/ErrorPage';
import ManagerPage from './pages/ManagerPage';
import PlayerPage from './pages/PlayerPage';

const App = () => {
  return (
    <main className="main-content">
      <Routes>
        <Route index element={<ManagerPage />} />
        <Route path="player/:id" element={<PlayerPage />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </main>
  );
};

export default App;
