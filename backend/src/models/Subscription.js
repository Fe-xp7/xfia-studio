import mongoose from 'mongoose';

const subscriptionSchema=new mongoose.Schema({
  clientId:{type:mongoose.Schema.Types.ObjectId,ref:'Client',required:true,index:true},
  amount:{type:Number,required:true,min:0},
  dueDate:{type:Date,required:true,index:true},
  status:{type:String,enum:['pendente','pago','atrasado','cancelado'],default:'pendente',index:true},
  referenceMonth:{type:String,required:true,match:/^\d{4}-(0[1-9]|1[0-2])$/},
  paidAt:{type:Date,default:null},
  notes:{type:String,trim:true,maxlength:2000,default:''},
},{timestamps:true});
subscriptionSchema.index({clientId:1,referenceMonth:1},{unique:true});
export const Subscription=mongoose.model('Subscription',subscriptionSchema);
