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
Responda somente JSON válido, sem markdown, com exatamente: hero {eyebrow,title,subtitle,ctaLabel,ctaLink}, about {title,text}, services [{title,description}], differentiators [{title,description}], gallery {title,images}, cta {title,text,buttonLabel,buttonLink}, location {title,address,mapsUrl}, hours {title,text}, contact {phone,whatsapp,instagram}, footer {text}, seo {title,metaDescription,keywords}. Não invente endereço, telefone, avaliações, anos de mercado, certificações ou preços. Quando faltar um dado, use texto neutro ou string vazia.`;
}
