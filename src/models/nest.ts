import mongoose from 'mongoose'


const NestSchema = new mongoose.Schema({
  specie:{type:mongoose.Types.ObjectId, ref:'Specie', required:true},
  dad:{type:mongoose.Types.ObjectId,ref:'Bird',required:true},
  mom:{ type:mongoose.Types.ObjectId,ref:'Bird',required:true}, 
  children:[{ type:mongoose.Types.ObjectId,ref:'Bird',unique: true}],
  sold:{type:Boolean, default: false},
  onSale:{type:Boolean, default: true},
  price : Number, 
  imageUrls:[String], 
  description:String, 
  discount:{
    discountPercent:Number,
    startDate:Date,
    endDate:Date
  }
})

export default mongoose.model('Nest', NestSchema)
