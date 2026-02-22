import { Route, Routes } from 'react-router-dom';
import { Link } from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/Auth/LoginPage';
import RegisterPage from '@/pages/Auth/RegisterPage';
import OtpPage from '@/pages/Auth/OtpPage';
import FeedPage from '@/pages/FeedPage';

function App() {
  return (
    <div className="w-full h-screen bg-gradient-to-r from-[#000030] to-[#01333D]">
      <nav className="p-4">
        <ul className="flex space-x-4">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/login">Login</Link>
          </li>
          <li>
            <Link to="/register">Register</Link>
          </li>
        </ul>
      </nav>

      <div className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/otp" element={<OtpPage />} />
          <Route path="/feed" element={<FeedPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
