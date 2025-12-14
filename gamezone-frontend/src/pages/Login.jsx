import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services';
import './Login.css';

function Login({ setIsAuthenticated, setIsAdmin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authService.login(email, password);
      const { token, user } = response.data.data;
      
      authService.setToken(token);
      localStorage.setItem('userRole', user.role);
      localStorage.setItem('userId', user.id);
      setIsAuthenticated(true);
      setIsAdmin(user.role === 'admin');
      
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h1>🎮 GameZone Login</h1>
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Contraseña:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" disabled={loading} className="btn-submit">
            {loading ? 'Cargando...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="demo-users">
          <h3>Usuarios de Demo:</h3>
          <p><strong>Admin:</strong> admin@gamezone.com / password123</p>
          <p><strong>User:</strong> user@gamezone.com / password123</p>
        </div>
      </div>
    </div>
  );
}

export default Login;
