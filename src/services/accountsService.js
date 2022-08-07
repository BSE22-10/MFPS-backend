import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createAccount = async (accountInfo) => {
  const { email, number_plate, amount } = accountInfo;
  try {
    await prisma.accounts.create({
      data: {
        email: email,
        number_plate: number_plate,
        amountPaid: amount,
      },
    });
    return {
      message: "Account created",
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};
