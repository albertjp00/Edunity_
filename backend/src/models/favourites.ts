import mongoose, {Types , Document, Schema} from "mongoose";



export interface IFavourite extends Document {
  _id : Types.ObjectId
  userId: string;
  courseId: string;
}

const FavouritesSchema: Schema<IFavourite> = new Schema({
  userId: {
    type: String,
    required: true,
  },
  courseId: {
    type:String,
    required:true
  }
});

export const FavouritesModel = mongoose.model<IFavourite>("Favourites",FavouritesSchema);
