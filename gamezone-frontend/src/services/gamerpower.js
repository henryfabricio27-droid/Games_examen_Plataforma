import axios from 'axios';

const GAMERPOWER_API = 'https://www.gamerpower.com/api/giveaways';

const gamerpowerService = {
  /**
   * Obtener todas las giveaways/juegos gratis
   * @param {object} options - Opciones de filtrado (platform, type, sort-by)
   */
  getGiveaways: async (options = {}) => {
    try {
      const params = new URLSearchParams();
      if (options.platform) params.append('platform', options.platform);
      if (options.type) params.append('type', options.type);
      if (options.sort) params.append('sort-by', options.sort);

      const response = await axios.get(`${GAMERPOWER_API}?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching giveaways:', error);
      return [];
    }
  },

  /**
   * Obtener una giveaway específica
   * @param {number} id - ID de la giveaway
   */
  getGiveaway: async (id) => {
    try {
      const response = await axios.get(`https://www.gamerpower.com/api/giveaway?id=${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching giveaway:', error);
      return null;
    }
  },

  /**
   * Obtener giveaways por plataforma
   * @param {string} platform - Plataforma (pc, steam, ps5, etc)
   */
  getByPlatform: async (platform) => {
    return gamerpowerService.getGiveaways({ platform });
  },

  /**
   * Obtener giveaways por tipo
   * @param {string} type - Tipo (game, loot, beta)
   */
  getByType: async (type) => {
    return gamerpowerService.getGiveaways({ type });
  },

  /**
   * Buscar una giveaway que coincida con un juego por título
   * @param {string} gameTitle - Título del juego
   */
  findByTitle: async (gameTitle) => {
    try {
      if (!gameTitle || gameTitle.trim() === '') {
        return null;
      }

      const giveaways = await gamerpowerService.getGiveaways({ type: 'game' });
      const lowerTitle = gameTitle.toLowerCase().trim();
      
      // Primero intenta coincidencia exacta o muy similar
      let match = giveaways.find(g => 
        g.title.toLowerCase() === lowerTitle
      );
      
      // Si no, intenta coincidencia parcial
      if (!match) {
        match = giveaways.find(g => 
          g.title.toLowerCase().includes(lowerTitle) || 
          lowerTitle.includes(g.title.toLowerCase())
        );
      }
      
      // Si aún no, intenta palabras clave
      if (!match) {
        const keywords = lowerTitle.split(' ');
        match = giveaways.find(g => 
          keywords.some(kw => g.title.toLowerCase().includes(kw))
        );
      }
      
      return match || null;
    } catch (error) {
      console.error('Error searching giveaway:', error);
      return null;
    }
  },

  /**
   * Enriquecer un juego local con datos de GamerPower
   * @param {object} localGame - Juego local de la BD
   */
  enrichGame: async (localGame) => {
    try {
      const giveaway = await gamerpowerService.findByTitle(localGame.titulo);
      if (giveaway && giveaway.thumbnail) {
        return {
          ...localGame,
          imagen_url: giveaway.thumbnail,
          giveaway_url: giveaway.open_giveaway_url,
          valor_estimado: giveaway.worth,
          plataforma_giveaway: giveaway.platforms,
          de_gamerpower: true,
        };
      }
      
      // Si no hay imagen de GamerPower, agrega un placeholder
      return {
        ...localGame,
        imagen_url: `https://via.placeholder.com/300x400?text=${encodeURIComponent(localGame.titulo)}`,
        de_gamerpower: false,
      };
    } catch (error) {
      console.error('Error enriching game:', error);
      // En caso de error, devuelve el juego con placeholder
      return {
        ...localGame,
        imagen_url: `https://via.placeholder.com/300x400?text=${encodeURIComponent(localGame.titulo)}`,
        de_gamerpower: false,
      };
    }
  }
};

export default gamerpowerService;
