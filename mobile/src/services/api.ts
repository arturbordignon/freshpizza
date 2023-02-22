import axios from "axios";

const api = axios.create({
  // baseURL: 'http://localhost:3333',
  baseURL: "http://(Type your IP to work):3333",
});

export { api };
