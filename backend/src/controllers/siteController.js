import { Site } from '../models/Site.js';
import { Template } from '../models/Template.js';
import { Company } from '../models/Company.js';
import { AppError } from '../utils/AppError.js';
import { slugify } from '../utils/slugify.js';
import { getDeploymentService } from '../services/deployment/index.js';

const allowed=['templateId','name','slug','content','theme','seo','status'];
const clean=(body)=>Object.fromEntries(Object.entries(body).filter(([key])=>allowed.includes(key)));

export async function listSites(req,res){
  const filter={}; if(req.query.status)filter.status=req.query.status;
  const items=await Site.find(filter).populate('companyId','name segment city state').populate('templateId','name slug category').sort({updatedAt:-1});
  res.json({items});
}
export async function getSite(req,res){
  const item=await Site.findById(req.params.id).populate('companyId').populate('templateId');
  if(!item)throw new AppError('Site não encontrado.',404); res.json(item);
}
export async function updateSite(req,res){
  const data=clean(req.body); if(data.slug)data.slug=slugify(data.slug);
  if(data.templateId&&!await Template.exists({_id:data.templateId,active:true}))throw new AppError('Template inválido ou inativo.',400);
  const item=await Site.findByIdAndUpdate(req.params.id,data,{new:true,runValidators:true}).populate('companyId').populate('templateId');
  if(!item)throw new AppError('Site não encontrado.',404); res.json(item);
}
export async function deleteSite(req,res){
  const item=await Site.findByIdAndDelete(req.params.id); if(!item)throw new AppError('Site não encontrado.',404);
  await Company.updateOne({_id:item.companyId},{$set:{status:'site-em-producao'}}); res.status(204).end();
}
export async function getPublicPreview(req,res){
  const item=await Site.findOne({slug:req.params.slug,status:{$ne:'arquivado'}}).populate('companyId','name segment city state').populate('templateId','name slug category sections');
  if(!item)throw new AppError('Demonstração não encontrada.',404); res.json(item);
}

export async function deploySite(req,res){
  const site=await Site.findById(req.params.id).populate('companyId').populate('templateId');
  if(!site)throw new AppError('Site não encontrado.',404);
  if(!site.content?.hero)throw new AppError('O site ainda não possui conteúdo suficiente para publicação.',409);
  const deployment=await getDeploymentService().deploy(site);
  site.status='publicado'; site.deploymentId=deployment.deploymentId; site.previewUrl=deployment.previewUrl; site.productionUrl=deployment.productionUrl||'';
  await site.save();
  await Company.updateOne({_id:site.companyId._id},{$set:{status:'contato-pendente'}});
  res.json({site,deployment});
}
