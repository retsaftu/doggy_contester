export class CreateSubmissionDto {
  taskId: string;

  contestId: string;

  userId: string;

  timestamp: Date;

  file: string;

  originalName: string;

  size: number;

  extension: string;
}
