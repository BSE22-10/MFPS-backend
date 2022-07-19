import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

var payment = false;

async function makeBill(payment_id, arrivalTime, departingTime) {
  var hours = Math.abs(departingTime - arrivalTime) / 36e5;
  console.log(hours);
  const payment = await prisma.payment.update({
    where: {
      id: payment_id,
    },
    data: {
      bill: Math.floor(hours * 200),
    },
  });
  return payment.bill;
}

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

async function checkIfVehicleExists(number_plate) {
  try {
    const vehicle = await prisma.vehicle.findFirst({
      where: {
        number_plate: number_plate,
      },
    });
    if (vehicle) {
      return true;
    } else {
      console.log("failed");
      throw new Error("Vehicle does not exist");
    }
  } catch (error) {
    throw error;
  }
}

async function getVehicleId(number_plate) {
  const vehicles = await prisma.vehicle.findMany({
    where: {
      number_plate: number_plate,
    },
    orderBy: {
      arrival_time: "asc",
    },
  });
  console.log(vehicles);
  return vehicles[0].id;
}

export async function getVehicles() {
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

export async function updateExitingVehicle(number_plate) {
  //   console.log(data);
  number_plate = String(number_plate);
  console.log(number_plate);
  if (await checkIfVehicleExists(number_plate)) {
    const vehicle = await prisma.vehicle.update({
      where: {
        id: await getVehicleId(number_plate),
      },
      data: {
        departing_time: new Date(),
      },
    });
    console.log(vehicle);

    return {
      message: `Your bill is ${await makeBill(
        vehicle.payment_id,
        vehicle.arrival_time,
        vehicle.departing_time
      )}`,
    };
  } else {
    return {
      message: "Car does not exist",
    };
  }
}

export async function makePayment(number_plate) {
  checkPaymentStatus();
}

export async function deleteVehicle(id) {
  await prisma.vehicle.delete({
    where: {
      id: id,
    },
  });
}
