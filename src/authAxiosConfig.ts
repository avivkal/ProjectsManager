import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://b5g8fh1rpi.execute-api.us-west-2.amazonaws.com/p'
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