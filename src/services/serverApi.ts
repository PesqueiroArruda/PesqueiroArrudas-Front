import axios from 'axios';

// const devUrl = 'http://localhost:8080';
// const prodUrl = process.env.API_URL;
const prodUrl = 'https://pesqueiroarruda-back.herokuapp.com';

export const serverApi = axios.create({
  baseURL: prodUrl,
});
