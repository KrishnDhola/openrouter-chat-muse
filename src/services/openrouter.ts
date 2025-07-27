import { OpenRouterModel, OpenRouterResponse } from '@/types/chat';

const OPENROUTER_API_KEY = '';
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';

export const FREE_MODELS: OpenRouterModel[] = [
  { id: 'meta-llama/llama-4-maverick:free', name: 'Llama 4 Maverick Free' },
  { id: 'meta-llama/llama-4-scout:free', name: 'Llama 4 Scout Free' },
  { id: 'moonshotai/kimi-vl-a3b-thinking:free', name: 'Kimi VL A3B Thinking Free' },
  { id: 'nvidia/llama-3.1-nemotron-nano-8b-v1:free', name: 'Llama 3.1 Nemotron Nano 8B Free' },
  { id: 'google/gemini-2.5-pro-exp-03-25:free', name: 'Gemini 2.5 Pro Exp Free' },
  { id: 'mistralai/mistral-small-3.1-24b-instruct:free', name: 'Mistral Small 3.1 24B Free' },
  { id: 'openrouter/openrouter-optimus-alpha:free', name: 'OpenRouter Optimus Alpha Free' },
  { id: 'openrouter/openrouter-quasar-alpha:free', name: 'OpenRouter Quasar Alpha Free' },
  { id: 'deepseek/deepseek-v3-base:free', name: 'DeepSeek V3 Base Free' },
  { id: 'qwen/qwen2.5-vl-3b-instruct:free', name: 'Qwen 2.5 VL 3B Free' },
  { id: 'deepseek/deepseek-chat-v3-0324:free', name: 'DeepSeek Chat V3 Free' },
  { id: 'deepseek/deepseek-r1-zero:free', name: 'DeepSeek R1 Zero Free' },
  { id: 'nousresearch/deephermes-3-llama-3-8b-preview:free', name: 'DeepHermes 3 Llama 3 8B Free' },
  { id: 'arcee-ai/qwq-32b-arliai-rpr-v1:free', name: 'QwQ 32B ArliAI RPR V1 Free' },
  { id: 'cognitivecomputations/dolphin3.0-mistral-24b:free', name: 'Dolphin 3.0 Mistral 24B Free' },
  { id: 'cognitivecomputations/dolphin3.0-r1-mistral-24b:free', name: 'Dolphin 3.0 R1 Mistral 24B Free' },
  { id: 'deepseek/deepseek-chat:free', name: 'DeepSeek Chat Free' },
  { id: 'deepseek/deepseek-r1-0528:free', name: 'DeepSeek R1 0528 Free' },
  { id: 'deepseek/deepseek-r1-0528-qwen3-8b:free', name: 'DeepSeek R1 0528 Qwen3 8B Free' },
  { id: 'deepseek/deepseek-r1-distill-llama-70b:free', name: 'DeepSeek R1 Distill Llama 70B Free' },
  { id: 'deepseek/deepseek-r1-distill-qwen-14b:free', name: 'DeepSeek R1 Distill Qwen 14B Free' },
  { id: 'featherless/qwerky-72b:free', name: 'Qwerky 72B Free' },
  { id: 'google/gemini-2.0-flash-exp:free', name: 'Gemini 2.0 Flash Exp Free' },
  { id: 'qwen/qwen3-8b:free', name: 'Qwen 3 8B Free' },
  { id: 'rekaai/reka-flash-3:free', name: 'Reka Flash 3 Free' },
  { id: 'sarvamai/sarvam-m:free', name: 'Sarvam M Free' },
  { id: 'shisa-ai/shisa-v2-llama3.3-70b:free', name: 'Shisa V2 Llama 3.3 70B Free' },
  { id: 'thudm/glm-4-32b:free', name: 'GLM 4 32B Free' },
  { id: 'thudm/glm-z1-32b:free', name: 'GLM Z1 32B Free' },
  { id: 'tngtech/deepseek-r1t-chimera:free', name: 'DeepSeek R1T Chimera Free' },
];

export class OpenRouterService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = OPENROUTER_API_KEY;
    this.baseUrl = OPENROUTER_BASE_URL;
  }

  async sendMessage(
    messages: Array<{ role: string; content: string }>,
    model: string = 'deepseek/deepseek-chat:free'
  ): Promise<OpenRouterResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'OpenRouter Chat Muse',
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: 0.7,
          max_tokens: 2048,
          stream: false,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error?.message || 
          `HTTP ${response.status}: ${response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error('OpenRouter API Error:', error);
      throw error;
    }
  }

  async sendMessageStream(
    messages: Array<{ role: string; content: string }>,
    model: string = 'deepseek/deepseek-chat:free',
    onChunk: (chunk: string) => void
  ): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'OpenRouter Chat Muse',
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: 0.7,
          max_tokens: 2048,
          stream: true,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error?.message || 
          `HTTP ${response.status}: ${response.statusText}`
        );
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith('data: ')) {
            const data = trimmed.slice(6);
            if (data === '[DONE]') return;
            
            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                onChunk(content);
              }
            } catch (e) {
              // Ignore parse errors for SSE
            }
          }
        }
      }
    } catch (error) {
      console.error('OpenRouter Stream Error:', error);
      throw error;
    }
  }

  getModels(): OpenRouterModel[] {
    return FREE_MODELS;
  }
}

export const openRouterService = new OpenRouterService();
