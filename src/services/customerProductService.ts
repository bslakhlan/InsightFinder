import llm_analysis_service from "./llmAnalysisServices/analysisService";
import scoutService from "services/scoutService";
import { data_points } from "@Constants/aiModelConstants";
import { Log } from "index";
class CustomerProductService {

    // private checkProductsExist(workspace_id: string):boolean{
    //     console.log('Check in db for: ', workspace_id);
    //     return false;
    // }

    async getCustomerOrganisationData(domain: string) {
        console.log("inside getCustomerOrgdata")
        if(false ){
            return "Data found in db"
        }
        else{
            //get domain
            console.log("inside getCustomerOrgdata else")
            const url = `https://${domain}`
            console.log("Trying with scout..")
            const scout_data = await scoutService.getProductsData(url);
            Log.infoWithChannel('elastic',scout_data,'The data from the scout: ')
            const customer_organization_info = scout_data[0];
            const customer_products_info = scout_data[1];

            //Use LLM to get pain points
            Log.info('Finding product value analysis....');
            const product_value_analysis = await llm_analysis_service.analyzeProductsData(customer_products_info);
            Log.infoWithChannel('llm',product_value_analysis, 'Pain points from the llm: ');
            //Use LLM to get relative data points
            Log.info('Finding relative data points..');
            let relative_data_points;
            try{
                relative_data_points = await llm_analysis_service.findRelativeDataPoints(customer_organization_info,customer_products_info, data_points, product_value_analysis);
                Log.infoWithChannel('llm',relative_data_points,'Relative data point from the lLm: ')
            }catch(error){
                console.log('Error in finding rlative dta pnts: ',error);
            }
            
            // Store these into db
            return [customer_organization_info,customer_products_info,relative_data_points,product_value_analysis];
        }
    }
}

export default new CustomerProductService();