import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const checkNumberPlate = async (plate) => {
  const numberPlate = await prisma.accounts.findFirst({
    where: {
      number_plate: plate,
    },
  });
  if (!numberPlate) {
    throw new Error("Number plate does not exist");
  }
};

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

export const updateAccountPayment = async (data) => {
  const { number_plate, amount } = data;
  try {
    await checkNumberPlate(number_plate);
    const currentAmount = await prisma.accounts.findFirst({
      where: { number_plate: number_plate },
    });
    await prisma.accounts.update({
      data: {
        amountPaid: currentAmount.amountPaid + amount,
      },
      where: {
        number_plate: number_plate,
      },
    });
    return {
      message: "Account updated successfully",
    };
  } catch (error) {
    throw error;
  }
};
