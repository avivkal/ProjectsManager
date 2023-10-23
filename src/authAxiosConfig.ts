import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://2d9im2s1u0.execute-api.il-central-1.amazonaws.com/p'
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