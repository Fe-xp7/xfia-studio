import { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowDown, ArrowLeft, ArrowUp, Eye, EyeOff, ExternalLink, GripVertical, Moon, Save, Sun } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { ErrorState, LoadingState } from '../components/PageState.jsx';
import { SiteRenderer } from '../components/site/SiteRenderer.jsx';
import { api } from '../services/api.js';
import { ImageUploader } from '../components/ImageUploader.jsx';

const sections=[['hero','Hero'],['about','Sobre'],['services','Serviços'],['gallery','Galeria'],['differentiators','Diferenciais'],['cta','CTA'],['location','Localização'],['hours','Horário'],['contact','Contato'],['seo','SEO'],['theme','Tema e cores']];
const orderableSections=['hero','about','services','gallery','differentiators','cta','contact'];
const textFields={
  hero:[['eyebrow','Chamada curta'],['title','Título'],['subtitle','Subtítulo'],['image','URL da imagem principal'],['ctaLabel','Texto do botão'],['ctaLink','Link do botão']],
  about:[['title','Título'],['text','Texto']], cta:[['title','Título'],['text','Texto'],['buttonLabel','Texto do botão'],['buttonLink','Link do botão']],
  location:[['title','Título'],['address','Endereço'],['mapsUrl','Link do mapa']], hours:[['title','Título'],['text','Horário']],
  contact:[['phone','Telefone'],['whatsapp','WhatsApp'],['instagram','Instagram']], seo:[['title','Título da página'],['metaDescription','Meta description']],
};
const asText=(value)=>typeof value==='string'?value:value==null?'':String(value);
const asList=(value)=>Array.isArray(value)?value:[];

