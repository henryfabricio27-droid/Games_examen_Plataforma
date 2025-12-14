import { useState, useEffect } from 'react';
import { juegoService, plataformaService, generoService } from '../services';
import GameForm from '../components/GameForm';
import GameList from '../components/GameList';
import './AdminDashboard.css';

function AdminDashboard() {
  const [tab, setTab] = useState('juegos');
  const [juegos, setJuegos] = useState([]);
  const [plataformas, setPlataformas] = useState([]);
  const [generos, setGeneros] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingGame, setEditingGame] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (tab === 'juegos') loadJuegos();
    if (tab === 'plataformas') loadPlataformas();
    if (tab === 'generos') loadGeneros();
  }, [tab]);

  const loadJuegos = async () => {
    try {
      setLoading(true);
      const response = await juegoService.getAll();
      setJuegos(response.data.data);
    } catch (error) {
      console.error('Error al cargar juegos:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPlataformas = async () => {
    try {
      setLoading(true);
      const response = await plataformaService.getAll();
      setPlataformas(response.data);
    } catch (error) {
      console.error('Error al cargar plataformas:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadGeneros = async () => {
    try {
      setLoading(true);
      const response = await generoService.getAll();
      setGeneros(response.data);
    } catch (error) {
      console.error('Error al cargar géneros:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveGame = async (juego) => {
    try {
      if (editingGame) {
        await juegoService.update(editingGame.id, juego);
      } else {
        await juegoService.create(juego);
      }
      loadJuegos();
      setShowForm(false);
      setEditingGame(null);
      alert('Juego guardado exitosamente');
    } catch (error) {
      console.error('Error al guardar juego:', error);
      const message = error.response?.data?.message || 'Error al guardar el juego';
      alert(`Error: ${message}`);
    }
  };

  const handleDeleteGame = async (id) => {
    if (confirm('¿Estás seguro?')) {
      try {
        await juegoService.delete(id);
        loadJuegos();
      } catch (error) {
        console.error('Error al eliminar juego:', error);
      }
    }
  };

  const handleEditGame = (juego) => {
    setEditingGame(juego);
    setShowForm(true);
  };

  return (
    <div className="admin-container">
      <h1>📊 Panel de Administración</h1>

      <div className="admin-tabs">
        <button 
          className={`tab ${tab === 'juegos' ? 'active' : ''}`}
          onClick={() => setTab('juegos')}
        >
          Juegos
        </button>
        <button 
          className={`tab ${tab === 'plataformas' ? 'active' : ''}`}
          onClick={() => setTab('plataformas')}
        >
          Plataformas
        </button>
        <button 
          className={`tab ${tab === 'generos' ? 'active' : ''}`}
          onClick={() => setTab('generos')}
        >
          Géneros
        </button>
      </div>

      <div className="admin-content">
        {tab === 'juegos' && (
          <div className="tab-content">
            <div className="action-buttons">
              <button 
                className="btn btn-success"
                onClick={() => {
                  setEditingGame(null);
                  setShowForm(!showForm);
                }}
              >
                {showForm ? 'Cancelar' : '➕ Nuevo Juego'}
              </button>
            </div>

            {showForm && (
              <GameForm 
                juego={editingGame}
                onSave={handleSaveGame}
              />
            )}

            <GameList 
              juegos={juegos}
              onEdit={handleEditGame}
              onDelete={handleDeleteGame}
              loading={loading}
            />
          </div>
        )}

        {tab === 'plataformas' && (
          <div className="tab-content">
            <h2>Gestión de Plataformas</h2>
            <p>Implementar CRUD de plataformas aquí</p>
          </div>
        )}

        {tab === 'generos' && (
          <div className="tab-content">
            <h2>Gestión de Géneros</h2>
            <p>Implementar CRUD de géneros aquí</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
