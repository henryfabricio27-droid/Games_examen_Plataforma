import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { juegoService, gamerpowerService } from '../services';
import Comentarios from '../components/Comentarios';
import './GameDetail.css';

function GameDetail() {
  const { id } = useParams();
  const [juego, setJuego] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const loadJuego = async () => {
      try {
        const response = await juegoService.getById(id);
        let juegoData = response.data.data;
        
        // Enriquecer con datos de GamerPower
        juegoData = await gamerpowerService.enrichGame(juegoData);
        
        setJuego(juegoData);
      } catch (err) {
        setError('Error al cargar el juego');
      } finally {
        setLoading(false);
      }
    };

    // Verificar autenticación
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);

    loadJuego();
  }, [id]);

  if (loading) return <div className="container"><p>Cargando...</p></div>;
  if (error) return <div className="container error-message">{error}</div>;
  if (!juego) return <div className="container"><p>Juego no encontrado</p></div>;

  return (
    <div className="container">
      <div className="game-detail">
        <div className="detail-image">
          <img 
            src={juego.imagen_url || `https://via.placeholder.com/400x500?text=${encodeURIComponent(juego.titulo)}`}
            alt={juego.titulo}
            onError={(e) => {
              e.target.src = `https://via.placeholder.com/400x500?text=${encodeURIComponent(juego.titulo)}`;
            }}
          />
        </div>
        <div className="detail-info">
          <h1>{juego.titulo}</h1>
          
          <p className="platform">
            <strong>Plataforma:</strong> {juego.plataforma?.nombre}
          </p>

          <div className="genres">
            <strong>Géneros:</strong>
            {juego.generos?.map(gen => (
              <span key={gen.id} className="genre-badge">{gen.nombre}</span>
            ))}
          </div>

          <div className="description">
            <h3>Descripción</h3>
            <p>{juego.descripcion_larga || juego.descripcion_corta}</p>
          </div>

          <div className="pricing">
            {juego.precio_oferta ? (
              <>
                <p>Precio regular: <strike>${juego.precio_normal}</strike></p>
                <p className="offer-price">Precio especial: <strong>${juego.precio_oferta}</strong></p>
              </>
            ) : (
              <p className="normal-price">Precio: <strong>${juego.precio_normal}</strong></p>
            )}
          </div>

          {juego.destacada && <p className="featured">⭐ Juego Destacado</p>}
          
          {juego.giveaway_url && (
            <div className="giveaway-section">
              <p className="giveaway-notice">🎁 ¡Disponible como giveaway!</p>
              {juego.valor_estimado && (
                <p className="giveaway-value">Valor estimado: ${juego.valor_estimado}</p>
              )}
              <a 
                href={juego.giveaway_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-success"
              >
                Obtener Juego Gratis
              </a>
            </div>
          )}
        </div>
      </div>

      <Comentarios juegoId={id} isAuthenticated={isAuthenticated} />
    </div>
  );
}

export default GameDetail;
