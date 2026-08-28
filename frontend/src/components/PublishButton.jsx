import { Check, Copy, Rocket } from 'lucide-react';
import { useState } from 'react';
import { api } from '../services/api.js';

export function PublishButton({site,onPublished}){
  const[busy,setBusy]=useState(false),[copied,setCopied]=useState(false),[error,setError]=useState('');
  const copy=async(url)=>{try{await navigator.clipboard.writeText(url);setCopied(true);setTimeout(()=>setCopied(false),1800)}catch{setError('Abra o link e copie pela barra do navegador.')}};
  const publish=async()=>{setBusy(true);setError('');try{const result=await api(`/sites/${site._id}/deploy`,{method:'POST'});onPublished?.(result.site);await copy(result.deployment.productionUrl)}catch(e){setError(e.message)}finally{setBusy(false)}};
  return <div className="publish-control">{site.status==='publicado'&&site.productionUrl?<button className="button button--published" onClick={()=>copy(site.productionUrl)}>{copied?<Check size={16}/>:<Copy size={16}/>} {copied?'Link copiado':'Copiar site publicado'}</button>:<button className="button button--publish" onClick={publish} disabled={busy}><Rocket size={16}/>{busy?'Publicando...':'Publicar site'}</button>}{error&&<span>{error}</span>}</div>;
}
