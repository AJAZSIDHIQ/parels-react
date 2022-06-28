import axios from "axios";

export default axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? 'http://143.110.248.249:5000/' : 'http://localhost:8080/' ,
  headers: {
    "Content-type": "application/json"
  }
});
