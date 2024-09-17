import axios from 'axios';

function getToken() {
  return localStorage.getItem("token");
}
axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8';
axios.defaults.headers['Authorization'] = ''+ getToken();

 
const http = axios.create({
  baseURL: 'http://localhost:9090',
  timeout: 180000,
});


export default http;
