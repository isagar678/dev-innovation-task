import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const Navbar = () => {
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();

  if (!token) return null;

  return (
    <nav className="flex items-center justify-between px-4 py-2 border-b bg-white">
      <div className="flex items-center gap-4">
        <Link to="/notes" className="font-semibold text-gray-800 hover:text-black">Notes</Link>
        <Link to="/bookmarks" className="font-semibold text-gray-800 hover:text-black">Bookmarks</Link>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-gray-600 text-sm">{user}</span>
        <button
          onClick={() => { logout(); navigate('/login'); }}
          className="px-3 py-1 rounded bg-black text-white hover:bg-gray-800 text-sm"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar; 