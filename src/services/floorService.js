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

export const checkIfFloorIsFull = async (floor_id) => {
  const slots = await prisma.parkingSlot.findMany({
    where: {
      floor_id: floor_id,
    },
    orderBy: {
      createdAt: "desc",
    },
  
    
  });

console.log(slots)

  const floor = await prisma.floor.findFirst({
    where: {
      id: floor_id,
    },
  });
  var num = floor === null ? 0 : floor.no_of_slots;
  if (num === 0 || slots.length === 0) {
    console.log("Floor is full");
    return false;
  } else if (num === slots.length) {
    return true;
    console.log("Yeah")
  } else {
    console.log("Not full yet");
    return false;
  }
};

//Check if parking is full
export const checkIfParkingIsFull = async() => {
  try {
     var num = 0
    const check = await prisma.floor.findMany({
    })
    var parking = await Promise.all(check.map(async floor => {
       console.log(await checkIfFloorIsFull(floor.id))
       if(await checkIfFloorIsFull(floor.id) == true){
        ++num 
       }
       return num
    }))
    console.log(parking[0])
    return ({
      status: parking[0] == check.length
    })
  } catch (error) {
    
  }
}
