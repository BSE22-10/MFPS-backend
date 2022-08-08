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

export const checkPlate = async (number_plate) => {
  try {
    const plate = prisma.accounts.findFirst({
      where: {
        number_plate: number_plate,
      },
    });

    if (!plate) {
      throw new Error("Plate does not exist");
    }
  } catch (error) {
    throw error;
  }
};

export const updateAccountPayment = async (email, amount) => {
  try {
    const currentAmount = prisma.accounts.findFirst({
      where: { email: email },
    });
    await prisma.accounts.update({
      data: {
        amountPaid: currentAmount.amountPaid + amount,
      },
      where: {
        email: email,
      },
    });
    return {
      message: "Account updated successfully",
    };
  } catch (error) {
    throw error;
  }
};
