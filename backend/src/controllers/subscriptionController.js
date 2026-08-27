import { Subscription } from '../models/Subscription.js';
import { Client } from '../models/Client.js';
import { AppError } from '../utils/AppError.js';

export async function listSubscriptions(_req,res){
  await Subscription.updateMany({status:'pendente',dueDate:{$lt:new Date(new Date().setHours(0,0,0,0))}},{$set:{status:'atrasado'}});
  res.json({items:await Subscription.find().populate({path:'clientId',populate:{path:'companyId',select:'name'}}).sort({dueDate:-1})});
}
export async function createSubscription(req,res){
  const client=await Client.findById(req.body.clientId);if(!client)throw new AppError('Cliente não encontrado.',404);
  const item=await Subscription.create({clientId:client._id,amount:req.body.amount??client.monthlyFee,dueDate:req.body.dueDate,status:req.body.status||'pendente',referenceMonth:req.body.referenceMonth,paidAt:req.body.status==='pago'?(req.body.paidAt||new Date()):null,notes:req.body.notes||''});
  res.status(201).json(await item.populate({path:'clientId',populate:{path:'companyId',select:'name'}}));
}
export async function updateSubscription(req,res){
  const allowed=['amount','dueDate','status','referenceMonth','paidAt','notes'];const data=Object.fromEntries(Object.entries(req.body).filter(([key])=>allowed.includes(key)));if(data.status==='pago'&&!data.paidAt)data.paidAt=new Date();if(data.status&&data.status!=='pago')data.paidAt=null;
  const item=await Subscription.findByIdAndUpdate(req.params.id,data,{new:true,runValidators:true}).populate({path:'clientId',populate:{path:'companyId',select:'name'}});if(!item)throw new AppError('Mensalidade não encontrada.',404);res.json(item);
}
export async function deleteSubscription(req,res){const item=await Subscription.findByIdAndDelete(req.params.id);if(!item)throw new AppError('Mensalidade não encontrada.',404);res.status(204).end();}
