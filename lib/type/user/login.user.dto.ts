// export class LoginUserDto {
//   constructor(
//     email: string,
//     password: string
//   ) {
//     this.email = email;
//     this.password = password;
//   }

//   readonly email: string;
//   readonly password: string;
// }

export type LoginUserDto = {
  readonly email: string;
  readonly password: string;
}
