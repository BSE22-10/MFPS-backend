import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

var payment = false;

async function checkPaymentStatus(vehicle_id) {
  if (payment) {
    await prisma.payment.update({
      where: {
        Vehicle: {
          connect: {
            id: vehicle_id,
          },
        },
      },
      data: {
        status: true,
      },
    });
    return false;
  } else {
    return false;
  }
}

export async function getVehicles(res) {
  const vehicles = await prisma.vehicle.findMany({});
  return vehicles;
}

export async function createVehicle(data) {
  console.log(data);
  const vehicle = await prisma.vehicle.create({
    data: {
      number_plate: data.number_plate,
    },
  });

  await prisma.payment.create({
    data: {
      Vehicle: {
        connect: {
          id: vehicle.id,
        },
      },
    },
  });
}

export async function updateExitingVehicle(number_plate, departing_time) {
  const getVehicleId = await prisma.vehicle.findMany({
    where: {
      number_plate: number_plate,
    },
    orderBy: {
      arrival_time: "asc",
    },
  });
  await prisma.vehicle.update({
    where: {
      id: getVehicleId[0].id,
    },
    data: {
      departing_time: departing_time,
    },
  });
}

export async function deleteVehicle(id) {
  await prisma.vehicle.delete({
    where: {
      id: id,
    },
  });
}
