import { TestCaseDto } from "./test-case.dto";

export class TaskDto {
  _id: string;
  index: string;
  name: string;
  description: string;
  time: string;
  memory: string;
  examples: TestCaseDto[];
  tests: TestCaseDto[];
}