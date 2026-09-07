import axios from 'axios';

// En producción (nube) las API van a la misma URL.
// En desarrollo local van a localhost:3000.
const api = axios.create({
  baseURL: window.location.hostname === 'localhost' && window.location.port === '5173'
    ? 'http://localhost:3000/api'
    : '/api'
});

export default api;
