import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    (import.meta.env.DEV
      ? "http://localhost:3000"
      : "https://worksync-xj7r.onrender.com"),
});

export default api;
