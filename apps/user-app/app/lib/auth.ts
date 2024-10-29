import { client } from "@repo/db/client";
import CredentialProvider from "next-auth/providers/credentials";
import bycrypt from "bcrypt";

export const authOptions = {
  providers: [
    CredentialProvider({
      name: `Credentials`,
      credentials: {
        phone: {
          label: "Phone Number",
          type: "text",
          placeholder: "1212312344",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any) {
        const hashedPasswod = await bycrypt.hash(credentials.password, 10);
        const existingUser = await client.user.findFirst({
          where: {
            number: credentials.phone,
          },
        });
        if (existingUser) {
          const passwordValidation = await bycrypt.compare(
            credentials.password,
            existingUser.password
          );
          if (passwordValidation) {
            return {
              id: existingUser.id.toString(),
              name: existingUser.name,
              email: existingUser.email,
            };
          }
          return null;
        }
        try {
          const user = await client.user.create({
            data: {
              number: credentials.phone,
              password: credentials.password,
            },
          });
          return {
            id: user.id.toString(),
            name: user.name,
            email: user.email,
          };
        } catch (error) {
          console.log(error);
        }
        return null;
      },
    }),
  ],
  secret: process.env.JWT_SECRET || "secret",
};
