import makeApiCall from "@Utilities/apiUtils";
import { Log } from "index";
class ScoutService{
    async getProductsData(url: string) {
        //Get products data from scout
        console.log("Getting req id for url : ",url)
        const payload = {
            url:url,
            force_refresh:false,
        }
        const response = await makeApiCall({
            method: 'post',
            url:'http://206.189.132.177:3000/api/request',
            payload: payload,
            maxRedirects: 0,
            validateStatus: (status) => status >= 200 && status < 400
        });
        Log.infoWithChannel('SQS',response,"response from Scout");
        const request_id = response.data.request_id;
        
        console.log("request id: ", request_id);
        const response_data =await makeApiCall({
            method: 'get',
            url:`http://206.189.132.177:3000/api/request/${request_id}`,
            maxRedirects: 0,
            validateStatus: (status) => status >= 200 && status < 400
        });
        let customer_organization_info ;

        // Check if analysis is complete
        if (response_data.data.analysis_result.is_product_analysis_complete) {
            Log.info(response_data.data,'Analysis Found');
            customer_organization_info = response_data.data.analysis_result;
        } else {
            // Handle waiting for analysis to complete
            console.log('Retryin because analysis not complete');
            Log.info('Analysis is not complete, waiting...');
            let retries = 5; // Number of retries
            let waitTime = 15000; // Wait time in milliseconds

            while (retries > 0) {
                await new Promise(resolve => setTimeout(resolve, waitTime)); // Wait
                // Retry the request
                const retry_response_data = await makeApiCall({
                    method: 'get',
                    url: `http://206.189.132.177:3000/api/request/${request_id}`,
                    payload: payload,
                    maxRedirects: 0,
                    validateStatus: (status) => status >= 200 && status < 400,
                });

                if (retry_response_data.data.analysis_result.is_product_analysis_complete) {
                    Log.info(retry_response_data.data,'Analysis Found');
                    customer_organization_info = retry_response_data.data.analysis_result;
                    break; // Exit loop if analysis is complete
                }

                retries--; // Decrement retries
                Log.info(`Retrying... ${retries} attempts left.`);
            }

            if (retries === 0) {
                console.log('Product Analysis did not complete in time.');
                return {};
            }
        }
        const customer_products_info = customer_organization_info.products;
        Log.info(customer_products_info,'Scout products info...');
        if(customer_organization_info.analysis_result == 'success'){
            return [customer_organization_info,customer_products_info];
        }
        else{
            Log.error('Scout analysis resulted in failure');
            return {};
        }
    }

    async getOrganizationData(url: string) {
        //Get products data from scout
        console.log("Getting req id for url : ",url)
        const payload = {
            url:url,
            force_refresh:false,
        }
        
        const response = await makeApiCall({
            method: 'post',
            url:'http://206.189.132.177:3000/api/request',
            payload: payload,
            maxRedirects: 0,
            validateStatus: (status) => status >= 200 && status < 400
        });
        Log.infoWithChannel('SQS',response,"response from Scout");
        const request_id = response.data.request_id;
        
        console.log("request id: ", request_id);

        const response_data =await makeApiCall({
            method: 'get',
            url:`http://206.189.132.177:3000/api/request/${request_id}`,
            payload: payload,
            maxRedirects: 0,
            validateStatus: (status) => status >= 200 && status < 400,
        });

        let customer_organization_info ;
        // Check if analysis is complete
        if (response_data.data.analysis_result.is_analysis_complete) {
            customer_organization_info = response_data.data.analysis_result;
        } else {
            // Handle waiting for analysis to complete
            Log.info('Analysis is not complete, waiting...');
            let retries = 5; // Number of retries
            let waitTime = 15000; // Wait time in milliseconds
            while (retries > 0) {
                await new Promise(resolve => setTimeout(resolve, waitTime)); // Wait

                // Retry the request
                const retry_response_data = await makeApiCall({
                    method: 'get',
                    url: `http://206.189.132.177:3000/api/request/${request_id}`,
                    payload: payload,
                    maxRedirects: 0,
                    validateStatus: (status) => status >= 200 && status < 400,
                });

                if (retry_response_data.data.analysis_result.is_analysis_complete) {
                    customer_organization_info = retry_response_data.data.analysis_result;
                    break; // Exit loop if analysis is complete
                }

                retries--; // Decrement retries
                Log.info(`Retrying... ${retries} attempts left.`);
            }

            if (retries === 0) {
                console.log('Analysis did not complete in time.');
                return {};
            }
        }

        return customer_organization_info;
    }
}

export default new ScoutService()