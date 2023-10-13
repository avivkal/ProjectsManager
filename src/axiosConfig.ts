import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://b5g8fh1rpi.execute-api.us-west-2.amazonaws.com/p'
});

export default instance;