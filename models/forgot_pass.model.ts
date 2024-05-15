import { Schema, model, models, Document } from "mongoose";

export interface IForgotPassWord extends Document {
  email: string;
  token: string;
  expiresAt: Date;
}

const ForgotPasswordSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
    unique: true
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

const ForgotPassword =
  models.ForgotPassword ||
  model<IForgotPassWord>("ForgotPassword", ForgotPasswordSchema);

export default ForgotPassword;