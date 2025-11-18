import BaseModel from "./BaseModel";
import ComputeResourceReservation from "./ComputeResourceReservation";
import GroupAccountSSHProvisionerConfig from "./GroupAccountSSHProvisionerConfig";

const FIELDS = [
  "allocationProjectNumber",
  "preferredBatchQueue",
  "qualityOfService",
  "usageReportingGatewayId",
  "sshAccountProvisioner",
  {
    name: "groupSSHAccountProvisionerConfigs",
    type: GroupAccountSSHProvisionerConfig,
    list: true,
    default: BaseModel.defaultNewInstance(Array),
  },
  "sshAccountProvisionerAdditionalInfo",
  {
    name: "reservations",
    type: ComputeResourceReservation,
    list: true,
    default: BaseModel.defaultNewInstance(Array),
  },
];

export default class SlurmComputeResourcePreference extends BaseModel {
  constructor(data = {}) {
    super(FIELDS, data);
  }

  toJSON() {
    const json = { ...this };
    if (json.groupSSHAccountProvisionerConfigs) {
      json.groupSSHAccountProvisionerConfigs = json.groupSSHAccountProvisionerConfigs.map((cfg) =>
        typeof cfg.toJSON === "function" ? cfg.toJSON() : cfg
      );
    }
    if (json.reservations) {
      json.reservations = json.reservations.map((res) =>
        typeof res.toJSON === "function" ? res.toJSON() : res
      );
    }
    return json;
  }

  validate() {
    return {};
  }
}
