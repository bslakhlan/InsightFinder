import { LLMService } from '@Interface/llmServiceInterface';
import { OpenAIService } from 'services/llmAnalysisServices/openaiService';
import { ClaudeService } from 'services/llmAnalysisServices/claudeService'
import { LLM_MODEL, LLM_Model_Type } from '@Constants/aiModelConstants';


export function getService(): LLMService {
    switch (LLM_MODEL as LLM_Model_Type) {
      case 'openai':
        return new OpenAIService();
      case 'claude':
        return new ClaudeService();
      default:
        throw new Error('Invalid LLM model specified');
    }
}