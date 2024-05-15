import { Schema, model, models, Document } from "mongoose";

export interface IEmailVerification extends Document {
  email: string;
  token: string;
  expiresAt: Date;
}

const EmailVerificationSchema = new Schema({
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

const EmailVerification =
  models.EmailVerification ||
  model<IEmailVerification>("EmailVerification", EmailVerificationSchema);

export default EmailVerification;