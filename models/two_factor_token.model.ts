import { Schema, model, models, Document } from "mongoose";

export interface ITwoFactorToken extends Document {
  email: string;
  token: string;
  expiresAt: Date;
}

const TwoFactorTokenSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
    unique: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

const TwoFactorToken =
  models.TwoFactorToken ||
  model<ITwoFactorToken>("TwoFactorToken", TwoFactorTokenSchema);
export default TwoFactorToken;

export interface ITwoFactorConfimation extends Document {
  user: string;
  expiresAt: Date;
}

const TwoFactorConfimationSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

export const TwoFactorConfirmation =
  models.TwoFactorConfirmation ||
  model<ITwoFactorConfimation>(
    "TwoFactorConfirmation",
    TwoFactorConfimationSchema,
  );
