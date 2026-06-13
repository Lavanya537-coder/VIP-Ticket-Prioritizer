import axios from "axios";

const API = axios.create({
baseURL: "https://vip-ticket-prioritizer.onrender.com"
});

export default API;
