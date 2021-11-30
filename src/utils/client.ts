import axios from 'axios';

// const apiUrl = window.location.host.includes('localhost')
//   ? 'http://localhost:33330'
//   : process.env.REACT_APP_STARCOIN_POLL_API_URL;

// const baseURL = `${apiUrl}/poll`;

const apiUrl = process.env.REACT_APP_STARCOIN_POLL_API_URL;
const baseURL = `${apiUrl}/v1`;

const clientConfig = {
  baseURL,
  timeout: 120000, // 2 minutes, xhr status will be 'canceled'
  headers: {
    'Content-Type': 'application/json; charsett=UTF-8',
    accept: 'application/json',
  },
};

const successHandler = (result: any) => {
  const response = result.data;
  if (response.code !== undefined) {
    if (response.code === 'SUCCESS') {
      return response.data;
    }
    const reject = {
      code: response.code || 400,
      message: response.message || 'unknown errors',
    };
    return Promise.reject(reject);
  }
  return response;
};

const errorHandler = (error: any) => {
  const { response } = error;
  let reject;
  if (response) {
    reject = {
      code: response.data.code,
      message: response.data.message,
    };
  } else if (error.request) {
    reject = {
      code: 400,
      message: error.message || 'unknown errors',
    };
  } else {
    reject = {
      message: 'unknown errors',
    };
  }

  return Promise.reject(reject);
};

class Client {
  instance: any;

  constructor(config?: any) {
    if (!this.instance) {
      this.instance = axios.create({
        ...clientConfig,
        ...config,
      });
      this.instance.interceptors.response.use(successHandler, errorHandler);
    }
  }

  get(url: string, params?: any, option = {}) {
    const defaultOption = {
      url,
      params,
      method: 'GET',
    };
    return this.request(defaultOption, option);
  }

  post(url: string, data?: any, option = {}) {
    const defaultOption = {
      url,
      data,
      method: 'POST',
    };
    return this.request(defaultOption, option);
  }

  request(defaultOption?: any, option?: any) {
    return this.instance.request({ ...defaultOption, ...option });
  }
}

const client = new Client();

export default client;
