export enum PrivacyEnum {
  PUBLIC = "PUBLIC",
  PRIVATE = "PRIVATE",
}

export function isPrivacyEnum(value: string | undefined): boolean {
  if (value === undefined || value === null) {
    return false;
  }

  return Object.values(PrivacyEnum).includes(value as PrivacyEnum);
}