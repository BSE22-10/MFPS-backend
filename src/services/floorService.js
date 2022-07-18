import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const checkIfFloorExists = async (id) => {
  const floor = await prisma.floor.findFirst({
    where: {
      id: id,
    },
  });
  if (floor) {
    return true;
  } else {
    throw new Error({
      status: 400,
      message: "Floor does not exists",
    });
  }
};

export const getFloors = async () => {
  const floors = await prisma.floor.findMany({});
  return floors;
};

export const createFloor = async (no_of_slots) => {
  await prisma.floor.create({
    data: {
      no_of_slots: no_of_slots,
    },
  });
};

export const updateFloor = async (id, no_of_slots) => {
  if (await checkIfFloorExists(id)) {
    try {
      await prisma.floor.update({
        data: {
          no_of_slots: no_of_slots,
        },
        where: {
          id: id,
        },
      });
      return {
        message: "Floor updated",
      };
    } catch (error) {
      console.log(error);
    }
  }
};

export const deleteFloor = async (id) => {
  try {
    await prisma.floor.delete({
      where: {
        id: id,
      },
    });
  } catch (error) {
    console.log(error);
  }
};
