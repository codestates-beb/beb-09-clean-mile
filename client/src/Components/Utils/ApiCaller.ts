import axios, { AxiosRequestConfig, Method } from 'axios';
import qs from 'qs';

const METHOD_GET: Method = 'get';
const METHOD_POST: Method = 'post';
const METHOD_PUT: Method = 'put';
const METHOD_DELETE: Method = 'delete';

interface Headers {
	'Content-Type'?: string;
	[header: string]: any;
}

function requestAPI(method: Method, url: string, _headers: Headers = {}, _dataBody?: any, isJSON: boolean = false): Promise<any> {
  const headers: Headers = _headers;
  let dataBody = _dataBody;

  if (isJSON) {
		headers['Content-Type'] = 'application/json';
  }
  // isJSON === true
  if (isJSON && (method === METHOD_POST || method === METHOD_PUT)) {
		headers['Content-Type'] = 'multipart/form-data';
		dataBody = dataBody;
  }
  // isJSON === false
  else if (method === METHOD_POST || method === METHOD_PUT) {
		headers['Content-Type'] = 'application/x-www-form-urlencoded';
		dataBody = qs.stringify(dataBody);
  }

  const config: AxiosRequestConfig = {
		url,
		headers,
		method,
		validateStatus: () => true
  }

  if (method === METHOD_GET) {
		config.params = dataBody;
  } else {
		config.data = dataBody;
  }

  return axios(config);
}

const ApiCaller = {
  get(url: string, dataBody?: any, isJSON: boolean = false, headers: Headers = {}): Promise<any> {
		return requestAPI(METHOD_GET, url, headers, dataBody, isJSON);
  },

  post(url: string, dataBody?: any, isJSON: boolean = false, headers: Headers = {}): Promise<any> {
		return requestAPI(METHOD_POST, url, headers, dataBody, isJSON);
  },

  update(url: string, dataBody?: any, isJSON: boolean = false, headers: Headers = {}): Promise<any> {
		return requestAPI(METHOD_PUT, url, headers, dataBody, isJSON);
  },

  delete(url: string, dataBody?: any, isJSON: boolean = false, headers: Headers = {}): Promise<any> {
		return requestAPI(METHOD_DELETE, url, headers, dataBody, isJSON);
  }
}

export { ApiCaller }