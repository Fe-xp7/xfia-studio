const palettes = {
  barbearia: ['#171717', '#D4A853', '#FAFAF9'], restaurante: ['#7F1D1D', '#F59E0B', '#FFFBEB'],
  oficina: ['#111827', '#F97316', '#F8FAFC'], loja: ['#4F46E5', '#EC4899', '#FFFFFF'],
  clínica: ['#0F766E', '#5EEAD4', '#F0FDFA'], clinica: ['#0F766E', '#5EEAD4', '#F0FDFA'],
};
const normalize = (value='') => value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const category = (company) => Object.keys(palettes).find((key) => normalize(company.segment).includes(normalize(key))) || 'loja';
const whatsappLink = (company) => company.whatsapp ? `https://wa.me/${company.whatsapp.replace(/\D/g,'')}` : '#contato';

export class MockAIProvider {
  async analyze(company, templates) {
    const type = category(company); const template = templates.find((item) => normalize(item.category).includes(normalize(type))) || templates[0];
    const score = Math.min(96, 62 + (!company.hasWebsite ? 18 : 0) + (company.whatsapp ? 6 : 0) + (company.instagram ? 4 : 0) + (company.services?.length ? 5 : 0));
    return { potentialScore:score, recommendedTemplate:template?.slug || type, recommendedStyle:'moderno, confiável e direto', recommendedColors:palettes[type], recommendedSections:['hero','sobre','servicos','diferenciais','cta','localizacao','horario','contato'], mainCTA:company.whatsapp?'Fale pelo WhatsApp':'Entre em contato', businessDescription:company.description || `${company.name} oferece ${company.segment.toLowerCase()} em ${company.city || 'sua região'}.`, recommendations:['Destacar os principais serviços logo no início','Facilitar o contato em dispositivos móveis','Reforçar localização e horário de atendimento'], salesArguments:['Um site profissional aumenta a confiança antes do primeiro contato','O acesso rápido ao WhatsApp reduz o caminho até o orçamento','A presença própria melhora a apresentação nos resultados de busca'] };
  }
  async generateContent(company, analysis) {
    const services=(company.services?.length?company.services:['Atendimento especializado']).map((title)=>({title,description:`Conheça nosso serviço de ${title.toLowerCase()}, pensado para atender você com qualidade.`}));
    return { hero:{eyebrow:company.segment,title:`${company.name}: qualidade perto de você`,subtitle:analysis.businessDescription,ctaLabel:analysis.mainCTA,ctaLink:whatsappLink(company)},about:{title:`Sobre a ${company.name}`,text:analysis.businessDescription},services,differentiators:[{title:'Atendimento próximo',description:'Converse diretamente com nossa equipe.'},{title:'Qualidade em cada detalhe',description:'Cuidado e atenção em todos os atendimentos.'}],gallery:{title:'Conheça nosso trabalho',images:company.photos||[]},cta:{title:'Vamos conversar?',text:'Tire suas dúvidas e solicite mais informações.',buttonLabel:analysis.mainCTA,buttonLink:whatsappLink(company)},location:{title:'Onde estamos',address:company.address||[company.city,company.state].filter(Boolean).join(' - '),mapsUrl:company.googleMaps||''},hours:{title:'Horário de atendimento',text:company.businessHours||'Consulte nossos horários de atendimento.'},contact:{phone:company.phone||'',whatsapp:company.whatsapp||'',instagram:company.instagram||''},footer:{text:`© ${new Date().getFullYear()} ${company.name}. Todos os direitos reservados.`},seo:{title:`${company.name} | ${company.segment}${company.city?` em ${company.city}`:''}`,metaDescription:`Conheça a ${company.name}, ${company.segment.toLowerCase()}${company.city?` em ${company.city}`:''}. Entre em contato e saiba mais.`.slice(0,160),keywords:[company.name,company.segment,company.city].filter(Boolean)} };
  }
}
