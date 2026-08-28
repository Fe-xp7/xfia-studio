import { env } from '../config/env.js';
import { WebhookEvent } from '../models/WebhookEvent.js';
import { queueWebhookEvent } from '../services/billing/billingJobs.js';

export async function receiveAsaasWebhook(req,res){if(env.asaasWebhookToken&&req.get('asaas-access-token')!==env.asaasWebhookToken)return res.status(401).json({message:'Webhook não autorizado.'});const providerEventId=String(req.body.id||'');if(!providerEventId)return res.status(400).json({message:'Evento sem identificador.'});let event;try{event=await WebhookEvent.create({provider:'asaas',providerEventId,eventType:String(req.body.event||'UNKNOWN'),payload:req.body});}catch(error){if(error.code===11000)return res.status(200).json({received:true,duplicate:true});throw error;}await queueWebhookEvent(event._id);res.status(200).json({received:true});}
