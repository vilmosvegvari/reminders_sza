export class User {
  //might want to add tokenexpiration later
  constructor(
    public email: string,
    public id: string,
    private _token: string
  ) {}

  get token() {
    return this._token;
  }
}
