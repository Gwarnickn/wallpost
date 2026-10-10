import axios from 'axios';

const URL = import.meta.env.VITE_API_LINK;

const api = axios.create({
    method: "post",
    baseURL: URL,
})

export default api;  