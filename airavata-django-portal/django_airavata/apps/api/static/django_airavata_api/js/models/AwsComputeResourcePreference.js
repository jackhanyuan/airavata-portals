import BaseModel from "./BaseModel";

const FIELDS = [
  "region",
  "preferredAmiId",
  "preferredInstanceType",
];

export default class AwsComputeResourcePreference extends BaseModel {
  constructor(data = {}) {
    super(FIELDS, data);
  }

  toJSON() {
    return { ...this };
  }

  validate() {
    return {};
  }
}
