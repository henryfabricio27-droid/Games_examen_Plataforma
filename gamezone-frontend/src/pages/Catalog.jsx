import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { juegoService } from '../services';
import './Catalog.css';

function Catalog() {
  const [juegos, setJuegos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [buscar, setBuscar] = useState('');

  useEffect(() => {
    loadJuegos();
  }, []);

  const loadJuegos = async (termino = '') => {
    try {
      setLoading(true);
      const response = await juegoService.getAll(termino);
      setJuegos(response.data.data);
      setError('');
    } catch (err) {
      setError('Error al cargar los juegos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadJuegos(buscar);
  };

  if (loading) return <div className="container"><p>Cargando juegos...</p></div>;

  return (
    <div className="container">
      <h1>📚 Catálogo de Juegos</h1>
      
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Buscar juego..."
          value={buscar}
          onChange={(e) => setBuscar(e.target.value)}
        />
        <button type="submit" className="btn btn-primary">Buscar</button>
      </form>

      {error && <div className="error-message">{error}</div>}

      {juegos.length === 0 ? (
        <p>No se encontraron juegos</p>
      ) : (
        <div className="games-grid">
          {juegos.map(juego => (
            <div key={juego.id} className="game-card">
              {juego.imagen_url && (
                <img src={juego.imagen_url} alt={juego.titulo} className="game-image" />
              )}
              <div className="game-info">
                <h3>{juego.titulo}</h3>
                <p className="game-platform">{juego.plataforma?.nombre}</p>
                <p className="game-description">{juego.descripcion_corta}</p>
                <div className="game-genres">
                  {juego.generos?.map(gen => (
                    <span key={gen.id} className="genre-tag">{gen.nombre}</span>
                  ))}
                </div>
                <div className="game-prices">
                  {juego.precio_oferta ? (
                    <>
                      <span className="price-original">${juego.precio_normal}</span>
                      <span className="price-offer">${juego.precio_oferta}</span>
                    </>
                  ) : (
                    <span className="price">${juego.precio_normal}</span>
                  )}
                </div>
                <Link to={`/juegos/${juego.id}`} className="btn btn-primary">
                  Ver Detalles
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Catalog;
