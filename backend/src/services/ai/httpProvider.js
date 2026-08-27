import { AppError } from '../../utils/AppError.js';

function extractJson(value) {
  const text = value.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  try { return JSON.parse(text); } catch { throw new AppError('O provedor de IA retornou um formato inválido.', 502); }
}

export class HttpAIProvider {
  constructor({ apiUrl, apiKey, model }) { this.apiUrl=apiUrl; this.apiKey=apiKey; this.model=model; }
  async complete(prompt) {
    if (!this.apiUrl || !this.apiKey || !this.model) throw new AppError('Configure AI_API_URL, AI_API_KEY e AI_MODEL.', 503);
    const response=await fetch(this.apiUrl,{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${this.apiKey}`},body:JSON.stringify({model:this.model,messages:[{role:'system',content:'Você é um estrategista de sites. Retorne somente JSON válido.'},{role:'user',content:prompt}],temperature:0.4})});
    const data=await response.json().catch(()=>({}));
    if(!response.ok) throw new AppError(data.error?.message||'O provedor de IA não respondeu corretamente.',502);
    const content=data.choices?.[0]?.message?.content;
    if(!content) throw new AppError('O provedor de IA retornou uma resposta vazia.',502);
    return extractJson(content);
  }
  analyze(_company,_templates,prompt){return this.complete(prompt);}
  generateContent(_company,_analysis,prompt){return this.complete(prompt);}
}
