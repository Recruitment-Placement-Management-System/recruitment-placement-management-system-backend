import type { RecruiterVerificationStatus } from "../../../domain/entities/recruiter-profile.entity.js";

export  interface UpdateRecruiterProfileDto{
    fullName?:string;
    designation?:string;
}

export  interface RecruiterProfileResponseDto{
    _id:string;
    userId:string;
    companyId:string;
    fullName:string;
    designation:string;
    verificationStatus:RecruiterVerificationStatus;
    createdAt:string;
    updatedAt:string;
}