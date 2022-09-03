import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";

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

const signup = async (email, password) => {
  try {
    if (await checkUser(email)) {
      const admin = await prisma.admin.create({
        data: {
          email: email,
          password: bcrypt.hash(password),
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

const login = async (email, password) => {
  try {
    const admin = await prisma.admin.findFirst({
      where: {
        email: email,
      },
    });
    if (!admin) {
      throw new Error("User does not exist");
    } else {
      bcrypt.compare(admin.password, password, (error, response) => {
        if (response) {
          const token = jwt.sign({ email }, process.env.SECRET, {
            expiresIn: 1000,
          });
        } else {
          throw new Error("Invalid credentials");
        }
      });
    }
  } catch (error) {
    throw error;
  }
};
