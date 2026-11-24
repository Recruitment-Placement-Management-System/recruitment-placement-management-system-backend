export class SavedJob {
  constructor(
    public readonly id: string | undefined,
    public readonly userId: string,
    public readonly jobId: string,
    public readonly createdAt: Date = new Date(),
  ) {}
}
