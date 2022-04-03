export class CreateSubmissionDto {
  userId: string;
  
  taskId: string;

  contestId: string;

  timestamp: Date;

  file: string;

  originalName: string;

  size: number;

  mimetype: string;
}
