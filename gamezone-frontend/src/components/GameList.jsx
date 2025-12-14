import './GameList.css';

function GameList({ juegos, onEdit, onDelete, loading }) {
  if (loading) return <p>Cargando...</p>;

  if (juegos.length === 0) {
    return <p className="empty-message">No hay juegos registrados</p>;
  }

  return (
    <div className="game-list">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Título</th>
            <th>Plataforma</th>
            <th>Precio Normal</th>
            <th>Precio Oferta</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {juegos.map(juego => (
            <tr key={juego.id}>
              <td>{juego.id}</td>
              <td>{juego.titulo}</td>
              <td>{juego.plataforma?.nombre}</td>
              <td>${juego.precio_normal}</td>
              <td>{juego.precio_oferta ? `$${juego.precio_oferta}` : '-'}</td>
              <td>
                <span className={`status ${juego.activo ? 'active' : 'inactive'}`}>
                  {juego.activo ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              <td className="actions">
                <button 
                  className="btn-edit"
                  onClick={() => onEdit(juego)}
                >
                  ✏️ Editar
                </button>
                <button 
                  className="btn-delete"
                  onClick={() => onDelete(juego.id)}
                >
                  🗑️ Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default GameList;
