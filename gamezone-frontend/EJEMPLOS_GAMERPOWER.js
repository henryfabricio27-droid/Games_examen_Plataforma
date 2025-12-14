// Ejemplos de Uso del Servicio GamerPower
// Archivo: gamezone-frontend/src/services/gamerpower.js

import { gamerpowerService } from './services';

// =====================================
// 1. OBTENER TODAS LAS GIVEAWAYS
// =====================================
const todosLosGiveaways = async () => {
  const giveaways = await gamerpowerService.getGiveaways();
  console.log('Todas las giveaways:', giveaways);
};

// =====================================
// 2. FILTRAR POR PLATAFORMA
// =====================================
const giveawaysPorPlataforma = async () => {
  // Plataformas disponibles:
  // pc, steam, epic-games-store, ubisoft, gog, itchio
  // ps4, ps5, xbox-one, xbox-series-xs, switch
  // android, ios, vr, battlenet, origin, drm-free
  
  const steamGiveaways = await gamerpowerService.getByPlatform('steam');
  console.log('Giveaways de Steam:', steamGiveaways);

  const psGiveaways = await gamerpowerService.getByPlatform('ps5');
  console.log('Giveaways de PS5:', psGiveaways);
};

// =====================================
// 3. FILTRAR POR TIPO
// =====================================
const giveawaysPorTipo = async () => {
  // Tipos disponibles: game, loot, beta
  
  const juegos = await gamerpowerService.getByType('game');
  console.log('Juegos gratis:', juegos);

  const loot = await gamerpowerService.getByType('loot');
  console.log('In-game loot gratis:', loot);
};

// =====================================
// 4. OPCIONES AVANZADAS
// =====================================
const giveawaysAvanzadas = async () => {
  // Combinar múltiples filtros y ordenar
  const options = {
    platform: 'steam',    // Solo Steam
    type: 'game',         // Solo juegos
    sort: 'value'         // Ordenar por valor (value, date, popularity)
  };
  
  const resultado = await gamerpowerService.getGiveaways(options);
  console.log('Steam juegos ordenados por valor:', resultado);
};

// =====================================
// 5. OBTENER UNA GIVEAWAY ESPECÍFICA
// =====================================
const unaGiveaway = async () => {
  const giveaway = await gamerpowerService.getGiveaway(525);
  console.log('Giveaway específica:', giveaway);
  // Datos incluyen:
  // - id, title, thumbnail, description
  // - platforms, type, worth
  // - open_giveaway_url
  // - end_date, status
};

// =====================================
// 6. BUSCAR POR TÍTULO
// =====================================
const buscarPorTitulo = async () => {
  const elderScrolls = await gamerpowerService.findByTitle('Elder Scrolls');
  console.log('Elder Scrolls giveaway:', elderScrolls);

  const zelda = await gamerpowerService.findByTitle('Zelda');
  console.log('Zelda giveaway:', zelda);
};

// =====================================
// 7. ENRIQUECER UN JUEGO
// =====================================
const enriquecerJuego = async () => {
  // Juego local de tu base de datos
  const juegoLocal = {
    id: 1,
    titulo: 'Elden Ring',
    descripcion_corta: 'Aventura RPG desafiante',
    precio_normal: 59.99,
    plataforma_id: 2
  };

  // Enriquecerlo con datos de GamerPower
  const juegoEnriquecido = await gamerpowerService.enrichGame(juegoLocal);
  console.log('Juego enriquecido:', juegoEnriquecido);
  
  // Resultado incluirá:
  // - imagen_url: thumbnail de GamerPower
  // - giveaway_url: enlace a la giveaway
  // - valor_estimado: worth del juego
  // - plataforma_giveaway: plataformas disponibles
};

// =====================================
// EJEMPLO COMPLETO EN UN COMPONENTE REACT
// =====================================

/*
import { useState, useEffect } from 'react';
import { gamerpowerService } from '../services';

function MisGiveaways() {
  const [giveaways, setGiveaways] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filtro, setFiltro] = useState('');

  const cargarGiveaways = async (plataforma = '') => {
    setLoading(true);
    try {
      let resultado;
      if (plataforma) {
        resultado = await gamerpowerService.getByPlatform(plataforma);
      } else {
        resultado = await gamerpowerService.getGiveaways({ 
          type: 'game',
          sort: 'value'
        });
      }
      setGiveaways(resultado.slice(0, 20));
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarGiveaways();
  }, []);

  return (
    <div>
      <h2>Giveaways Disponibles</h2>
      
      <select onChange={(e) => {
        setFiltro(e.target.value);
        cargarGiveaways(e.target.value);
      }}>
        <option value="">Todas las plataformas</option>
        <option value="steam">Steam</option>
        <option value="epic-games-store">Epic Games</option>
        <option value="ps5">PlayStation 5</option>
        <option value="xbox-series-xs">Xbox Series X/S</option>
      </select>

      {loading && <p>Cargando...</p>}

      <div className="giveaways-list">
        {giveaways.map(g => (
          <div key={g.id}>
            <h3>{g.title}</h3>
            <img src={g.thumbnail} alt={g.title} />
            <p>Plataformas: {g.platforms}</p>
            <p>Valor: ${g.worth}</p>
            <a href={g.open_giveaway_url} target="_blank">
              Participar
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MisGiveaways;
*/

// =====================================
// ESTRUCTURA DE RESPUESTA
// =====================================
/*
{
  id: 1,
  title: "Quantum Break",
  platform: "steam",
  type: "game",
  browser_have_login: 0,
  thumbnail: "https://www.gamerpower.com/offers/1/thumbnail.jpg",
  image: "https://www.gamerpower.com/offers/1/image.jpg",
  description: "Quantum Break is...",
  instructions: "1. Get your free Steam key...",
  open_giveaway_url: "https://www.gamerpower.com/open/1",
  published_date: "2025-01-15 10:00:00",
  expiration_date: "2025-02-01 23:59:00",
  platforms: "Steam, Epic Games Store",
  worth: "$24.99",
  status: "Active"
}
*/
