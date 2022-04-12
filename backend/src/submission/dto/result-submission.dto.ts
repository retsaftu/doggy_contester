import { TestResultDto } from "./test-results.dto";

export class ResultSubmissionDto {
  submissionId: string;

  tests: TestResultDto[];
}