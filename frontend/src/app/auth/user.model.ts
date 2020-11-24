export class User {
  //might want to add tokenexpiration later
  constructor(
    public email: string,
    public id: string,
    private _token: string,
    public isAdmin: boolean
  ) {}

  get token() {
    return this._token;
  }
}
