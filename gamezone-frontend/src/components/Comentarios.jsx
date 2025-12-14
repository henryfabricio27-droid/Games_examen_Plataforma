import { useState, useEffect } from 'react';
import { comentarioService } from '../services';
import './Comentarios.css';

function Comentarios({ juegoId, isAuthenticated }) {
  const [comentarios, setComentarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [contenido, setContenido] = useState('');
  const [calificacion, setCalificacion] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    loadComentarios();
    // Obtener el ID del usuario actual del localStorage
    const token = localStorage.getItem('token');
    if (token) {
      // Decodificar el token o guardar el user_id cuando se hace login
      const userId = localStorage.getItem('userId');
      setCurrentUserId(userId ? parseInt(userId) : null);
      setUserRole(localStorage.getItem('userRole'));
    }
  }, [juegoId]);

  const loadComentarios = async () => {
    try {
      setLoading(true);
      const response = await comentarioService.getByJuego(juegoId);
      setComentarios(response.data.data);
    } catch (error) {
      console.error('Error al cargar comentarios:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!contenido.trim()) return;

    setSubmitting(true);
    try {
      await comentarioService.create(juegoId, {
        contenido,
        calificacion
      });
      setContenido('');
      setCalificacion(5);
      setShowForm(false);
      loadComentarios();
    } catch (error) {
      console.error('Error al crear comentario:', error);
      alert('Error al publicar comentario');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (comentarioId) => {
    if (confirm('¿Estás seguro de que deseas eliminar este comentario?')) {
      try {
        await comentarioService.delete(comentarioId);
        loadComentarios();
      } catch (error) {
        console.error('Error al eliminar comentario:', error);
        alert('Error al eliminar comentario');
      }
    }
  };

  const canDelete = (comentario) => {
    return currentUserId === comentario.user_id || userRole === 'admin';
  };

  if (loading) return <div className="comentarios-container"><p>Cargando comentarios...</p></div>;

  return (
    <div className="comentarios-container">
      <h2>💬 Comentarios ({comentarios.length})</h2>

      {isAuthenticated ? (
        <>
          {!showForm && (
            <button 
              className="btn btn-primary"
              onClick={() => setShowForm(true)}
            >
              Agregar Comentario
            </button>
          )}

          {showForm && (
            <form onSubmit={handleSubmit} className="comentario-form">
              <div className="form-group">
                <label>Calificación:</label>
                <select 
                  value={calificacion}
                  onChange={(e) => setCalificacion(parseInt(e.target.value))}
                >
                  <option value={5}>⭐⭐⭐⭐⭐ Excelente</option>
                  <option value={4}>⭐⭐⭐⭐ Muy Bueno</option>
                  <option value={3}>⭐⭐⭐ Bueno</option>
                  <option value={2}>⭐⭐ Regular</option>
                  <option value={1}>⭐ Malo</option>
                </select>
              </div>

              <div className="form-group">
                <label>Tu Comentario:</label>
                <textarea
                  value={contenido}
                  onChange={(e) => setContenido(e.target.value)}
                  placeholder="Escribe tu opinión sobre este juego..."
                  minLength={5}
                  maxLength={500}
                  required
                />
                <small>{contenido.length}/500 caracteres</small>
              </div>

              <div className="form-actions">
                <button type="submit" disabled={submitting} className="btn btn-success">
                  {submitting ? 'Publicando...' : 'Publicar'}
                </button>
                <button 
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="btn btn-secondary"
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}
        </>
      ) : (
        <p className="info-message">Inicia sesión para comentar este juego</p>
      )}

      <div className="comentarios-list">
        {comentarios.length === 0 ? (
          <p className="no-comments">No hay comentarios aún. ¡Sé el primero en comentar!</p>
        ) : (
          comentarios.map(comentario => (
            <div key={comentario.id} className="comentario-item">
              <div className="comentario-header">
                <div className="comentario-user-info">
                  <strong>{comentario.user.name}</strong>
                  <span className="comentario-rating">{'⭐'.repeat(comentario.calificacion)}</span>
                </div>
                <small className="comentario-date">
                  {new Date(comentario.created_at).toLocaleDateString()}
                </small>
              </div>
              <p className="comentario-content">{comentario.contenido}</p>
              {canDelete(comentario) && (
                <button
                  className="btn-delete"
                  onClick={() => handleDelete(comentario.id)}
                >
                  Eliminar
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Comentarios;
