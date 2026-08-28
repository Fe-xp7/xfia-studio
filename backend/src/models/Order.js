import mongoose from 'mongoose';

const orderSchema=new mongoose.Schema({
  publicToken:{type:String,required:true,unique:true,index:true},siteId:{type:mongoose.Schema.Types.ObjectId,ref:'Site',required:true,index:true},
  status:{type:String,enum:['pending','awaiting_payment','paid','publishing','published','failed','canceled','refunded'],default:'pending',index:true},
  customer:{name:{type:String,required:true,trim:true},email:{type:String,required:true,trim:true,lowercase:true},cpfCnpj:{type:String,required:true,trim:true},phone:{type:String,required:true,trim:true}},
  creationAmount:{type:Number,required:true,min:0},monthlyAmount:{type:Number,required:true,min:0},currency:{type:String,default:'BRL'},
  provider:{type:String,default:'mock'},providerCheckoutId:{type:String,default:'',index:true},checkoutUrl:{type:String,default:''},paidAt:{type:Date,default:null},publishedAt:{type:Date,default:null},failureReason:{type:String,default:''},
  providerSubscriptionCheckoutId:{type:String,default:''},subscriptionCheckoutUrl:{type:String,default:''},
},{timestamps:true});
export const Order=mongoose.model('Order',orderSchema);
