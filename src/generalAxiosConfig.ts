import axios from 'axios';
import { Auth } from 'aws-amplify';

const instance = axios.create({
  baseURL: 'https://zm6wrh6pzh.execute-api.us-west-2.amazonaws.com/p'
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