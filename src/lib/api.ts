import axios from 'axios';

export default axios.create({
  baseURL: 'https://api.fifa.com/api/v3',
});

export const statsApi = axios.create({
  baseURL: 'https://fdh-api.fifa.com',
});
