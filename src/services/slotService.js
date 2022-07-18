import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const checkIfFloorIsFull = async (floor_id) => {
  const slots = await prisma.parkingSlot.findMany({
    where: {
      floor_id: floor_id,
    },
  });

  const floor = await prisma.floor.findFirst({
    where: {
      id: floor_id,
    },
  });
  if (floor.no_of_slots === slots.length()) {
    return true;
  } else {
    return false;
  }
};

const checkIfSlotExists = async (id) => {
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
      message: "Slot does not exist",
    });
  }
};

export const getSlots = async () => {
  const floors = await prisma.floor.findMany({});
  return floors;
};

export const createSlot = async (floor_id, no_of_slots) => {
  if (await checkIfFloorIsFull(floor_id)) {
    await prisma.floor.create({
      data: {
        no_of_slots: no_of_slots,
      },
    });
  }
};

export const updateSlot = async (id, no_of_slots) => {
  if (await checkIfSlotExists(id)) {
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
        message: "Slot updated",
      };
    } catch (error) {
      console.log(error);
    }
  }
};

export const deleteSlot = async (id) => {
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
