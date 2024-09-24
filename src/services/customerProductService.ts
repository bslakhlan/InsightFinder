import llm_analysis_service from "./llmAnalysisServices/analysisService";
import scoutService from "services/scoutService";
import { data_points } from "@Constants/aiModelConstants";
import { Log } from "index";
class CustomerProductService {

    async getCustomerOrganisationData(domain: string) {
        if(false ){
            return "Data found in db";
        }
        else{
            //get domain
            try{
                const url = `https://${domain}`
                Log.info("Getting customer org's product data from scout...");

                const scout_data = await scoutService.getProductsData(url);
                Log.infoWithChannel('scout',scout_data,'The products data from the scout for the customer org: ')
                const customer_organization_info = scout_data[0];
                const customer_products_info = scout_data[1];

                Log.info('Finding product value analysis');

                const product_value_analysis = await llm_analysis_service.analyzeProductsData(customer_products_info);

                Log.info('Finding relative data points..');

                const relative_data_points = await llm_analysis_service.findRelativeDataPoints(customer_organization_info,customer_products_info, data_points, product_value_analysis);
                
                return [customer_organization_info,customer_products_info,relative_data_points,product_value_analysis];
            }catch(error){
                Log.error(error,'Error in getting data for Customer org.');
                throw error;
            }
        }
    }
}

export default new CustomerProductService();