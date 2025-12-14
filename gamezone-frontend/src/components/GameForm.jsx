import { useState, useEffect } from 'react';
import { plataformaService, generoService } from '../services';
import './GameForm.css';

function GameForm({ juego, onSave }) {
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion_corta: '',
    descripcion_larga: '',
    precio_normal: '',
    precio_oferta: '',
    plataforma_id: '',
    generos: [],
    destacada: false,
    activo: true
  });

  const [plataformas, setPlataformas] = useState([]);
  const [generos, setGeneros] = useState([]);
  const [imagen, setImagen] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
    if (juego) {
      setFormData({
        ...juego,
        generos: juego.generos?.map(g => g.id) || []
      });
    }
  }, [juego]);

  const loadData = async () => {
    try {
      const [platRes, genRes] = await Promise.all([
        plataformaService.getAll(),
        generoService.getAll()
      ]);
      setPlataformas(platRes.data);
      setGeneros(genRes.data);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleGenreChange = (genreId) => {
    setFormData(prev => ({
      ...prev,
      generos: prev.generos.includes(genreId)
        ? prev.generos.filter(id => id !== genreId)
        : [...prev.generos, genreId]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = {
        ...formData,
        imagen
      };
      await onSave(submitData);
    } catch (error) {
      console.error('Error al guardar:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="game-form">
      <div className="form-row">
        <div className="form-group">
          <label>Título *</label>
          <input
            type="text"
            name="titulo"
            value={formData.titulo}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Plataforma *</label>
          <select
            name="plataforma_id"
            value={formData.plataforma_id}
            onChange={handleChange}
            required
          >
            <option value="">Seleccionar plataforma</option>
            {plataformas.map(p => (
              <option key={p.id} value={p.id}>{p.nombre}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label>Descripción Corta</label>
        <input
          type="text"
          name="descripcion_corta"
          value={formData.descripcion_corta}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Descripción Larga</label>
        <textarea
          name="descripcion_larga"
          value={formData.descripcion_larga}
          onChange={handleChange}
          rows="4"
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Precio Normal *</label>
          <input
            type="number"
            name="precio_normal"
            value={formData.precio_normal}
            onChange={handleChange}
            step="0.01"
            required
          />
        </div>
        <div className="form-group">
          <label>Precio Oferta</label>
          <input
            type="number"
            name="precio_oferta"
            value={formData.precio_oferta}
            onChange={handleChange}
            step="0.01"
          />
        </div>
      </div>

      <div className="form-group">
        <label>Imagen</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImagen(e.target.files[0])}
        />
      </div>

      <div className="form-group">
        <label>Géneros</label>
        <div className="genres-checkbox">
          {generos.map(g => (
            <label key={g.id} className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.generos.includes(g.id)}
                onChange={() => handleGenreChange(g.id)}
              />
              {g.nombre}
            </label>
          ))}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group checkbox">
          <label>
            <input
              type="checkbox"
              name="destacada"
              checked={formData.destacada}
              onChange={handleChange}
            />
            Juego Destacado
          </label>
        </div>
        <div className="form-group checkbox">
          <label>
            <input
              type="checkbox"
              name="activo"
              checked={formData.activo}
              onChange={handleChange}
            />
            Activo
          </label>
        </div>
      </div>

      <button type="submit" className="btn btn-success" disabled={loading}>
        {loading ? 'Guardando...' : 'Guardar Juego'}
      </button>
    </form>
  );
}

export default GameForm;
