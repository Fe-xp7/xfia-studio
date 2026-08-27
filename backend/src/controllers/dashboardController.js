import { Company } from '../models/Company.js';
import { Site } from '../models/Site.js';
import { Template } from '../models/Template.js';
import { Client } from '../models/Client.js';
import { Subscription } from '../models/Subscription.js';

export async function getDashboard(_req, res) {
  await Subscription.updateMany({status:'pendente',dueDate:{$lt:new Date(new Date().setHours(0,0,0,0))}},{$set:{status:'atrasado'}});
  const [companies, highPotential, preparingSites, publishedSites, templates, recommendations, activeClients, finance, pendingSubscriptions] = await Promise.all([
    Company.countDocuments(), Company.countDocuments({ potential: { $gte: 80 } }),
    Site.countDocuments({ status: { $in: ['rascunho', 'pronto'] } }), Site.countDocuments({ status: 'publicado' }),
    Template.countDocuments({ active: true }),
    Company.find({ status: { $in: ['site-pronto', 'contato-pendente', 'nova'] } }).sort({ potential: -1, createdAt: -1 }).limit(6).select('name segment city state potential status'),
    Client.countDocuments({status:'ativo'}),
    Client.aggregate([{$match:{status:{$ne:'cancelado'}}},{$group:{_id:null,monthlyRevenue:{$sum:'$monthlyFee'},creationRevenue:{$sum:'$creationFee'}}}]),
    Subscription.countDocuments({status:{$in:['pendente','atrasado']}}),
  ]);
  res.json({ metrics: { companies, highPotential, preparingSites, publishedSites, templates, activeClients, monthlyRevenue:finance[0]?.monthlyRevenue||0, creationRevenue:finance[0]?.creationRevenue||0, pendingSubscriptions }, recommendations });
}
