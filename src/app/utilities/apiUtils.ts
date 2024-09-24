import axios, {  AxiosResponse } from 'axios';
import RequestOptions from '../../interfaces/apiInterface.js';
import { Log } from 'index.js';
async function makeApiCall(options: RequestOptions): Promise<AxiosResponse> {

    Log.infoWithChannel('api',{
        method: 'makeApiCall',
        requestDetails: {
            method: options.method,
            url: options.url,
            headers: options.headers,
            payload: options.payload
        }
    }, 'API request initiated');

    let response: AxiosResponse;

    if (options.method === 'post') {
        response = await axios.post(options.url, options.payload, {
            headers: options.headers
        });
    } else if (options.method === 'get') {
        response = await axios.get(options.url, {
            headers: options.headers,
            maxRedirects: options.maxRedirects,
            validateStatus: options.validateStatus
        });
    } else {
        throw new Error(`Unsupported request method: ${options.method}`);
    }

    Log.infoWithChannel('api',{
        method: 'makeApiCall',
        responseDetails: {
            status: response.status,
            statusText: response.statusText,
            headers: response.headers,
            data: response.data
        }
    }, 'API response received');
    
    return response;
}
export default makeApiCall;