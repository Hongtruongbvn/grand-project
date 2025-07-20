import { IsIn, IsNotEmpty } from 'class-validator';

export class ReactCommentDto {
  @IsNotEmpty()
  @IsIn(['like', 'love', 'haha', 'wow', 'sad', 'angry'])
  type: string;
}
