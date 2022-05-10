import { Types } from "mongoose";

import { schemaOptions } from "@types";

import {
  prop,
  modelOptions,
  getModelForClass,
  Severity,
} from "@typegoose/typegoose";
import { Base, TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";

@modelOptions({
  options: { customName: "client", allowMixed: Severity.ALLOW },
  schemaOptions,
})
export class IClient extends TimeStamps implements Base {
  _id: Types.ObjectId;
  id: string;

  @prop({ required: true, maxlength: 64 })
  name: string;

  @prop({ required: true, unique: true })
  cpf: string;

  @prop({ required: true })
  birthdate: string;
}

export const Client = getModelForClass(IClient);
