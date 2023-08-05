import axios, { AxiosRequestConfig, Method } from 'axios';
import qs from 'qs';

const METHOD_GET: Method = 'get';
const METHOD_POST: Method = 'post';
const METHOD_PATCH: Method = 'patch';
const METHOD_DELETE: Method = 'delete';

interface Headers {
	'Content-Type'?: string;
	[header: string]: any;
}

function requestAPI(method: Method, url: string, _headers: Headers = {}, _dataBody?: any, isJSON: boolean = false, isCookie: boolean = false): Promise<any> {
  const headers: Headers = _headers;
  let dataBody = _dataBody;

  if (isJSON) {
		headers['Content-Type'] = 'application/json';
  }
  // isJSON === false
  if (!isJSON && (method === METHOD_POST || method === METHOD_PATCH)) {
		headers['Content-Type'] = 'multipart/form-data';
		dataBody = dataBody;
  }

  const config: AxiosRequestConfig = {
		url,
		headers,
		method,
		validateStatus: () => true
  }

  // if isCookie is true, set withCredentials to true
  if (isCookie) {
    config.withCredentials = true;
  }

  if (method === METHOD_GET) {
		config.params = dataBody;
  } else {
		config.data = dataBody;
  }

  return axios(config);
}

const ApiCaller = {
  get(url: string, dataBody?: any, isJSON: boolean = false, headers: Headers = {}, isCookie: boolean = false): Promise<any> {
		return requestAPI(METHOD_GET, url, headers, dataBody, isJSON, isCookie);
  },

  post(url: string, dataBody?: any, isJSON: boolean = false, headers: Headers = {}, isCookie: boolean = false): Promise<any> {
		return requestAPI(METHOD_POST, url, headers, dataBody, isJSON, isCookie);
  },

  patch(url: string, dataBody?: any, isJSON: boolean = false, headers: Headers = {}, isCookie: boolean = false): Promise<any> {
		return requestAPI(METHOD_PATCH, url, headers, dataBody, isJSON, isCookie);
  },

  delete(url: string, dataBody?: any, isJSON: boolean = false, headers: Headers = {}, isCookie: boolean = false): Promise<any> {
		return requestAPI(METHOD_DELETE, url, headers, dataBody, isJSON, isCookie);
  }
}

export { ApiCaller }