import { PrismaClient } from "@prisma/client";
// import { jwtVerify } from "../middleware";
const prisma = new PrismaClient();

//Check if a floor exists
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

//Gettting all the floors
export const getFloors = async () => {
  const floors = await prisma.floor.findMany({});
  return floors;
};

//Creating a new floor
export const createFloor = async (no_of_slots, name) => {
  await prisma.floor.create({
    data: {
      name: name,
      no_of_slots: no_of_slots,
    },
  });
};

//Updating a floor
export const updateFloor = async (id, body) => {
  if (await checkIfFloorExists(id)) {
    try {
      const currentFloor = await prisma.floor.findFirst({ where: { id: id } });
      var no_of_slots = body.no_of_slots;
      body.no_of_slots !== undefined
        ? body.no_of_slots
        : currentFloor.no_of_slots;
      console.log(no_of_slots);
      var name = body.name !== undefined ? body.name : currentFloor.name;
      //Update the floor information
      await prisma.floor.update({
        data: {
          no_of_slots: no_of_slots,
          name: name,
        },
        where: {
          id: id,
        },
      });
      //Delete all the slots attached to the floor
      await prisma.parkingSlot.deleteMany({
        where: {
          floor_id: id,
        },
      });
      //Create the slots for the floor
      for (var i = 0; i < no_of_slots; i++) {
        await prisma.parkingSlot.create({
          data: {
            floor: {
              connect: {
                id: id,
              },
            },
          },
        });
      }
      //Return message
      return {
        message: "Floor updated",
      };
    } catch (error) {
      console.log(error);
    }
  }
};

//Delete a floor
export const deleteFloor = async (id) => {
  try {
    if (checkIfFloorExists(id)) {
      await prisma.floor.delete({
        where: {
          id: id,
        },
      });
    }
  } catch (error) {
    console.log(error);
  }
};

//Get the slots for a specific floor
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

//Creating multiple parking slots per floor
export const createFloorWithManySlots = async (number_of_slots, name) => {
  try {
    const floor = await prisma.floor.create({
      data: {
        no_of_slots: number_of_slots,
        name: name,
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
