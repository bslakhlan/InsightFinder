import makeApiCall from "./apiUtils";

async function getApiCalltoScout(request_id: string) {
    const response =await makeApiCall({
        method: 'get',
        url:`http://206.189.132.177:3000/api/request/${request_id}`,
        maxRedirects: 0,
        validateStatus: (status) => status >= 200 && status < 400
    });
    return response.data;
}

async function postApiCalltoScout(payload: any){
    const response = await makeApiCall({
        method: 'post',
        url:'http://206.189.132.177:3000/api/request',
        payload: payload,
        maxRedirects: 0,
        validateStatus: (status) => status >= 200 && status < 400
    });
    return response.data;
}

export {postApiCalltoScout, getApiCalltoScout};