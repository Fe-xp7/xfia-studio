import mongoose from 'mongoose';

const clientSchema=new mongoose.Schema({
  companyId:{type:mongoose.Schema.Types.ObjectId,ref:'Company',required:true,unique:true,index:true},
  hiringDate:{type:Date,required:true,default:Date.now},
  creationFee:{type:Number,required:true,min:0,default:500},
  monthlyFee:{type:Number,required:true,min:0,default:50},
  status:{type:String,enum:['ativo','inativo','cancelado'],default:'ativo',index:true},
  notes:{type:String,trim:true,maxlength:3000,default:''},
},{timestamps:true});
export const Client=mongoose.model('Client',clientSchema);
