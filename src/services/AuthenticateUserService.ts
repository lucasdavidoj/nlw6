import { getCustomRepository } from "typeorm"

import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";

import { UsersRepositories } from "../repositories/UsersRepositories"



interface IAuthenticateResquest {
  email: string,
  password: string
}

class AuthenticateUserService {

  async execute({ email, password }: IAuthenticateResquest) {
    const usersRepositories = getCustomRepository(UsersRepositories);

    const user = await usersRepositories.findOne({
      email
    });

    if (!user) {
      throw new Error("Email/Password incorrect")
    }

    const passwordMatch = await compare(password, user.password)

    if (!passwordMatch) {
      throw new Error("Email/Password incorrect")
    }

    const token = sign(
      {
        email: user.email
      },
      "3c3fead7e43c32e1f554b4e05c00f183",
      {
        subject: user.id,
        expiresIn: "1d"
      }
    );

    return token;
  }
}

export { AuthenticateUserService }