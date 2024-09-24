interface RequestOptions {
    method: 'get' | 'post';
    url: string;
    headers?: Record<string, string>;
    payload?: any; 
    maxRedirects?: number;
    validateStatus?: (status: number) => boolean;
}
export default RequestOptions;