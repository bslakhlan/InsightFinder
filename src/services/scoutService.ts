import { getApiCalltoScout, postApiCalltoScout } from "@Utilities/scoutUtils";
import { Log } from "index";
class ScoutService{
    async getProductsData(url: string) {

        //Get products data from scout
        Log.info(url,"Getting req id for url : ")
        const payload = {
            url:url,
            force_refresh:false,
        }
        let response = await postApiCalltoScout(payload);
        const request_id = response.request_id;
        Log.info(request_id,"request id: ");

        response = await getApiCalltoScout(request_id);
        let customer_organization_info ;
        if (response.analysis_result.is_product_analysis_complete) {
            customer_organization_info = response.analysis_result;
        } else {
            Log.info('Analysis is not complete, retrying...');
            let retries = 5; 
            let waitTime = 15000; 

            while (retries > 0) {
                await new Promise(resolve => setTimeout(resolve, waitTime)); 
                // Retry the request
                const retry_response_data = await getApiCalltoScout(request_id);

                if (retry_response_data.analysis_result.is_product_analysis_complete) {
                    customer_organization_info = retry_response_data.analysis_result;
                    break; 
                }

                retries--; 
                Log.info(`Retrying... ${retries} attempts left.`);
            }

            if (retries === 0) {
                Log.error('Product Analysis did not complete in time.');
                throw new Error("Could not fetch products from scout in time");
            }
        }
        const customer_products_info = customer_organization_info.products;
        Log.infoWithChannel('scout',customer_products_info,'Scout products info...');

        if(customer_organization_info.analysis_result == 'success'){
            return [customer_organization_info,customer_products_info];
        }
        else{
            Log.error('Scout analysis resulted in failure');
            throw new Error("Scout analysis resulted in failure");
        }
    }

    async getOrganizationData(url: string) {
        Log.info(url,"Getting req id for url : ");
        const payload = {
            url:url,
            force_refresh:false,
        }
        const response = await postApiCalltoScout(payload);
        const request_id = response.request_id;
        Log.info(request_id,"request id: ");

        const response_data =await getApiCalltoScout(request_id);

        let customer_organization_info ;

        if (response_data.analysis_result.is_analysis_complete) {
            customer_organization_info = response_data.analysis_result;
        } else {
            Log.info('Scout Analysis is not yet complete, waiting...');
            let retries = 5; 
            let waitTime = 15000; 
            while (retries > 0) {
                await new Promise(resolve => setTimeout(resolve, waitTime)); 

                const retry_response_data = await getApiCalltoScout(request_id);

                if (retry_response_data.analysis_result.is_analysis_complete) {
                    customer_organization_info = retry_response_data.analysis_result;
                    break; 
                }

                retries--;
                Log.info(`Retrying... ${retries} attempts left.`);
            }

            if (retries === 0) {
                Log.error('Scout analysis resulted in failure');
                throw new Error("Scout analysis resulted in failure");
            }
        }
        return customer_organization_info;
    }
}

export default new ScoutService()