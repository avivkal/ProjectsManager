import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://djdq309mch.execute-api.us-west-2.amazonaws.com/d'
});

instance.interceptors.request.use(
  async (config) => {
    config.headers['Content-Type'] = `json`;
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


export default instance;