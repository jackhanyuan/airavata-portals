import BaseModel from "./BaseModel";

const FIELDS = [
  "resourceId",
  "groupResourceProfileId",
  "configName",
  "configValue",
];

export default class GroupAccountSSHProvisionerConfig extends BaseModel {
  constructor(data = {}) {
    super(FIELDS, data);
  }

  toJSON() {
    return { ...this };
  }
}
