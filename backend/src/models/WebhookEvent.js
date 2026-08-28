import mongoose from 'mongoose';
const webhookEventSchema=new mongoose.Schema({provider:{type:String,required:true},providerEventId:{type:String,required:true},eventType:{type:String,required:true},payload:{type:mongoose.Schema.Types.Mixed,required:true},status:{type:String,enum:['pending','processing','processed','failed'],default:'pending',index:true},attempts:{type:Number,default:0},processedAt:{type:Date,default:null},errorMessage:{type:String,default:''}},{timestamps:true});
webhookEventSchema.index({provider:1,providerEventId:1},{unique:true});
export const WebhookEvent=mongoose.model('WebhookEvent',webhookEventSchema);
