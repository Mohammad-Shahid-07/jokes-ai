import { Schema, model, models, Document } from "mongoose";


 export interface IAccount {
    provider: string;
    providerAccountId: string;
    refresh_token: string;
    access_token: string;
    expires_at: number;
    expires_in: number;
    token_type: string;
    scope: string;
    id_token: string;
  } 
 

export interface IUser extends Document {
  name: string;
  email: string;
  image: string;

     password?: string;
    emailVerified?: Date; 
     
  //[CredentialsUsernameIUser]
  
     accounts: IAccount[]; 
     
  role: string;
  
     twoFactorEnabled: boolean; 
     
}

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
    image: { type: String },
 
     password: { type: String },
    emailVerified: { type: Date, default: null }, 
     
  //[CredentialsUsernameUserSchema]
  
     accounts: [
      {
        provider: String,
        providerAccountId: { type: String, index: true },
        refresh_token: String,
        access_token: String,
        expires_at: Number,
        expires_in: Number,
        token_type: String,
        scope: String,
        id_token: String,
      },
    ],  
     
  role: { type: String, default: "USER" },
  
   twoFactorEnabled: { type: Boolean, default: false }, 
   
 
});

const User = models?.User || model<IUser>("User", UserSchema);

export default User; 