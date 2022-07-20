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
  var num = floor === null ? 0 : floor.no_of_slots;
  console.log(slots);
  if (num === 0 || slots.length === 0) {
    return false;
  } else if (num === slots.length) {
    return true;
  } else {
    console.log("Not full yet");
    return false;
  }
};

const checkIfFloorExists = async (floor_id) => {
  try {
    console.log("fLOOR");
    const floor = await prisma.floor.findFirst({
      where: {
        id: floor_id,
      },
    });
    if (floor) {
      return true;
    } else {
      throw new Error("Floor does not exist");
    }
  } catch (error) {
    throw error;
  }
};

const checkIfSlotExists = async (id) => {
  const slot = await prisma.parkingSlot.findFirst({
    where: {
      id: id,
    },
  });
  if (slot) {
    return true;
  } else {
    throw new Error("Slot does not exist");
  }
};

export const getSlots = async () => {
  const floors = await prisma.parkingSlot.findMany({});
  return floors;
};

export const createSlot = async (floor_id) => {
  try {
    if (
      ((await checkIfFloorExists(floor_id)) === true &&
        (await checkIfFloorIsFull(floor_id))) === false
    ) {
      await prisma.parkingSlot.create({
        data: {
          floor: {
            connect: {
              id: floor_id,
            },
          },
        },
      });
    }
    return { message: "Parking slot created" };
  } catch (error) {
    throw error;
  }
};

export const updateSlotStatus = async (id, status) => {
  if (await checkIfSlotExists(id)) {
    try {
      // await prisma.slotStatus.findFirst({
      //     where:{
      //         slo
      //     }
      // })
      await prisma.slotStatus.create({
        data: {
          status: status,
          slot: {
            connect: {
              id: id,
            },
          },
        },
      });
      return {
        message:
          status === true
            ? `Car has parked on slot ${id}`
            : `Car has left slot ${id}`,
      };
    } catch (error) {
      throw error;
    }
  }
};

export const deleteSlot = async (id) => {
  try {
    await prisma.parkingSlot.delete({
      where: {
        id: id,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

export const numberOfCarsOnEachFloor = async () => {
  try {
    var data = [];
    const uniqueObjectsArray = [];
    const uniqueGuys = new Set();
    var existingIds = [];
    const slots = await prisma.slotStatus.findMany({
      where: {
        status: true,
      },
      select: {
        createdAt: true,
        slot: {
          select: {
            floor_id: true,
          },
        },
      },
    });
    console.log(slots);

    slots.map((slot) => {
      data.push({
        floor_id: slot.slot.floor_id,
        count: 1,
      });
    });
    // for (const object of data) {
    //   const objectJSON = JSON.stringify(object);
    //   console.log(uniqueGuys.has(object.id));
    //   if (!uniqueObjectsArray.has(object.id)) {
    //     uniqueObjectsArray.push(object);
    //   }
    //   uniqueGuys.add(objectJSON);
    // }
    data.map((info) => {
      if (existingIds.includes(info.floor_id)) {
        // console.log(existingIds.indexOf(info.id));
        console.log(uniqueObjectsArray.indexOf(info.floor_id));
        data.find((item, index) => {
          if (item.floor_id === info.floor_id) {
            data[index].count += 1;
          }
        });
      } else {
        uniqueObjectsArray.push(info);
        existingIds.push(info.floor_id);
      }
    });
    console.log(uniqueObjectsArray);
    return uniqueObjectsArray;
  } catch (error) {}
};
