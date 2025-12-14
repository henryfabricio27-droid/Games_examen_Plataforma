import apiClient from './api';

export const authService = {
  login: (email, password) => 
    apiClient.post('/login', { email, password }),
  
  logout: () => 
    apiClient.post('/logout'),
  
  getToken: () => localStorage.getItem('token'),
  
  setToken: (token) => localStorage.setItem('token', token),
  
  removeToken: () => localStorage.removeItem('token'),
  
  isAuthenticated: () => !!localStorage.getItem('token')
};

export const juegoService = {
  getAll: (buscar = '') => 
    apiClient.get('/juegos', { params: { buscar } }),
  
  getById: (id) => 
    apiClient.get(`/juegos/${id}`),
  
  create: (juego) => {
    const formData = new FormData();
    
    // Agregar campos normales
    formData.append('titulo', juego.titulo);
    formData.append('descripcion_corta', juego.descripcion_corta || '');
    formData.append('descripcion_larga', juego.descripcion_larga || '');
    formData.append('precio_normal', juego.precio_normal);
    formData.append('precio_oferta', juego.precio_oferta || '');
    formData.append('plataforma_id', juego.plataforma_id);
    formData.append('destacada', juego.destacada ? 1 : 0);
    formData.append('activo', juego.activo ? 1 : 0);
    
    // Agregar géneros
    if (Array.isArray(juego.generos) && juego.generos.length > 0) {
      juego.generos.forEach((generoId, index) => {
        formData.append(`generos[${index}]`, generoId);
      });
    }
    
    // Agregar imagen si existe
    if (juego.imagen) {
      formData.append('imagen', juego.imagen);
    }
    
    return apiClient.post('/juegos', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  
  update: (id, juego) => {
    const formData = new FormData();
    
    // Agregar campos normales
    formData.append('titulo', juego.titulo);
    formData.append('descripcion_corta', juego.descripcion_corta || '');
    formData.append('descripcion_larga', juego.descripcion_larga || '');
    formData.append('precio_normal', juego.precio_normal);
    formData.append('precio_oferta', juego.precio_oferta || '');
    formData.append('plataforma_id', juego.plataforma_id);
    formData.append('destacada', juego.destacada ? 1 : 0);
    formData.append('activo', juego.activo ? 1 : 0);
    
    // Agregar géneros
    if (Array.isArray(juego.generos) && juego.generos.length > 0) {
      juego.generos.forEach((gid, index) => {
        formData.append(`generos[${index}]`, gid);
      });
    }
    
    // Agregar imagen si existe
    if (juego.imagen) {
      formData.append('imagen', juego.imagen);
    }
    
    return apiClient.put(`/juegos/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  
  delete: (id) => 
    apiClient.delete(`/juegos/${id}`)
};

export const plataformaService = {
  getAll: () => 
    apiClient.get('/plataformas'),
  
  create: (plataforma) => 
    apiClient.post('/plataformas', plataforma),
  
  update: (id, plataforma) => 
    apiClient.put(`/plataformas/${id}`, plataforma),
  
  delete: (id) => 
    apiClient.delete(`/plataformas/${id}`)
};

export const generoService = {
  getAll: () => 
    apiClient.get('/generos'),
  
  create: (genero) => 
    apiClient.post('/generos', genero),
  
  update: (id, genero) => 
    apiClient.put(`/generos/${id}`, genero),
  
  delete: (id) => 
    apiClient.delete(`/generos/${id}`)
};

export const comentarioService = {
  getByJuego: (juegoId) => 
    apiClient.get(`/juegos/${juegoId}/comentarios`),
  
  create: (juegoId, comentario) => 
    apiClient.post(`/juegos/${juegoId}/comentarios`, comentario),
  
  delete: (comentarioId) => 
    apiClient.delete(`/comentarios/${comentarioId}`)
};

import gamerpowerService from './gamerpower';

export { gamerpowerService };
