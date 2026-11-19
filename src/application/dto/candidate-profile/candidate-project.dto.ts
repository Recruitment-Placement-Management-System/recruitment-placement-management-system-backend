export interface AddCandidateProjectDto {
  title: string;
  description?: string;
  technologies?: string[];
  projectUrl?: string;
  repositoryUrl?: string;
  startDate?: string;
  endDate?: string;
}

export interface UpdateCandidateProjectDto {
  index: number;
  title?: string;
  description?: string;
  technologies?: string[];
  projectUrl?: string;
  repositoryUrl?: string;
  startDate?: string;
  endDate?: string;
}

export interface DeleteCandidateProjectDto {
  index: number;
}
