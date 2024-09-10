export class UpdateTaskDto {
  readonly title: string
  readonly description: string
  readonly userIds?: number[]
  readonly position: number
  readonly boardId?: number
  readonly preBoardId?: number
}
