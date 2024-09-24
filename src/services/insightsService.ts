import CustomerProductService from '@Services/customerProductService';
import llm_analysis_service from '@Services/llmAnalysisServices/analysisService';
import scoutService from './scoutService';
import { Log } from 'index';
// [customer_organization_info,customer_products_info,relative_data_points,prodcut_value_analysis];

class InsightsService{
    public async getInsights(customerOrgDomain, prospectOrgDomain){
        try{
            console.log(customerOrgDomain,  prospectOrgDomain);
            Log.info('inside the getInsights fumction..');
            console.log('Getting products data from scout for customer org')
            const products_data = await CustomerProductService.getCustomerOrganisationData(customerOrgDomain);
            const prospect_url = `https://${prospectOrgDomain}`;
            console.log('getting prospect org data from scout');
            const propect_organization_info = await scoutService.getOrganizationData(prospect_url);
            Log.infoWithChannel('elastic',JSON.stringify(propect_organization_info),'Scout data for prospect');
            console.log("finding insights from llm");
            const generated_insights = await llm_analysis_service.findPitchInsights(JSON.stringify(products_data[0]),JSON.stringify(products_data[1]),JSON.stringify(propect_organization_info), JSON.stringify(products_data[2]));
            console.log('Rating the generated insights ');
            const final_insights= await llm_analysis_service.rateInsights(JSON.stringify(propect_organization_info),products_data[3],products_data[2],generated_insights);
            Log.info(final_insights,"Final Insights after rating: ");
            console.log('FInding insights done');
            return final_insights;
        }catch(error){
            console.log("Error finding the insights: ",error);
        }
    }
}
export default new InsightsService();