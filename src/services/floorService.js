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
    throw new Error("Floor does not exist");
  }
};

export const getFloors = async () => {
  const floors = await prisma.floor.findMany({});
  return floors;
};

export const createFloor = async (no_of_slots, name) => {
  await prisma.floor.create({
    data: {
      name: name,
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

export const getSlotsForASpecificFloor = async (id) => {
  try {
    const slots = await prisma.parkingSlot.findMany({
      where: {
        floor_id: id,
      },
      include: {
        SlotStatus: {
          orderBy: {
            createdAt: "desc",
          },
          select: {
            status: true,
          },
          take: 1,
        },
      },
    });
    return slots;
  } catch (error) {
    console.log(error);
  }
};

export const createFloorWithManySlots = async (number_of_slots) => {
  try {
    const floor = await prisma.floor.create({
      data: {
        no_of_slots: number_of_slots,
      },
    });
    for (var i = 0; i < number_of_slots; i++) {
      await prisma.parkingSlot.create({
        data: {
          floor: {
            connect: {
              id: floor.id,
            },
          },
        },
      });
    }
    return {
      message: "Floor created",
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};
