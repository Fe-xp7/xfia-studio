import { useCallback, useEffect, useState } from 'react';
import { ArrowLeft, Edit3, MapPin, MessageCircle, Phone } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { AIAnalysisPanel } from '../components/AIAnalysisPanel.jsx';
import { ErrorState, LoadingState } from '../components/PageState.jsx';
import { StatusBadge } from '../components/StatusBadge.jsx';
import { api } from '../services/api.js';

export function CompanyDetailPage() {
  const { id }=useParams(); const [company,setCompany]=useState(null),[error,setError]=useState('');
  const load=useCallback(()=>{setError('');api(`/companies/${id}`).then(setCompany).catch(e=>setError(e.message));},[id]);
  useEffect(load,[load]);
  if(!company&&!error)return <LoadingState/>;
  if(error)return <ErrorState message={error} onRetry={load}/>;
  return <div className="page page--narrow"><div className="page-heading"><div><Link className="back-link" to="/empresas"><ArrowLeft size={16}/>Empresas</Link><div className="title-with-status"><h1>{company.name}</h1><StatusBadge status={company.status}/></div><p>{company.segment}{company.city?` · ${company.city}${company.state?`/${company.state}`:''}`:''}</p></div><Link className="button button--secondary" to={`/empresas/${company._id}/editar`}><Edit3 size={17}/>Editar dados</Link></div><section className="company-overview"><article><span>Potencial atual</span><strong>{company.potential}<small>/100</small></strong></article><article><span>Contato</span><div>{company.whatsapp&&<span><MessageCircle/>{company.whatsapp}</span>}{company.phone&&<span><Phone/>{company.phone}</span>}{!company.whatsapp&&!company.phone&&'Não informado'}</div></article><article><span>Localização</span><div>{company.city?<span><MapPin/>{[company.city,company.state].filter(Boolean).join(' / ')}</span>:'Não informada'}</div></article></section><AIAnalysisPanel company={company} onCompanyChange={setCompany}/>{company.description&&<section className="panel detail-panel"><span className="eyebrow">Sobre a oportunidade</span><p>{company.description}</p></section>}</div>;
}
