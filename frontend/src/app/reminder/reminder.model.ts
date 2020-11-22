export class Reminder {
  constructor(
    public id: string,
    public name: string,
    public deadline: Date,
    public creation: Date,
    public description: string,
    public notification: string
  ) {}
}
