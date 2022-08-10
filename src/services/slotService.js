import { PrismaClient } from "@prisma/client";
import moment from "moment";

const prisma = new PrismaClient();

const roundUp = (time) => {
  time = moment(time);
  var newTime =
    time.minute() || time.second() || time.millisecond()
      ? time.add(1, "hour").startOf("hour")
      : time.startOf("hour");
  //   console.log(newTime);
  return newTime.format("HH:mm a");
};

const roundDown = (minute) => {
  minute = moment(minute);
  return minute.startOf("hour").format("HH:mm a");
};

function compare(a, b) {
  // Use toUpperCase() to ignore character casing
  const bandA = a.time;
  const bandB = b.time;
  let comparison = 0;
  if (bandA > bandB) {
    comparison = 1;
  } else if (bandA < bandB) {
    comparison = -1;
  }
  return comparison;
}

const filterData = async (data, uniqueElement) => {
  var existingIds = [];
  const uniqueObjectsArray = [];
  data.map((info) => {
    if (existingIds.includes(info[`${uniqueElement}`])) {
      data.find((item, index) => {
        if (item[`${uniqueElement}`] === info[`${uniqueElement}`]) {
          data[index].count += 1;
        }
      });
    } else {
      uniqueObjectsArray.push(info);
      existingIds.push(info[`${uniqueElement}`]);
    }
  });
  return uniqueObjectsArray;
};

export const checkIfFloorIsFull = async (floor_id) => {
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
    console.log("Floor is full");
    return false;
  } else if (num === slots.length) {
    return true;
  } else {
    console.log("Not full yet");
    return false;
  }
};

export const checkIfSlotsAreValid = async (floor_id, number_of_slots) => {
  try {
    const floor = await prisma.floor.findFirst({
      where: {
        id: floor_id,
      },
    });

    if (number_of_slots > floor.no_of_slots) {
      throw new Error(`Floor has ${floor.no_of_slots} slots`);
    } else {
      return true;
    }
  } catch (error) {
    throw error;
  }
};

const checkIfFloorExists = async (floor_id) => {
  try {
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
    } else {
      throw new Error("Floor is full");
    }
    return { message: "Parking slot created" };
  } catch (error) {
    throw error;
  }
};

export const createMultipleSlots = async (floor_id, number_of_slots) => {
  try {
    if (
      (await checkIfFloorIsFull(floor_id)) === false &&
      (await checkIfSlotsAreValid(floor_id, number_of_slots))
    ) {
      for (var i = 0; i < number_of_slots; i++) {
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
    }
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
    const parkedCars = slots.length;
    console.log(parkedCars / 1);
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

export const timelyData = async () => {
  try {
    var data = [];
    var existingIds = [];
    const uniqueObjectsArray = [];
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
    var times = [];
    for (var i = 0; i < 24; i++) {
      times.push(moment(i + ":" + "00", "h:mm a").format("h:mm a"));
    }
    slots.map((slot) => {
      data.push({
        time:
          slot.createdAt.getMinutes() > 30
            ? roundUp(slot.createdAt).toString()
            : roundDown(slot.createdAt).toString(),
        count: 1,
      });
    });
    data.map((info) => {
      if (existingIds.includes(info.time)) {
        data.find((item, index) => {
          if (item.time === info.time) {
            data[index].count += 1;
          }
        });
      } else {
        uniqueObjectsArray.push(info);
        existingIds.push(info.time);
      }
    });
    // console.log(uniqueObjectsArray[2].time < uniqueObjectsArray[3].time);
    // console.log(uniqueObjectsArray.sort(compare));
    const dates = uniqueObjectsArray.sort(
      (objA, objB) => objA.time < objB.time
    );
    // console.log(dates);
    new Date(uniqueObjectsArray.sort(compare));
    return uniqueObjectsArray;
  } catch (error) {
    console.log(error);
  }
};

export const getWeeklyData = async () => {
  var data = [];
  var existingIds = [];
  const uniqueObjectsArray = [];
  var m = moment("2022-07-19T07:55:20.802Z");

  //   console.log(m.day());
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
    orderBy: {
      createdAt: "asc",
    },
  });
  console.log(slots);
  slots.map((slot) => {
    data.push({
      time: moment(slot.createdAt).format("dddd"),
      count: 1,
    });
  });

  return filterData(data, "time");
};
export const getMonthlyData = async () => {
  var data = [];
  var m = moment("2022-07-19T07:55:20.802Z");

  //   console.log(m.day());
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

  slots.map((slot) => {
    data.push({
      time: moment(slot.createdAt).format("MMMM"),
      count: 1,
    });
  });
  //   console.log(data);
  return filterData(data, "time");
};
