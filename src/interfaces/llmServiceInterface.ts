export interface LLMService {
    analyzeProductsData(data: any);
    findRelativeDataPoints(customer_organization_info:any, customer_products_info: any,data_points:any, product_value_analysis:any);
    findPitchInsights(customer_organization_info: any , customer_products_info:any , propect_organization_info:any , relative_data_points:any ) ;
    rateInsights(prospect_organization_info:any, product_value_analysis:any, relative_data_points:any, generated_insights:any);
}