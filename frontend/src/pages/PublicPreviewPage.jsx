import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ErrorState, LoadingState } from '../components/PageState.jsx';
import { SiteRenderer } from '../components/site/SiteRenderer.jsx';
import { api } from '../services/api.js';
export function PublicPreviewPage(){const{slug}=useParams();const[site,setSite]=useState(null),[error,setError]=useState('');useEffect(()=>{api(`/preview/${slug}`).then(data=>{setSite(data);document.title=data.seo?.title||data.name}).catch(e=>setError(e.message))},[slug]);if(!site&&!error)return <LoadingState/>;if(error)return <ErrorState message={error}/>;return <SiteRenderer site={site}/>}
