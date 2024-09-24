import { getService } from '@Config/llmFactorConfig';
import { LLMService } from '@Interface/llmServiceInterface';

class LLMAnalysisService{
  private llmService: LLMService;

  constructor() {
    this.llmService = getService();
  }

  async analyzeProductsData(products_data: any){
    const response = await this.llmService.analyzeProductsData(products_data);
    const jsonData = JSON.parse(response);
    return jsonData;
  }

  async findRelativeDataPoints(customer_organization_info:any, customer_products_info: any,data_points:any, product_value_analysis:any){
    const response = await this.llmService.findRelativeDataPoints(customer_organization_info,customer_products_info,data_points,product_value_analysis);
    const jsonData = JSON.parse(response);
    return jsonData;
  }

  async findPitchInsights(customer_organization_info: any , customer_products_info:any , propect_organization_info:any , relative_data_points:any ) {
    const response = await this.llmService.findPitchInsights(customer_organization_info,customer_products_info,propect_organization_info,relative_data_points);
    const jsonData = JSON.parse(response);
    return jsonData;
  }
  async rateInsights(prospect_organization_info: any, product_value_analysis: any, relative_data_points: any, generated_insights: any) {
    const response = await this.llmService.rateInsights(prospect_organization_info, product_value_analysis, relative_data_points, generated_insights);
    const json_data = JSON.parse(response);
    return json_data;
  }

}

export default new LLMAnalysisService();