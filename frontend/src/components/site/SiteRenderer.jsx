import { getVisualRecipe } from './visualRecipes.js';
import { AboutSection, AdaptiveHero, AvailabilityTicker, ContactSection, CTASection, DifferentialsSection, GallerySection, ServicesSection, SiteFooter, SiteHeader } from './SiteSections.jsx';

const text=(value='')=>typeof value==='string'?value:value==null?'':String(value);
const list=(value)=>Array.isArray(value)?value:[];
const defaultOrder=['hero','about','services','gallery','differentiators','cta','contact'];
const legacyPalettes={barbearia:['#171717','#D4A853'],restaurante:['#7F1D1D','#F59E0B'],clinica:['#0F766E','#5EEAD4']};

export function SiteRenderer({site,editor=false}){
  const content=site.content&&typeof site.content==='object'?site.content:{};
  const hero=content.hero||{},recipe=getVisualRecipe(site),savedColors=list(site.theme?.colors),legacy=legacyPalettes[recipe.key],colors=legacy&&legacy.every((color,index)=>savedColors[index]?.toUpperCase()===color.toUpperCase())?[]:savedColors,palette=recipe.colors;
  const savedOrder=list(content.sectionOrder).filter((key)=>defaultOrder.includes(key));
  const hiddenSections=list(content.hiddenSections).filter((key)=>defaultOrder.includes(key)&&key!=='hero');
  const sectionOrder=[...new Set([...savedOrder,...defaultOrder])].filter((key)=>!hiddenSections.includes(key));
  const style={'--site-primary':text(colors[0])||palette[0],'--site-secondary':text(colors[1])||palette[1],'--site-accent':text(colors[2])||palette[2],'--site-soft':palette[3],'--site-muted':palette[4],'--site-paper':palette[5]};
  const renderSection=(key)=>({hero:<AdaptiveHero site={site} hero={hero} recipe={recipe}/>,about:<AboutSection data={content.about} recipe={recipe}/>,services:<ServicesSection data={content.services} recipe={recipe}/>,gallery:<GallerySection data={content.gallery} recipe={recipe}/>,differentials:<DifferentialsSection data={content.differentiators} recipe={recipe}/>,cta:<CTASection data={content.cta} recipe={recipe}/>,contact:<ContactSection content={content} recipe={recipe}/>})[key];
  return <div className={`generated-site identity--${recipe.key} theme--${site.theme?.mode||'light'} ${editor?'generated-site--editor':''}`} style={style}><AvailabilityTicker content={content} recipe={recipe}/><SiteHeader site={site} hero={hero} hiddenSections={hiddenSections}/><main>{sectionOrder.map((key)=><div className="generated-section" data-section={key} key={key}>{renderSection(key)}</div>)}</main><SiteFooter site={site} content={content}/></div>;
}
