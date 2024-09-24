import { LLMService } from '@Interface/llmServiceInterface';
import makeApiCall from '@Utilities/apiUtils.js';
import { analyzeProductsprompt } from 'app/prompts/analyzeProductsPrompt';
import { pitchInsightsPrompt } from 'app/prompts/pitchInsightsPrompt';
import { relativeDataPointsPrompt } from 'app/prompts/relativeDataPointsPrompt';
import OpenAI from 'openai';
import environment from '@Config/environment';
import { OPENAI } from '@Constants/aiModelConstants';
import { Log } from 'index';
import { insightRatingPrompt } from 'app/prompts/insightRatingPrompt';

// analyzeProductsData(data: any, product_name: string);
//     findRelativeDataPointsPrompt(data: any);
//     findPitchInsights(data:any);
export class OpenAIService implements LLMService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: environment.OPENAI_API_KEY!,
    });
  }

  async findRelativeDataPoints(customer_organization_info:any, customer_products_info: any,data_points:any, product_value_analysis:any) {
    const prompt = relativeDataPointsPrompt(customer_organization_info, customer_products_info,data_points, product_value_analysis);
    try {
      const response = await makeApiCall({
        method: 'post',
        url: 'https://api.openai.com/v1/chat/completions',
        headers: {
          Authorization: `Bearer ${this.openai.apiKey}`,
          'Content-Type': 'application/json',
        },
        payload: {
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
          model: OPENAI.MODEL,
          response_format: { type: 'json_object' },
        },
      });

      return response.data.choices[0].message.content;
    } catch (error) {
      Log.error('Error in LLM while detecting the large website..')
      Log.errorWithChannel('LLM', { error: error, method: 'detectLargeWebsite' }, 'error detecting large website');
      throw error;
    }
  }
  async findPitchInsights(customer_organization_info: any , customer_products_info:any , propect_organization_info:any , relative_data_points:any ) {
    const prompt = pitchInsightsPrompt(customer_organization_info,customer_products_info,propect_organization_info, relative_data_points);

    try {
      const response = await makeApiCall({
        method: 'post',
        url: 'https://api.openai.com/v1/chat/completions',
        headers: {
          Authorization: `Bearer ${this.openai.apiKey}`,
          'Content-Type': 'application/json',
        },
        payload: {
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
          model: OPENAI.MODEL,
          response_format: { type: 'json_object' },
        },
      });

      if (!response.data || !response.data.choices || response.data.choices.length === 0) {
        throw new Error('Invalid response from OpenAI API');
      }

      return [response.data.choices[0].message.content, response.data.usage.prompt_tokens, response.data.usage.completion_tokens];
    } catch (error) {
      Log.error('Error in LLM while analyzing website data.')
      if (error instanceof Error) {
        Log.errorWithChannel('LLM', { error: error, method: 'analyzeWebsiteData' }, `Error making API call to LLM`);
      } else {
        Log.errorWithChannel('LLM', { error: error, method: 'analyzeWebsiteData' }, 'Unknown error making API call to LLM');
      }
      throw error;
    }
  }

  async analyzeProductsData(data: any): Promise<string> {
    const prompt = analyzeProductsprompt(JSON.stringify(data));

    try {
      const response = await makeApiCall({
        method: 'post',
        url: 'https://api.openai.com/v1/chat/completions',
        headers: {
          Authorization: `Bearer ${this.openai.apiKey}`,
          'Content-Type': 'application/json',
        },
        payload: {
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
          model: OPENAI.MODEL,
          response_format: { type: 'json_object' },
        },
      });

      return response.data.choices[0].message.content;
    } catch (error) {
      Log.error('Error in LLM while analyzing products data');
      Log.errorWithChannel('LLM', { error: error, method: 'analyzeProductsData' }, 'error processing products');
      throw error;
    }
  }
  async rateInsights(prospect_organization_info:any, product_value_analysis:any, relative_data_points:any, generated_insights:any): Promise<string> {
    const prompt = insightRatingPrompt(prospect_organization_info, product_value_analysis, relative_data_points,generated_insights);
    try {
      const response = await makeApiCall({
        method: 'post',
        url: 'https://api.openai.com/v1/chat/completions',
        headers: {
          Authorization: `Bearer ${this.openai.apiKey}`,
          'Content-Type': 'application/json',
        },
        payload: {
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
          model: OPENAI.MODEL,
          response_format: { type: 'json_object' },
        },
      });

      return response.data.choices[0].message.content;
    } catch (error) {
      Log.error('Error in LLM while analyzing products data');
      Log.errorWithChannel('LLM', { error: error, method: 'analyzeProductsData' }, 'error processing products');
      throw error;
    }
  }
}