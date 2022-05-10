import { Types } from "mongoose";

import { schemaOptions } from "@types";

import {
  prop,
  modelOptions,
  getModelForClass,
  Severity,
} from "@typegoose/typegoose";
import { Base, TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";

export function unmaskCPF(cpf: string) {
  return cpf.replace(/\D/g, "");
}

@modelOptions({
  options: { customName: "client", allowMixed: Severity.ALLOW },
  schemaOptions,
})
export class IClient extends TimeStamps implements Base {
  _id: Types.ObjectId;
  id: string;

  @prop({ required: true, maxlength: 64 })
  name: string;

  @prop({ required: true, unique: true, set: unmaskCPF })
  cpf: string;

  @prop({ required: true })
  birthdate: Date;
}

export const Client = getModelForClass(IClient);
