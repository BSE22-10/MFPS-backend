import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const checkUser = async (email) => {
  const user = await prisma.admin.findFirst({
    where: {
      email: email,
    },
  });
  if (user) {
    throw new Error("Email already exists");
  } else {
    return true;
  }
};

export const signup = async (email, password) => {
  console.log(password);
  try {
    if (await checkUser(email)) {
      await prisma.admin.create({
        data: {
          email: email,
          password: await bcrypt.hash(password, 10),
        },
      });
    }
    return {
      message: "Admin created",
    };
  } catch (error) {
    throw error;
  }
};

export const login = async (email, password) => {
  try {
    const admin = await prisma.admin.findFirst({
      where: {
        email: email,
      },
    });
    if (!admin) {
      throw new Error("User does not exist");
    } else {
      return bcrypt
        .compare(password, admin.password)
        .then((isEqual) => {
          if (isEqual) {
            const token = jwt.sign({ email: email }, process.env.SECRET, {
              expiresIn: 1000,
            });
            userToken = token;
            return {
              auth: true,
              token: token,
            };
          } else {
            throw new Error("Invalid credentials");
          }
        })
        .catch((error) => {
          throw error;
        });
    }
  } catch (error) {
    throw error;
  }
};
