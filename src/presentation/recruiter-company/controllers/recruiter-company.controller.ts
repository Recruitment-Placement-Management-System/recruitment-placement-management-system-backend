import type { RequestHandler } from "express";
import type { ITokenService } from "../../../application/interfaces/services/token.service.js";
import type { GetRecruiterCompanyUseCase } from "../../../application/use-cases/recruiter-company/get-recruiter-company.use-case.js";
import type { UpdateRecruiterCompanyUseCase } from "../../../application/use-cases/recruiter-company/update-recruiter-company.use-case.js";
import type { RecruiterCompanyResponseMapper } from "../mappers/recruiter-company-response.mapper.js";
import { HttpStatus } from "../../../shared/constants/http-status.js";

export interface RecruiterCompanyControllerDependencies {
  getRecruiterCompanyUseCase: GetRecruiterCompanyUseCase;
  updateRecruiterCompanyUseCase: UpdateRecruiterCompanyUseCase;
  recruiterCompanyResponseMapper: RecruiterCompanyResponseMapper;
  tokenService: ITokenService;
}

export const createRecruiterCompanyController = (dependencies: RecruiterCompanyControllerDependencies) => {
  const wrap = (handler: RequestHandler): RequestHandler =>
    (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);

  return {
    get: wrap(async (req, res) => {
      const company = await dependencies.getRecruiterCompanyUseCase.execute(req.user!.userId);
      res.status(HttpStatus.OK).json({
        message: "Company profile retrieved successfully",
        company: dependencies.recruiterCompanyResponseMapper.toDto(company),
      });
    }),

    update: wrap(async (req, res) => {
      const company = await dependencies.updateRecruiterCompanyUseCase.execute(req.user!.userId, req.body);
      res.status(HttpStatus.OK).json({
        message: "Company profile updated successfully",
        company: dependencies.recruiterCompanyResponseMapper.toDto(company),
      });
    }),
  };
};