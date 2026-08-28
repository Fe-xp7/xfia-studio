const companyContext = (company) => JSON.stringify({
  name: company.name, segment: company.segment, description: company.description,
  location: [company.city, company.state].filter(Boolean).join(' - '), address: company.address,
  phone: company.phone, whatsapp: company.whatsapp, instagram: company.instagram,
  businessHours: company.businessHours, services: company.services, products: company.products,
  hasWebsite: company.hasWebsite, currentUrl: company.currentUrl, notes: company.notes,
});

export function analysisPrompt(company, templates) {
  return `Analise esta empresa brasileira para uma proposta comercial de site. Dados: ${companyContext(company)}.
Templates disponíveis: ${templates.map((item) => `${item.slug} (${item.category})`).join(', ') || 'nenhum cadastrado'}.
Responda somente JSON válido, sem markdown, com exatamente: potentialScore (0-100), recommendedTemplate (slug disponível ou slug de categoria), recommendedStyle, recommendedColors (2 a 4 hex), recommendedSections (lista), mainCTA, businessDescription, recommendations (lista) e salesArguments (lista). Seja específico, honesto e escreva em português do Brasil.`;
}

export function contentPrompt(company, analysis) {
  return `Crie conteúdo de site para a empresa brasileira a seguir: ${companyContext(company)}. Análise: ${JSON.stringify(analysis)}.
Escreva como uma pessoa que conhece o cotidiano desse nicho, em português brasileiro natural, direto e específico. Preserve os termos usados pela empresa. Evite linguagem publicitária genérica e não use clichês como "experiência única", "qualidade em cada detalhe", "soluções inovadoras", "transformar vidas", "tradição e inovação" ou "sua melhor versão". Não repita a mesma promessa em seções diferentes. CTAs devem descrever uma ação concreta, como consultar horários, reservar, pedir ou falar com a equipe.
Para barbearia, priorize serviços, estilo e agendamento. Para restaurante, priorize pratos ou especialidades informadas, horário, pedido e reserva. Para clínica, priorize clareza sobre o atendimento, próximos passos e credenciais somente quando fornecidas.
Responda somente JSON válido, sem markdown, com exatamente: hero {eyebrow,title,subtitle,ctaLabel,ctaLink}, about {title,text}, services [{title,description}], differentiators [{title,description}], gallery {title,images}, cta {title,text,buttonLabel,buttonLink}, location {title,address,mapsUrl}, hours {title,text}, contact {phone,whatsapp,instagram}, footer {text}, seo {title,metaDescription,keywords}. Não invente endereço, telefone, avaliações, anos de mercado, certificações, convênios, tratamentos, ingredientes, origem de produtos ou preços. Quando faltar um dado, use texto neutro ou string vazia.`;
}
