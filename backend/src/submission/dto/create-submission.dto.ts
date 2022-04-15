import { TestResultDto } from "./test-results.dto";

export class CreateSubmissionDto {
  user: {
    _id: string;
    username: string;
  };

  taskId: string;

  taskName: string;

  contestId: string;

  timestamp: Date;

  originalName: string;

  extension: string;

  solved: boolean;

  totalTestCases: number;

  correctTestCases: number;

  averageTime: number;

  file: string;

  size: number;

  testResults: TestResultDto[];
}
