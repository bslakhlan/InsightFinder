import { Anthropic } from '@anthropic-ai/sdk';
import { LLMService } from '@Interface/llmServiceInterface';
import { analyzeProductsprompt } from 'app/prompts/analyzeProductsPrompt';
import { pitchInsightsPrompt } from 'app/prompts/pitchInsightsPrompt';
import { relativeDataPointsPrompt } from 'app/prompts/relativeDataPointsPrompt';
import environment from '@Config/environment';
import { CLAUDE } from '@Constants/aiModelConstants';
import { Log } from 'index';
import { insightRatingPrompt } from 'app/prompts/insightRatingPrompt';

export class ClaudeService implements LLMService {
  private anthropic: Anthropic;
  constructor() {
    this.anthropic = new Anthropic({
      apiKey: environment.CLAUDE_API_KEY!,
    });
  }
  async findRelativeDataPoints(customer_organization_info:any, customer_products_info: any,data_points:any, product_value_analysis:any) {
    const prompt = relativeDataPointsPrompt(JSON.stringify(customer_organization_info), JSON.stringify(customer_products_info),JSON.stringify(data_points), JSON.stringify(product_value_analysis));
    Log.infoWithChannel('elastic',`Prompt for findRelativeDataPoints: ${prompt}`);
    console.log('Finding claude response for relative data points');
    let response;
    try{
      response = await this.anthropic.messages.create({
        model: CLAUDE.MODEL,
        max_tokens: CLAUDE.MAX_TOKENS,
        messages: [{ role: 'user', content: prompt }],
      });
    }catch(error){
      console.log('Error in fidn relative data points::',error)
    }
    Log.infoWithChannel('llm',response, 'response for findRelativeDataPoints');
    const json_string = JSON.stringify(response, null, 2);
    const json_data = JSON.parse(json_string);
    const result = json_data.content[0].text;
    return result;
  }

  async findPitchInsights(customer_organization_info: any , customer_products_info:any , propect_organization_info:any , relative_data_points:any ): Promise<String> {
    const prompt = pitchInsightsPrompt(customer_organization_info,customer_products_info,propect_organization_info, relative_data_points);

    const response = await this.anthropic.messages.create({
      model: CLAUDE.MODEL,
      max_tokens: CLAUDE.MAX_TOKENS,
      messages: [{ role: 'user', content: prompt }],
    });
    const json_string = JSON.stringify(response, null, 2);
    Log.infoWithChannel('llm',response, 'response for findPitchInsight');
    const json_data = JSON.parse(json_string);
    const result = json_data.content[0].text;
    return result;
  }

  async analyzeProductsData(data: any): Promise<string> {
    const prompt = analyzeProductsprompt(JSON.stringify(data));

    const response = await this.anthropic.messages.create({
      model: CLAUDE.MODEL,
      max_tokens: CLAUDE.MAX_TOKENS,
      messages: [{ role: 'user', content: prompt }],
    });
    const json_string = JSON.stringify(response, null, 2);
    Log.infoWithChannel('llm',response, 'response for analyzeproductsdata');
    const json_data = JSON.parse(json_string);
    return json_data.content[0].text;
  }

  async rateInsights(prospect_organization_info: any, product_value_analysis: any, relative_data_points: any, generated_insights: any) {
      const prompt = insightRatingPrompt(prospect_organization_info, product_value_analysis, relative_data_points, generated_insights);
      const response = await this.anthropic.messages.create({
        model: CLAUDE.MODEL,
        max_tokens: CLAUDE.MAX_TOKENS,
        messages: [{ role: 'user', content: prompt }],
      });
      const json_string = JSON.stringify(response, null, 2);
      Log.infoWithChannel('llm',response, 'response for analyzeproductsdata');
      const json_data = JSON.parse(json_string);
      return json_data.content[0].text;
  }
}