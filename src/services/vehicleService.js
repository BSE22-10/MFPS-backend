import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

var payment = true;

//Gets the bill basing on the time spent in the parking
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

//Updates the payment status of the vehicle
async function updatePayment(number_plate) {
  var payment = (await getVehicle(number_plate)).payment_id;
  if (payment) {
    await prisma.payment.update({
      where: {
        id: payment,
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

async function getVehicle(number_plate) {
  const vehicles = await prisma.vehicle.findMany({
    where: {
      number_plate: number_plate,
    },
    orderBy: {
      arrival_time: "asc",
    },
  });
  console.log(vehicles);
  return vehicles[0];
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
        id: await getVehicle(number_plate).id,
      },
      data: {
        departing_time: new Date(),
      },
    });
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
  await updatePayment(number_plate);
}

export async function deleteVehicle(id) {
  await prisma.vehicle.delete({
    where: {
      id: id,
    },
  });
}

export async function checkPaymentStatus(number_plate) {
  try {
    const vehicles = await prisma.vehicle.findMany({
      where: {
        number_plate: number_plate,
      },
      orderBy: {
        arrival_time: "asc",
      },
    });
    const payment = await prisma.payment.findFirst({
      where: {
        id: vehicles[0].payment_id,
        status: true,
      },
    });
    if (payment) {
      return {
        message: "Payment successful",
      };
    } else {
      throw new Error("No payment made");
    }
  } catch (error) {
    throw error;
  }
}
