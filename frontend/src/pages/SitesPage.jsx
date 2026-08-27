import { useCallback, useEffect, useState } from 'react';
import { ExternalLink, FileStack, Pencil } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EmptyState, ErrorState, LoadingState } from '../components/PageState.jsx';
import { PublishButton } from '../components/PublishButton.jsx';
import { api } from '../services/api.js';

export function SitesPage(){
  const[data,setData]=useState(null),[error,setError]=useState('');
  const load=useCallback(()=>{setError('');api('/sites').then(setData).catch(e=>setError(e.message));},[]);
  useEffect(load,[load]);
  const replaceSite=(updated)=>setData(current=>({...current,items:current.items.map(item=>item._id===updated._id?updated:item)}));
  return <div className="page"><div className="page-heading"><div><span className="eyebrow">Produção</span><h1>Sites</h1><p>Revise, personalize e publique os sites gerados.</p></div></div>{!data&&!error?<LoadingState/>:error?<ErrorState message={error} onRetry={load}/>:data.items.length?<div className="site-admin-grid">{data.items.map(site=><article className="site-admin-card" key={site._id}><div className={`site-card-cover site-card-cover--${site.templateId?.slug||'custom'}`}><FileStack/><span>{site.templateId?.name||'Template'}</span></div><div><span className={`site-status site-status--${site.status}`}>{site.status}</span><h2>{site.name}</h2><p>{site.companyId?.name} · {site.companyId?.segment}</p><div className="site-card-actions"><Link className="button button--secondary" to={`/sites/${site._id}`}><Pencil size={16}/>Editar</Link><Link className="button button--secondary" to={`/preview/${site.slug}`} target="_blank"><ExternalLink size={16}/>Ver</Link><PublishButton site={site} onPublished={replaceSite}/></div></div></article>)}</div>:<section className="panel"><EmptyState title="Nenhum site gerado" text="Abra uma empresa, faça a análise e use Gerar site com IA."/></section>}</div>;
}