export function SiteEditorPage(){
  const{id}=useParams();
  const[site,setSite]=useState(null),[templates,setTemplates]=useState([]),[selected,setSelected]=useState('hero'),[error,setError]=useState(''),[saving,setSaving]=useState(false),[saved,setSaved]=useState(false);
  const load=useCallback(()=>{setError('');Promise.all([api(`/sites/${id}`),api('/templates')]).then(([item,list])=>{setSite(item);setTemplates(asList(list?.items))}).catch(e=>setError(e.message));},[id]);
  useEffect(load,[load]);
  const content=site?.content||{};
  const sectionOrder=useMemo(()=>{const saved=asList(content.sectionOrder).filter(key=>orderableSections.includes(key));return[...new Set([...saved,...orderableSections])];},[content.sectionOrder]);
  const hiddenSections=useMemo(()=>asList(content.hiddenSections).filter(key=>orderableSections.includes(key)&&key!=='hero'),[content.hiddenSections]);
  const sectionData=useMemo(()=>selected==='seo'?site?.seo||{}:content[selected]||{},[content,selected,site?.seo]);
  const mark=(next)=>{setSaved(false);setSite(next)};
  const updateSection=(key,value)=>selected==='seo'?mark({...site,seo:{...site.seo,[key]:value}}):mark({...site,content:{...content,[selected]:{...content[selected],[key]:value}}});
  const updateLines=(key,value)=>mark({...site,content:{...content,[key]:value.split('\n').filter(Boolean).map(line=>{const[title,...description]=line.split('|');return{title:title.trim(),description:description.join('|').trim()}})}});
  const updateGallery=(value)=>mark({...site,content:{...content,gallery:{...content.gallery,images:value.split('\n').map(item=>item.trim()).filter(Boolean)}}});
  const updateTheme=(patch)=>mark({...site,theme:{...site.theme,...patch}});
  const moveSection=(key,direction)=>{const index=sectionOrder.indexOf(key),target=index+direction;if(index<0||target<0||target>=sectionOrder.length)return;const next=[...sectionOrder];[next[index],next[target]]=[next[target],next[index]];mark({...site,content:{...content,sectionOrder:next}})};
  const toggleSection=(key)=>{if(key==='hero')return;const next=hiddenSections.includes(key)?hiddenSections.filter(item=>item!==key):[...hiddenSections,key];mark({...site,content:{...content,hiddenSections:next}})};
  const save=async()=>{setSaving(true);setError('');try{const result=await api(`/sites/${id}`,{method:'PUT',body:JSON.stringify({name:site.name,slug:site.slug,templateId:site.templateId?._id||site.templateId,content:site.content,theme:site.theme,seo:site.seo,status:site.status})});setSite(result);setSaved(true)}catch(e){setError(e.message)}finally{setSaving(false)}};
  if(!site&&!error)return <LoadingState/>;
  if(error&&!site)return <ErrorState message={error} onRetry={load}/>;
  const fields=textFields[selected]||[];
  const labels=Object.fromEntries(sections);
  const structure=[...sectionOrder.map(key=>[key,labels[key]]),['location',labels.location],['hours',labels.hours],['seo',labels.seo],['theme',labels.theme]];
  return <div className="editor-page"><header className="editor-topbar"><Link to="/sites" className="icon-button"><ArrowLeft/></Link><div><strong>{site.name}</strong><span>{saved?'Alterações salvas':'Editor visual'}</span></div><label>Template<select value={site.templateId?._id||site.templateId} onChange={e=>{const template=templates.find(t=>t._id===e.target.value);mark({...site,templateId:template})}}>{templates.map(t=><option key={t._id} value={t._id}>{t.name}</option>)}</select></label><Link className="button button--secondary" to={`/preview/${site.slug}`} target="_blank"><ExternalLink size={17}/>Visualizar site</Link><button className="button button--primary" onClick={save} disabled={saving}><Save size={17}/>{saving?'Salvando...':'Salvar'}</button></header><div className="editor-shell"><aside className="editor-structure"><span className="editor-label">Estrutura</span>{structure.map(([key,label])=>{const hidden=hiddenSections.includes(key);return <div className={`structure-row ${selected===key?'active':''} ${hidden?'structure-row--hidden':''}`} key={key}><button onClick={()=>setSelected(key)}><GripVertical/>{label}</button>{orderableSections.includes(key)&&<span><button title={key==='hero'?'O Hero é obrigatório':hidden?'Mostrar seção':'Ocultar seção'} disabled={key==='hero'} onClick={()=>toggleSection(key)}>{hidden?<EyeOff/>:<Eye/>}</button><button title="Mover para cima" disabled={sectionOrder.indexOf(key)===0} onClick={()=>moveSection(key,-1)}><ArrowUp/></button><button title="Mover para baixo" disabled={sectionOrder.indexOf(key)===sectionOrder.length-1} onClick={()=>moveSection(key,1)}><ArrowDown/></button></span>}</div>})}</aside><main className="editor-preview"><div className="preview-browser"><div><i/><i/><i/><span>/preview/{site.slug}</span></div><section><SiteRenderer site={site} editor/></section></div></main><aside className="editor-properties"><span className="editor-label">Propriedades</span><h2>{sections.find(([key])=>key===selected)?.[1]}</h2>{hiddenSections.includes(selected)&&<div className="section-hidden-notice"><EyeOff/>Esta seção está oculta no site.</div>}{error&&<div className="form-error">{error}</div>}
    {selected==='theme'?<><div className="theme-choice"><button className={(site.theme?.mode||'light')==='light'?'active':''} onClick={()=>updateTheme({mode:'light'})}><Sun/>Claro</button><button className={site.theme?.mode==='dark'?'active':''} onClick={()=>updateTheme({mode:'dark'})}><Moon/>Escuro</button></div><label>Cor principal<input type="color" value={site.theme?.colors?.[0]||'#4f46e5'} onChange={e=>updateTheme({colors:[e.target.value,...(site.theme?.colors||[]).slice(1)]})}/></label><label>Cor secundária<input type="color" value={site.theme?.colors?.[1]||'#111827'} onChange={e=>updateTheme({colors:[site.theme?.colors?.[0]||'#4f46e5',e.target.value,...(site.theme?.colors||[]).slice(2)]})}/></label></>
    :selected==='services'||selected==='differentiators'?<label>Um item por linha<br/><small>Título | descrição</small><textarea rows="13" value={asList(content[selected]).filter(Boolean).map(x=>`${asText(x?.title)} | ${asText(x?.description)}`).join('\n')} onChange={e=>updateLines(selected,e.target.value)}/></label>
    :selected==='gallery'?<><label>Título da galeria<input value={asText(content.gallery?.title)} onChange={e=>updateSection('title',e.target.value)}/></label><ImageUploader multiple label="Enviar imagens para galeria" onUploaded={urls=>mark({...site,content:{...content,gallery:{...content.gallery,images:[...asList(content.gallery?.images),...urls]}}})}/><label>Imagens da galeria<br/><small>Uma URL por linha; remova uma linha para excluir</small><textarea rows="11" value={asList(content.gallery?.images).map(asText).join('\n')} onChange={e=>updateGallery(e.target.value)}/></label></>
    :<>{fields.map(([key,label])=><label key={key}>{label}{key==='text'||key==='subtitle'||key==='metaDescription'?<textarea rows="5" value={asText(sectionData[key])} onChange={e=>updateSection(key,e.target.value)}/>:<input placeholder={key==='image'?'https://exemplo.com/foto.jpg':''} value={asText(sectionData[key])} onChange={e=>updateSection(key,e.target.value)}/>}</label>)}{selected==='hero'&&<ImageUploader label="Enviar imagem principal" onUploaded={urls=>updateSection('image',urls[0])}/>}</>}</aside></div></div>;
}
