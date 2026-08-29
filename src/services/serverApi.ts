import axios from 'axios';

// const prodUrl = 'http://localhost:8080';
// const prodUrl = process.env.API_URL;
const prodUrl = 'https://web-production-8cfce.up.railway.app';

export const serverApi = axios.create({
  baseURL: prodUrl,
});
