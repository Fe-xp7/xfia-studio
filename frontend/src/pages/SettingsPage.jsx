import { useEffect,useState } from 'react';
import { Bot,Cloud,Globe2,Save,Settings2 } from 'lucide-react';
import { ImageUploader } from '../components/ImageUploader.jsx';
import { useSettings } from '../contexts/SettingsContext.jsx';
import { api } from '../services/api.js';

const labels={mock:'Simulação gratuita',http:'Provedor HTTP',local:'Local',cloudinary:'Cloudinary'};
export function SettingsPage(){
  const{settings,integrations,refresh,setSettings}=useSettings();const[form,setForm]=useState(settings),[saving,setSaving]=useState(false),[error,setError]=useState(''),[saved,setSaved]=useState(false);
  useEffect(()=>setForm(settings),[settings]);
  const change=(key,value)=>{setSaved(false);setForm(current=>({...current,[key]:value}));};
  const submit=async event=>{event.preventDefault();setSaving(true);setError('');try{const data=await api('/settings',{method:'PUT',body:JSON.stringify({...form,defaultCreationFee:Number(form.defaultCreationFee),defaultMonthlyFee:Number(form.defaultMonthlyFee)})});setSettings(data.settings);setSaved(true);await refresh();}catch(e){setError(e.message)}finally{setSaving(false)}};
  const cards=[[Bot,'Inteligência artificial',integrations.ai],[Cloud,'Armazenamento de imagens',integrations.storage],[Globe2,'Publicação',integrations.publication]];
  return <div className="page page--narrow"><div className="page-heading"><div><span className="eyebrow">Administração</span><h1>Configurações</h1><p>Personalize a identidade e os valores usados pelo XFia Studio.</p></div></div>
    <form className="panel form" onSubmit={submit}>
      <section className="form-section"><div><h2>Identidade</h2><p>Nome e marca exibidos somente no seu painel interno.</p></div><div className="form-grid"><label>Nome do sistema<input required minLength="2" value={form.systemName||''} onChange={e=>change('systemName',e.target.value)}/></label><label>Nome da empresa<input required minLength="2" value={form.companyName||''} onChange={e=>change('companyName',e.target.value)}/></label><label className="span-2">URL do logo<input value={form.logoUrl||''} onChange={e=>change('logoUrl',e.target.value)} placeholder="https://..."/></label><div className="span-2"><ImageUploader label="Enviar novo logo" onUploaded={urls=>change('logoUrl',urls[0]||'')}/>{form.logoUrl&&<img className="settings-logo-preview" src={form.logoUrl} alt="Prévia do logo"/>}</div></div></section>
      <section className="form-section"><div><h2>Valores padrão</h2><p>Aplicados automaticamente ao transformar uma empresa em cliente.</p></div><div className="form-grid"><label>Valor de criação (R$)<input type="number" min="0" step="0.01" value={form.defaultCreationFee??500} onChange={e=>change('defaultCreationFee',e.target.value)}/></label><label>Mensalidade (R$)<input type="number" min="0" step="0.01" value={form.defaultMonthlyFee??50} onChange={e=>change('defaultMonthlyFee',e.target.value)}/></label></div></section>
      {error&&<div className="form-error form-error--wide">{error}</div>}<div className="form-actions"><span className="settings-saved">{saved?'Configurações salvas.':''}</span><button className="button button--primary" disabled={saving}><Save size={17}/>{saving?'Salvando...':'Salvar configurações'}</button></div>
    </form>
    <section className="settings-integrations"><div className="panel-heading"><div><h2>Integrações</h2><p>As credenciais continuam protegidas nas variáveis de ambiente do servidor.</p></div><Settings2/></div><div className="integration-grid">{cards.map(([Icon,title,item])=><article className="panel integration-card" key={title}><Icon/><div><small>{title}</small><strong>{labels[item?.provider]||item?.provider||'Não definido'}</strong></div><span className={item?.configured?'integration-ok':'integration-pending'}>{item?.configured?'Configurado':'Pendente'}</span></article>)}</div></section>
  </div>;
}
