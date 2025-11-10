import { Route, Routes } from 'react-router-dom';
import { Link } from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/Auth/LoginPage';
import RegisterPage from '@/pages/Auth/RegisterPage';

function App() {
  return (
    <div className="w-full h-screen">
      <nav className="bg-gray-100 p-4 shadow">
        <ul className="flex space-x-4">
          <li>
            <Link to="/" className="text-blue-500 hover:text-blue-700">
              Home
            </Link>
          </li>
          <li>
            <Link to="/login" className="text-blue-500 hover:text-blue-700">
              Login
            </Link>
          </li>
          <li>
            <Link to="/register" className="text-blue-500 hover:text-blue-700">
              Register
            </Link>
          </li>
        </ul>
      </nav>

      <div className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
