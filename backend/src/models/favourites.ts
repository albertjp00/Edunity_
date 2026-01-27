import mongoose, { Document, Schema} from "mongoose";



export interface IFavourite extends Document {
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
