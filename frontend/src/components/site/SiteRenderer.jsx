const text=(value='')=>typeof value==='string'?value:value==null?'':String(value);
const list=(value)=>Array.isArray(value)?value:[];
const normalize=(value='')=>text(value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const typeOf=(site)=>['barbearia','restaurante','oficina','loja','clinica'].find(type=>normalize(`${site.templateId?.slug} ${site.templateId?.category}`).includes(type))||'loja';
const link=(value='')=>text(value).startsWith('http')?text(value):`https://${text(value)}`;

function Services({data}){const items=list(data).filter(Boolean);if(!items.length)return null;return <section id="servicos" className="public-section services-section"><div className="section-kicker">O que fazemos</div><h2>Serviços em destaque</h2><div className="service-grid">{items.map((item,index)=><article key={`${text(item?.title)}-${index}`}><span>{String(index+1).padStart(2,'0')}</span><h3>{text(item?.title)}</h3><p>{text(item?.description)}</p></article>)}</div></section>}
function Differentials({data}){const items=list(data).filter(Boolean);if(!items.length)return null;return <section id="diferenciais" className="public-section differential-section"><div><div className="section-kicker">Por que escolher</div><h2>Uma experiência feita com atenção</h2></div><div>{items.map((item,index)=><article key={`${text(item?.title)}-${index}`}><i>✓</i><div><h3>{text(item?.title)}</h3><p>{text(item?.description)}</p></div></article>)}</div></section>}
function Gallery({data}){const images=list(data?.images).map(text).filter(Boolean);if(!images.length)return null;return <section id="galeria" className="public-section gallery-section"><div className="section-kicker">Galeria</div><h2>{text(data?.title)||'Conheça nosso trabalho'}</h2><div>{images.map((src,index)=><img key={`${src}-${index}`} src={src} alt={`Galeria ${index+1}`} loading="lazy"/>)}</div></section>}
function Contact({content}){const{contact={},location={},hours={}}=content;const whatsapp=text(contact?.whatsapp),phone=text(contact?.phone),instagram=text(contact?.instagram);return <section id="contato" className="public-section contact-section"><div><div className="section-kicker">Visite ou fale conosco</div><h2>Estamos prontos para atender</h2><p>{text(location?.address)}</p>{location?.mapsUrl&&<a href={link(location.mapsUrl)} target="_blank" rel="noreferrer">Abrir no mapa ↗</a>}</div><div className="contact-cards">{whatsapp&&<a href={`https://wa.me/${whatsapp.replace(/\D/g,'')}`} target="_blank" rel="noreferrer"><small>WhatsApp</small><strong>{whatsapp}</strong></a>}{phone&&<a href={`tel:${phone}`}><small>Telefone</small><strong>{phone}</strong></a>}<article><small>{text(hours?.title)||'Horários'}</small><strong>{text(hours?.text)}</strong></article>{instagram&&<a href={link(instagram)} target="_blank" rel="noreferrer"><small>Instagram</small><strong>Ver perfil ↗</strong></a>}</div></section>}

const defaultOrder=['hero','about','services','gallery','differentiators','cta','contact'];

export function SiteRenderer({site,editor=false}){
  const content=site.content&&typeof site.content==='object'?site.content:{},hero=content.hero||{},about=content.about||{},cta=content.cta||{},type=typeOf(site),mode=site.theme?.mode||'light';
  const colors=list(site.theme?.colors);
  const heroImage=text(hero.image);
  const savedOrder=list(content.sectionOrder).filter(key=>defaultOrder.includes(key));
  const hiddenSections=list(content.hiddenSections).filter(key=>defaultOrder.includes(key)&&key!=='hero');
  const sectionOrder=[...new Set([...savedOrder,...defaultOrder])].filter(key=>!hiddenSections.includes(key));
  const style={'--site-primary':text(colors[0])||text(site.theme?.primaryColor)||'#4F46E5','--site-secondary':text(colors[1])||text(site.theme?.secondaryColor)||'#111827','--site-accent':text(colors[2])||'#ffffff'};
  const renderSection=(key)=>({
    hero:<section id="top" className="public-hero"><div className="hero-copy"><span>{text(hero.eyebrow)}</span><h1>{text(hero.title)||text(site.name)}</h1><p>{text(hero.subtitle)}</p><a href={text(hero.ctaLink)||'#contato'}>{text(hero.ctaLabel)||'Entre em contato'} <b>→</b></a></div><div className={`hero-art ${heroImage?'hero-art--image':''}`} style={heroImage?{backgroundImage:`url("${heroImage.replace(/"/g,'')}")`}:undefined}><i/><i/>{!heroImage&&<strong>{text(site.companyId?.segment)||text(site.templateId?.category)}</strong>}</div></section>,
    about:text(about.text)?<section id="sobre" className="public-section about-section"><div className="section-kicker">Nossa história</div><div><h2>{text(about.title)}</h2><p>{text(about.text)}</p></div></section>:null,
    services:<Services data={content.services}/>,
    gallery:<Gallery data={content.gallery}/>,
    differentials:<Differentials data={content.differentiators}/>,
    cta:text(cta.title)?<section className="public-cta"><div><span>Próximo passo</span><h2>{text(cta.title)}</h2><p>{text(cta.text)}</p></div><a href={text(cta.buttonLink)||'#contato'}>{text(cta.buttonLabel)||'Fale conosco'} →</a></section>:null,
    contact:<Contact content={content}/>,
  })[key];
  return <div className={`generated-site template--${type} theme--${mode} ${editor?'generated-site--editor':''}`} style={style}>
    <header className="public-nav"><a className="public-logo" href="#top">{text(site.companyId?.name)||text(site.name)}</a><nav>{!hiddenSections.includes('about')&&<a href="#sobre">Sobre</a>}{!hiddenSections.includes('services')&&<a href="#servicos">Serviços</a>}{!hiddenSections.includes('gallery')&&<a href="#galeria">Galeria</a>}{!hiddenSections.includes('contact')&&<a href="#contato">Contato</a>}</nav><a className="nav-cta" href={text(hero.ctaLink)||'#contato'}>{text(hero.ctaLabel)||'Fale conosco'}</a></header>
    <main>{sectionOrder.map(key=><div className="generated-section" data-section={key} key={key}>{renderSection(key)}</div>)}</main><footer className="public-footer"><strong>{text(site.companyId?.name)||text(site.name)}</strong><span>{text(content.footer?.text)}</span><a href="#top">Voltar ao topo ↑</a></footer>
  </div>;
}
