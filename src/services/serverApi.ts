import axios from 'axios';
import { API_URL } from './apiConfig';

export const serverApi = axios.create({
  baseURL: API_URL,
});
