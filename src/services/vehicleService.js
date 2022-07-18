import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getVehicles(res) {
  const vehicles = await prisma.vehicle.findMany({});
  return vehicles;
}

export async function createVehicle(data) {
  console.log(data);
  await prisma.vehicle.create({
    data: {
      number_plate: data.number_plate,
    },
  });
}

export async function updateExitingVehicle(number_plate, departing_time) {
  const getVehicleId = await prisma.vehicle.findFirst({
    where: {
      number_plate: number_plate,
    },
  });
  await prisma.vehicle.update({
    where: {
      id: getVehicleId?.id,
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
