// src/api/axios.js
import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8000/api", // استبدل بعنوان API الخاص بك
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;
