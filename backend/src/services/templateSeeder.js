import { Template } from '../models/Template.js';

const sections=['hero','sobre','servicos','diferenciais','galeria','cta','localizacao','horario','contato'];
const defaults=[
  {name:'Barbearia Clássica',slug:'barbearia',category:'Barbearia',description:'Visual escuro, elegante e masculino.',defaultTheme:{primaryColor:'#D4A853',secondaryColor:'#171717',fontFamily:'Manrope'}},
  {name:'Restaurante Sabor',slug:'restaurante',category:'Restaurante',description:'Experiência acolhedora com foco no cardápio.',defaultTheme:{primaryColor:'#C2410C',secondaryColor:'#431407',fontFamily:'DM Sans'}},
  {name:'Oficina Pro',slug:'oficina',category:'Oficina',description:'Visual robusto, técnico e direto.',defaultTheme:{primaryColor:'#F97316',secondaryColor:'#111827',fontFamily:'Manrope'}},
  {name:'Loja Contemporânea',slug:'loja',category:'Loja',description:'Vitrine limpa para produtos e ofertas.',defaultTheme:{primaryColor:'#4F46E5',secondaryColor:'#1E1B4B',fontFamily:'DM Sans'}},
  {name:'Clínica Serena',slug:'clinica',category:'Clínica',description:'Estética leve, humana e confiável.',defaultTheme:{primaryColor:'#0F766E',secondaryColor:'#134E4A',fontFamily:'DM Sans'}},
];

export async function ensureDefaultTemplates() {
  await Promise.all(defaults.map((item)=>Template.updateOne({slug:item.slug},{$setOnInsert:{...item,sections,active:true}},{upsert:true})));
}
