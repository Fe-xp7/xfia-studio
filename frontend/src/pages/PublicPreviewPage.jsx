import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ErrorState, LoadingState } from '../components/PageState.jsx';
import { SiteRenderer } from '../components/site/SiteRenderer.jsx';
import { api } from '../services/api.js';
export function PublicPreviewPage({hostname='',published=false}){const{slug}=useParams();const[site,setSite]=useState(null),[error,setError]=useState('');useEffect(()=>{const path=hostname?`/public/sites/resolve?hostname=${encodeURIComponent(hostname)}`:published?`/public/published-sites/${encodeURIComponent(slug)}`:`/preview/${slug}`;api(path,{cache:'no-store'}).then(data=>{setSite(data);document.title=data.seo?.title||data.name}).catch(e=>setError(e.message))},[slug,hostname,published]);if(!site&&!error)return <LoadingState/>;if(error)return <ErrorState message={error}/>;if(site.status==='suspenso')return <main className="suspended-site"><div><span>XFia Tech</span><h1>Site temporariamente indisponível.</h1><p>O responsável pode acessar o painel para regularizar o serviço.</p></div></main>;return <SiteRenderer site={site}/>}
