import mongoose, { Document, Schema} from "mongoose";


export interface ICategory extends Document {

    name:string;
    skills:[];
    
}

const CategorySchema: Schema<ICategory> = new Schema({
  name: {
    type: String,
  },
  skills:{
    type:[String],
    default:[]
  }
});

export const CategoryModel = mongoose.model<ICategory>("Category",CategorySchema);