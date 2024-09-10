export class CreateTaskDto {
  title: string
  description: string
  userIds: number[]
  position?: number
  createdAt: string
  readonly boardId: number
}
