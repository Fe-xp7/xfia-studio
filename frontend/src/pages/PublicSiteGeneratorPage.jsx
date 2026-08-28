import { useEffect, useRef, useState } from 'react';
import { ArrowRight, CheckCircle2, ExternalLink, ImagePlus, LoaderCircle, RotateCcw, Sparkles, X } from 'lucide-react';
import { api } from '../services/api.js';
import { CheckoutPanel } from '../components/CheckoutPanel.jsx';

const initialForm = { businessName: '', segment: '', description: '', whatsapp: '', instagram: '' };

export function PublicSiteGeneratorPage() {
  const recoveredOrder=new URLSearchParams(window.location.search).get('order')||'';
  const [form, setForm] = useState(initialForm);
  const [jobId, setJobId] = useState('');
  const [job, setJob] = useState(null);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const [images, setImages] = useState([]);
  const pollCount = useRef(0);

  useEffect(() => {
    if (!jobId || job?.status === 'done' || job?.status === 'failed') return undefined;
    let cancelled = false;
    let timeout;
    const poll = async () => {
      try {
        const result = await api(`/public/jobs/${jobId}`);
        if (!cancelled) { setJob(result); pollCount.current += 1; }
      } catch (requestError) { if (!cancelled) setError(requestError.message); }
      if (!cancelled) timeout = window.setTimeout(poll, pollCount.current > 15 ? 2500 : 1000);
    };
    poll();
    return () => { cancelled = true; window.clearTimeout(timeout); };
  }, [jobId, job?.status]);

  const change = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const selectImages = async (event) => {
    const chosen=Array.from(event.target.files||[]),allowed=new Set(['image/jpeg','image/png','image/webp']);
    const selected=chosen.filter((file)=>allowed.has(file.type)&&file.size<=5*1024*1024).slice(0,5);
    setError(selected.length!==chosen.length?'Algumas fotos foram ignoradas. Use até 5 arquivos JPG, PNG ou WebP com no máximo 5 MB cada.':'');
    images.forEach((image)=>URL.revokeObjectURL(image.preview));
    const inspected=await Promise.all(selected.map((file)=>new Promise((resolve)=>{
      const preview=URL.createObjectURL(file),probe=new Image();
      probe.onload=()=>resolve({file,preview,width:probe.naturalWidth,height:probe.naturalHeight,heroEligible:Math.max(probe.naturalWidth,probe.naturalHeight)>=1200&&Math.min(probe.naturalWidth,probe.naturalHeight)>=650});
      probe.onerror=()=>resolve({file,preview,width:0,height:0,heroEligible:false});
      probe.src=preview;
    })));
    setImages(inspected); event.target.value='';
  };
  const removeImage=(index)=>setImages((current)=>{URL.revokeObjectURL(current[index].preview);return current.filter((_,itemIndex)=>itemIndex!==index);});
  const submit = async (event) => {
    event.preventDefault(); setSending(true); setError(''); setJob(null); pollCount.current = 0;
    try {
      const payload=new FormData();Object.entries(form).forEach(([key,value])=>payload.append(key,value));images.forEach((image)=>payload.append('images',image.file));payload.append('imageMetadata',JSON.stringify(images.map(({width,height})=>({width,height}))));
      const result = await api('/public/sites/generate', { method: 'POST', body: payload });
      setJobId(result.jobId); setJob({ status: result.status });
    } catch (requestError) { setError(requestError.message); }
    finally { setSending(false); }
  };
  const reset = () => { images.forEach((image)=>URL.revokeObjectURL(image.preview));setImages([]);setForm(initialForm);setJobId('');setJob(null);setError(''); };
  const processing = jobId && ['pending', 'processing'].includes(job?.status);

  return <div className="self-service-page">
    <header className="self-service-nav"><a href="/criar-site"><span><Sparkles size={17}/></span>XFia Studio</a><small>Seu site profissional, criado em minutos</small></header>
    {!jobId&&!recoveredOrder && <main className="self-service-shell">
      <section className="self-service-copy"><span className="self-service-kicker">Criação inteligente</span><h1>Veja seu negócio ganhar uma presença digital.</h1><p>Conte um pouco sobre sua empresa. Nossa tecnologia prepara textos, estrutura, cores e uma prévia personalizada para você.</p><div className="self-service-points"><span><i>1</i>Preencha seus dados</span><span><i>2</i>Aguarde a criação</span><span><i>3</i>Explore seu novo site</span></div></section>
      <form className="self-service-form" onSubmit={submit}><div><span>Prévia gratuita</span><h2>Vamos criar seu site</h2><p>Leva apenas alguns instantes.</p></div>{error&&<div className="self-service-error">{error}</div>}<label>Nome do negócio<input name="businessName" required minLength="2" maxLength="120" value={form.businessName} onChange={change} placeholder="Ex.: Barbearia Central"/></label><label>Área de atuação<input name="segment" required minLength="2" maxLength="80" value={form.segment} onChange={change} placeholder="Ex.: Barbearia"/></label><label>WhatsApp<input name="whatsapp" required maxLength="30" value={form.whatsapp} onChange={change} placeholder="(11) 99999-9999"/></label><label>Conte um pouco sobre o negócio <small>Opcional</small><textarea name="description" maxLength="1200" rows="4" value={form.description} onChange={change} placeholder="Principais serviços, diferenciais e público..."/></label><label>Instagram <small>Opcional</small><input name="instagram" maxLength="200" value={form.instagram} onChange={change} placeholder="instagram.com/seunegocio"/></label><div className="public-image-field"><div><strong>Fotos do negócio</strong><small>Opcional · até 5 fotos</small></div><label className="public-image-picker"><ImagePlus/><span>Selecionar fotos</span><input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={selectImages}/></label>{images.length>0&&<div className="public-image-list">{images.map((image,index)=><figure key={`${image.file.name}-${index}`}><img src={image.preview} alt=""/><button type="button" aria-label={`Remover ${image.file.name}`} onClick={()=>removeImage(index)}><X/></button><figcaption>{image.heroEligible?'Boa para destaque':'Será usada na galeria'}</figcaption></figure>)}</div>}<small>Fotos com pelo menos 1200 × 650 px podem aparecer em destaque. Imagens menores ficam apenas na galeria.</small></div><button disabled={sending}>{sending?'Enviando...':<>Criar minha prévia <ArrowRight size={18}/></>}</button><small className="privacy-note">Seus dados serão usados para gerar esta demonstração.</small></form>
    </main>}
    {!jobId&&recoveredOrder&&<main className="generation-state"><CheckoutPanel existingOrderToken={recoveredOrder}/></main>}
    {processing&&<main className="generation-state"><div className="generation-orbit"><LoaderCircle/><Sparkles/></div><span>Criando sua experiência</span><h1>Estamos preparando cada detalhe.</h1><p>{job?.status==='pending'?'Sua solicitação entrou na fila.':'Textos, cores e seções estão sendo combinados para o seu negócio.'}</p><div className="generation-progress"><i/></div><small>Você pode manter esta página aberta. A prévia aparecerá automaticamente.</small></main>}
    {job?.status==='failed'&&<main className="generation-state generation-state--error"><div className="state-icon"><RotateCcw/></div><h1>Não conseguimos concluir agora.</h1><p>{job.error?.message||'Tente gerar sua prévia novamente.'}</p><button onClick={reset}>Tentar novamente</button></main>}
    {job?.status==='done'&&<main className="generation-result"><div className="result-heading"><div><span><CheckCircle2/> Prévia concluída</span><h1>Seu novo site está pronto para explorar.</h1></div><div><button onClick={reset}><RotateCcw/>Criar outro</button><a href={job.result.previewUrl} target="_blank" rel="noreferrer">Abrir em nova aba <ExternalLink/></a></div></div><div className="result-layout"><div className="result-browser"><header><i/><i/><i/><span>{job.result.previewUrl}</span></header><iframe title="Prévia do site gerado" src={job.result.previewUrl}/></div><CheckoutPanel siteSlug={job.result.siteSlug}/></div></main>}
  </div>;
}
