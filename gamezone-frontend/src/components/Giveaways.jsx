import { useState, useEffect } from 'react';
import { gamerpowerService } from '../services';
import './Giveaways.css';

function Giveaways() {
  const [giveaways, setGiveaways] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadGiveaways();
  }, []);

  const loadGiveaways = async () => {
    try {
      setLoading(true);
      // Obtener giveaways ordenadas por valor
      const data = await gamerpowerService.getGiveaways({ 
        type: 'game',
        sort: 'value'
      });
      setGiveaways(data.slice(0, 10)); // Solo mostrar los top 10
      setError('');
    } catch (err) {
      setError('Error al cargar las giveaways');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="giveaways-container"><p>Cargando giveaways...</p></div>;

  return (
    <div className="giveaways-container">
      <h2>🎁 Top Giveaways Disponibles</h2>
      
      {error && <div className="error-message">{error}</div>}

      {giveaways.length === 0 ? (
        <p>No hay giveaways disponibles en este momento</p>
      ) : (
        <div className="giveaways-grid">
          {giveaways.map(giveaway => (
            <div key={giveaway.id} className="giveaway-card">
              {giveaway.thumbnail && (
                <img 
                  src={giveaway.thumbnail} 
                  alt={giveaway.title} 
                  className="giveaway-image"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x400?text=No+Image';
                  }}
                />
              )}
              <div className="giveaway-info">
                <h3>{giveaway.title}</h3>
                <p className="giveaway-platforms">{giveaway.platforms}</p>
                <p className="giveaway-type">{giveaway.type}</p>
                {giveaway.worth && (
                  <p className="giveaway-worth">Valor: ${giveaway.worth}</p>
                )}
                <div className="giveaway-expires">
                  <small>Vence: {new Date(giveaway.end_date).toLocaleDateString('es-ES')}</small>
                </div>
                <a 
                  href={giveaway.open_giveaway_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-giveaway"
                >
                  Participar
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Giveaways;
