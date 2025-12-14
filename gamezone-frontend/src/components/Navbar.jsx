import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services';
import './Navbar.css';

function Navbar({ isAuthenticated, isAdmin, setIsAuthenticated }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authService.logout();
      authService.removeToken();
      localStorage.removeItem('userRole');
      setIsAuthenticated(false);
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      authService.removeToken();
      localStorage.removeItem('userRole');
      setIsAuthenticated(false);
      navigate('/login');
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          🎮 GameZone
        </Link>
        <div className="navbar-menu">
          <Link to="/" className="nav-link">Catálogo</Link>
          {isAdmin && (
            <Link to="/admin" className="nav-link">Dashboard Admin</Link>
          )}
          {isAuthenticated ? (
            <button onClick={handleLogout} className="btn-logout">
              Cerrar Sesión
            </button>
          ) : (
            <Link to="/login" className="btn-login">
              Iniciar Sesión
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
