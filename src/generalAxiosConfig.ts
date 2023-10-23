import axios from 'axios';
import { Auth } from 'aws-amplify';

const instance = axios.create({
  baseURL: 'https://fzl7xxummb.execute-api.il-central-1.amazonaws.com/p'
});

instance.interceptors.request.use(
  async (config) => {
    const session = await Auth.currentSession();
    const accessToken = session.getAccessToken().getJwtToken();

    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }

    config.headers['Content-Type'] = `json`;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;