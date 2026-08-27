import { Client } from '../models/Client.js';
import { Company } from '../models/Company.js';
import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';
import { findOrCreateSettings } from './settingsController.js';

export async function listClients(_req,res){res.json({items:await Client.find().populate('companyId','name segment city state whatsapp phone').sort({createdAt:-1})});}
export async function createClient(req,res){
  const company=await Company.findById(req.body.companyId);if(!company)throw new AppError('Empresa não encontrada.',404);
  if(await Client.exists({companyId:company._id}))throw new AppError('Esta empresa já foi transformada em cliente.',409);
  const settings=await findOrCreateSettings();
  const client=await Client.create({companyId:company._id,hiringDate:req.body.hiringDate||new Date(),creationFee:req.body.creationFee??settings.defaultCreationFee??env.defaultCreationFee,monthlyFee:req.body.monthlyFee??settings.defaultMonthlyFee??env.defaultMonthlyFee,status:req.body.status||'ativo',notes:req.body.notes||''});
  company.status='cliente';await company.save();
  res.status(201).json(await client.populate('companyId','name segment city state whatsapp phone'));
}
export async function updateClient(req,res){
  const allowed=['hiringDate','creationFee','monthlyFee','status','notes'];const data=Object.fromEntries(Object.entries(req.body).filter(([key])=>allowed.includes(key)));
  const client=await Client.findByIdAndUpdate(req.params.id,data,{new:true,runValidators:true}).populate('companyId','name segment city state whatsapp phone');if(!client)throw new AppError('Cliente não encontrado.',404);res.json(client);
}
export async function deleteClient(req,res){const client=await Client.findByIdAndDelete(req.params.id);if(!client)throw new AppError('Cliente não encontrado.',404);await Company.updateOne({_id:client.companyId},{$set:{status:'apresentado'}});res.status(204).end();}
