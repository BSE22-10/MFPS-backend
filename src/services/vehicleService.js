import { PrismaClient } from "@prisma/client";
import moment from "moment";
import nodemailer from "nodemailer";

const prisma = new PrismaClient();

var payment = true;

const getCurrentAmount = async (number_plate) => {
  const amount = await prisma.accounts.findFirst({
    where: {
      number_plate: number_plate,
    },
  });
  return amount.amountPaid;
};

//Gets the bill basing on the time spent in the parking
async function makeBill(payment_id, arrivalTime, departingTime) {
  var hours = Math.abs(departingTime - arrivalTime) / 36e5;
  var minutes = (Math.abs(departingTime - arrivalTime) / (1000 * 60)) % 60;

  const payment = await prisma.payment.update({
    where: {
      id: payment_id,
    },
    data: {
      bill: Math.floor(hours * 10),
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
      arrival_time: "desc",
    },
  });
  //   console.log(vehicles);
  return vehicles[0];
}

export async function getVehicles() {
  const vehicles = await prisma.vehicle.findMany({});
  return vehicles;
}

export async function createVehicle(data) {
  const vehicle = await prisma.vehicle.create({
    data: {
      number_plate: data.number_plate,
      account: {
        connect: {
          number_plate: data.number_plate,
        },
      },
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
  // console.log((await getVehicle(number_plate)).id);
  if (await checkIfVehicleExists(number_plate)) {
    const vehicle = await prisma.vehicle.update({
      where: {
        id: (await getVehicle(number_plate)).id,
      },
      data: {
        departing_time: new Date(),
      },
    });
    const bill = await makeBill(
      vehicle.payment_id,
      vehicle.arrival_time,
      vehicle.departing_time
    );
    await prisma.accounts.update({
      where: {
        number_plate: number_plate,
      },
      data: {
        amountPaid: (await getCurrentAmount(number_plate)) - bill,
      },
    });
    const account = await prisma.accounts.findFirst({
      where: {
        number_plate: number_plate,
      },
    });

    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    if (account.amountPaid < 24) {
      var mailOptions = {
        from: "trevodex@gmail.com",
        to: "angulotrevor@gmail.com",
        subject: "Feedback",
        html: `<html><body><p>Your account balance is low, please top up by visiting <a href='localhost:3000/homePayment'>here</a></p></body></html>`,
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
    }
    var mailOptions = {
      from: "trevodex@gmail.com",
      to: "angulotrevor@gmail.com",
      subject: "Feedback",
      html: `<html><body><p>${bill} was deducted from your account today</p></body></html>`,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
    await updatePayment(number_plate);

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
        arrival_time: "desc",
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

export async function checkIfVehicleCreated() {
  try {
    var time = new Date();
    // console.log(time.getMinutes());
    // const vehicle = await prisma.vehicle.findFirst({
    //   where: {
    //     arrival_time: { gte: time.getMinutes() - 4 },
    //   },
    // });
    // console.log(vehicle);
    const times = await prisma.vehicle.findMany({
      orderBy: {
        arrival_time: "desc",
      },
    });
    const diff = Math.round(
      (((time - times[0].arrival_time) % 86400000) % 3600000) / 60000
    );
    const compare = moment(time, "DD/MM/YYYY HH:mm:ss").diff(
      moment(times[0].arrival_time, "DD/MM/YYYY HH:mm:ss")
    );
    var d = moment.duration(compare);
    // console.log(d.asMinutes());
    if (d.asMinutes() <= 1) {
      return {
        message: "Created",
      };
    } else {
      throw new Error("Vehicle not created");
    }
  } catch (error) {
    throw error;
  }
}

export async function getEmail(number_plate) {
  try {
    const driver = await prisma.accounts.findFirst({
      where: {
        number_plate: number_plate,
      },
    });
    if (driver) {
      return {
        email: driver.email,
      };
    } else {
      throw new Error("Number plate does not exist");
    }
  } catch (error) {
    throw error;
  }
}
