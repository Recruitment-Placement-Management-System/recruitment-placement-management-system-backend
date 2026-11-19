export interface AddCandidateCertificationDto {
  name: string;
  issuingOrganization: string;
  issueDate?: string;
  expirationDate?: string;
  credentialId?: string;
  credentialUrl?: string;
}

export interface UpdateCandidateCertificationDto {
  index: number;
  name?: string;
  issuingOrganization?: string;
  issueDate?: string;
  expirationDate?: string;
  credentialId?: string;
  credentialUrl?: string;
}

export interface DeleteCandidateCertificationDto {
  index: number;
}
