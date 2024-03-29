import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

//Checking if the new number plate exists in the database
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

//Creating an account
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
  // var { number_plate } = body;
  try {
    const plate = await prisma.accounts.findFirst({
      where: {
        number_plate: number_plate,
      },
    });
    console.log(number_plate);
    if (!plate) {
      throw new Error("Plate does not exist");
    }
  } catch (error) {
    throw error;
  }
};

//Logic for updating account payment status
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

//Checking account balance
export const checkBalance = async (number_plate) => {
  try {
    const account = await prisma.accounts.findFirst({
      where: {
        number_plate: number_plate,
      },
    });
    if (account) {
      if (account.amountPaid <= 5) {
        throw new Error("Please top up before you leave");
      } else {
        return {
          message: "Account is ok",
        };
      }
    } else {
      throw new Error("Not registered");
    }
  } catch (error) {
    throw error;
  }
};
