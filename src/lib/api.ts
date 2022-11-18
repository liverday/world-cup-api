import axios from 'axios';

export default axios.create({
  baseURL: 'https://api.fifa.com/api/v3',
});
