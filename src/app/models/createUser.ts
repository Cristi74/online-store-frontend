export class CreateUser {
  constructor(
    public firstName: string = '',
    public lastName: string = '',
    public email: string = '',    
    public username: string = '',
    public telephone: string = '',
    public sex: string = '',
    public password: string = '',
    public token: string='',
    public addressEntity: {
      address: string;
      city: string;
      county: string;
      postalCode: string;
    } = {
      address: '',
      city: '',
      county: '',
      postalCode: '',
    }
  ) {}
}
