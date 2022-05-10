import { Types } from "mongoose";

import { schemaOptions } from "@types";

import {
  prop,
  modelOptions,
  getModelForClass,
  Severity,
} from "@typegoose/typegoose";
import { Base, TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";

const isValidEmail = (v: string): boolean =>
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    v,
  );

@modelOptions({
  options: { customName: "user", allowMixed: Severity.ALLOW },
  schemaOptions,
})
export class IUser extends TimeStamps implements Base {
  _id: Types.ObjectId;
  id: string;

  @prop({
    required: true,
    unique: true,
    select: false,
    maxlength: 64,
    validate: { validator: isValidEmail, message: "Invalid email" },
  })
  email: string;

  @prop({ required: true, maxlength: 64 })
  name: string;

  @prop({ required: true, select: false })
  hash: string;
}

export const User = getModelForClass(IUser);
