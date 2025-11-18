import BaseModel from "./BaseModel";
import ResourceType from "./ResourceType";
import SlurmComputeResourcePreference from "./SlurmComputeResourcePreference";
import AwsComputeResourcePreference from "./AwsComputeResourcePreference";

const FIELDS = [
  "computeResourceId",
  "groupResourceProfileId",
  {
    name: "overridebyAiravata",
    type: "boolean",
    default: true,
  },
  "loginUserName",
  "preferredJobSubmissionProtocol",
  "preferredDataMovementProtocol",
  "scratchLocation",
  "resourceSpecificCredentialStoreToken",
  {
    name: "resourceType",
    type: ResourceType,
    required: true,
  },
  {
    name: "specificPreferences",
    type: null,
  },
];

const PREFERENCE_MODEL_MAP = {
  SLURM: SlurmComputeResourcePreference,
  AWS: AwsComputeResourcePreference,
};

export default class GroupComputeResourcePreference extends BaseModel {
  constructor(data = {}) {
    const topLevelAllocationProjectNumber = data.allocationProjectNumber;
    const rawSpecificPreferences = data.specificPreferences;

    super(FIELDS, data);

    const specificPrefsToUse = rawSpecificPreferences !== undefined && rawSpecificPreferences !== null
      ? rawSpecificPreferences
      : (data.specificPreferences !== undefined && data.specificPreferences !== null ? data.specificPreferences : null);

    if (specificPrefsToUse !== null) {
      this.specificPreferences = specificPrefsToUse;
    }

    if (this.resourceType && typeof this.resourceType === 'number') {
      this.resourceType = ResourceType.values.find(rt => rt.value === this.resourceType) || this.resourceType;
    }

    if (topLevelAllocationProjectNumber) {
      if (this.resourceType && this.resourceType.name === 'SLURM') {
        if (!this.specificPreferences) {
          this.specificPreferences = {};
        }
        if (typeof this.specificPreferences === 'object' && !(this.specificPreferences instanceof BaseModel)) {
          if (!this.specificPreferences.allocationProjectNumber) {
            this.specificPreferences.allocationProjectNumber = topLevelAllocationProjectNumber;
          }
        }
      } else if (!this.resourceType && topLevelAllocationProjectNumber) {
        this.resourceType = ResourceType.SLURM;
        if (!this.specificPreferences) {
          this.specificPreferences = {};
        }
        if (typeof this.specificPreferences === 'object' && !(this.specificPreferences instanceof BaseModel)) {
          if (!this.specificPreferences.allocationProjectNumber) {
            this.specificPreferences.allocationProjectNumber = topLevelAllocationProjectNumber;
          }
        }
      }
    }

    this._coerceSpecificPreferences();
  }

  toJSON() {
    const json = {...this};
    if (this.resourceType && this.resourceType.value !== undefined) {
      json.resourceType = this.resourceType.value;
    } else if (this.resourceType && this.resourceType.name) {
      json.resourceType = this.resourceType.name;
    }

    let specificPrefsPayload = this.specificPreferences;
    if (
      this.specificPreferences &&
      typeof this.specificPreferences.toJSON === "function"
    ) {
      specificPrefsPayload = this.specificPreferences.toJSON();
    }

    if (specificPrefsPayload && this.isResourceType("SLURM")) {
      json.specificPreferences = {slurm: specificPrefsPayload};
    } else if (specificPrefsPayload && this.isResourceType("AWS")) {
      json.specificPreferences = {aws: specificPrefsPayload};
    } else if (specificPrefsPayload) {
      json.specificPreferences = specificPrefsPayload;
    } else {
      json.specificPreferences = null;
    }

    return json;
  }

  _coerceSpecificPreferences() {
    // Ensure resourceType is properly set
    if (this.resourceType && typeof this.resourceType === 'number') {
      this.resourceType = ResourceType.byValue(this.resourceType) || ResourceType.values.find(rt => rt.value === this.resourceType) || this.resourceType;
    }

    if (!this.resourceType) {
      this.specificPreferences = null;
      return;
    }

    if (!this.resourceType.name) {
      return;
    }

    if (
      this.specificPreferences &&
      this.specificPreferences instanceof BaseModel
    ) {
      return;
    }
    let rawData =
      this.specificPreferences && typeof this.specificPreferences === "object"
        ? this.specificPreferences
        : null;

    if (rawData && !(rawData instanceof BaseModel)) {
      if (this.resourceType.name === 'SLURM' && 'slurm' in rawData) {
        rawData = rawData.slurm;
      } else if (this.resourceType.name === 'AWS') {
        if ('aws' in rawData) {
          rawData = rawData.aws;
        }
      }
    }

    const PreferenceModel = PREFERENCE_MODEL_MAP[this.resourceType.name];
    if (PreferenceModel) {
      const newPref = rawData
        ? new PreferenceModel(rawData)
        : new PreferenceModel();
      this.specificPreferences = newPref;
    } else {
      this.specificPreferences = rawData;
    }
  }

  resetSpecificPreferences(data = null) {
    if (!this.resourceType) {
      this.specificPreferences = null;
      return;
    }
    if (data && typeof data === "object") {
      this.specificPreferences = data;
    } else {
      this.specificPreferences = null;
    }
    this._coerceSpecificPreferences();
  }

  isResourceType(resourceTypeName) {
    return (
      !!this.resourceType && this.resourceType.name === resourceTypeName
    );
  }

  _ensureSpecificPreferences() {
    if (!this.specificPreferences) {
      this._coerceSpecificPreferences();
    }
  }

  _getSlurmField(fieldName, defaultValue) {
    if (this.isResourceType("SLURM") && this.specificPreferences) {
      return this.specificPreferences[fieldName];
    }
    return defaultValue;
  }

  _setSlurmField(fieldName, value) {
    if (!this.isResourceType("SLURM")) {
      return;
    }
    this._ensureSpecificPreferences();
    if (this.specificPreferences) {
      this.specificPreferences[fieldName] = value;
    }
  }

  get allocationProjectNumber() {
    return this._getSlurmField("allocationProjectNumber");
  }

  set allocationProjectNumber(value) {
    this._setSlurmField("allocationProjectNumber", value);
  }

  get preferredBatchQueue() {
    return this._getSlurmField("preferredBatchQueue");
  }

  set preferredBatchQueue(value) {
    this._setSlurmField("preferredBatchQueue", value);
  }

  get qualityOfService() {
    return this._getSlurmField("qualityOfService");
  }

  set qualityOfService(value) {
    this._setSlurmField("qualityOfService", value);
  }

  get usageReportingGatewayId() {
    return this._getSlurmField("usageReportingGatewayId");
  }

  set usageReportingGatewayId(value) {
    this._setSlurmField("usageReportingGatewayId", value);
  }

  get reservations() {
    return this._getSlurmField("reservations", []);
  }

  set reservations(value) {
    this._setSlurmField("reservations", value);
  }

  validate() {
    let validationResults = {};
    if (this.isEmpty(this.loginUserName)) {
      validationResults["loginUserName"] = "Please provide a login username.";
    }
    if (this.isEmpty(this.scratchLocation)) {
      validationResults["scratchLocation"] =
        "Please provide a scratch location.";
    }
    if (!this.resourceType) {
      validationResults["resourceType"] = "Please select a resource type.";
    }
    if (this.resourceType && this.specificPreferences) {
      const specificValidation = this.specificPreferences.validate();
      if (specificValidation && Object.keys(specificValidation).length > 0) {
        Object.assign(validationResults, specificValidation);
      }
    }
    return validationResults;
  }
}
