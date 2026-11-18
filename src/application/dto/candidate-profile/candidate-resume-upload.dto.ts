export interface CandidateResumeUploadDto {
  buffer: Buffer;
  contentType: "application/pdf" | "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  fileName: string;
  fileSize: number;
}
