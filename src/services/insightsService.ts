import CustomerProductService from '@Services/customerProductService';
import llm_analysis_service from '@Services/llmAnalysisServices/analysisService';
import scoutService from './scoutService';
import { Log } from 'index';

class InsightsService{
    public async getInsights(customerOrgDomain, prospectOrgDomain){
        try{
            Log.info('Getting products data from scout for customer org');

            const products_data = await CustomerProductService.getCustomerOrganisationData(customerOrgDomain);

            const prospect_url = `https://${prospectOrgDomain}`;
            Log.info('getting prospect org data from scout');

            const propect_organization_info = await scoutService.getOrganizationData(prospect_url);
            Log.infoWithChannel('scout',JSON.stringify(propect_organization_info),'Scout data for prospect');

            Log.info("finding insights from llm");

            const generated_insights = await llm_analysis_service.findPitchInsights(JSON.stringify(products_data[0]),JSON.stringify(products_data[1]),JSON.stringify(propect_organization_info), JSON.stringify(products_data[2]));
            
            Log.info('Rating the generated insights ');
            const final_insights= await llm_analysis_service.rateInsights(JSON.stringify(propect_organization_info),JSON.stringify(products_data[3]),JSON.stringify(products_data[2]),JSON.stringify(generated_insights));
            
            Log.info(final_insights,"Final Insights after rating: ");
            return final_insights;
        }catch(error){
            Log.error(error,"Error finding the insights: ");
            throw error;
        }
    }
}
export default new InsightsService();