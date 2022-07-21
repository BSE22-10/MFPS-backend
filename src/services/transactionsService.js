import { PrismaClient } from "@prisma/client";
import moment from "moment";

const prisma = new PrismaClient();

const filterData = async (data, uniqueElement) => {
  var existingIds = [];
  const uniqueObjectsArray = [];
  data.map((info) => {
    if (existingIds.includes(info[`${uniqueElement}`])) {
      data.find((item, index) => {
        if (item[`${uniqueElement}`] === info[`${uniqueElement}`]) {
          console.log("here");
          data[index].count += item.count;
        }
      });
    } else {
      uniqueObjectsArray.push(info);
      existingIds.push(info[`${uniqueElement}`]);
    }
  });
  return uniqueObjectsArray;
};

export const getTransactionDetails = async () => {
  var data = [];
  const transations = await prisma.payment.findMany({
    where: {
      status: true,
    },
  });

  transations.map((transaction) => {
    data.push({
      date: moment(transaction.createdAt).format("DD/MM/YY"),
      count: transaction.bill,
    });
  });
  console.log(data);
  return filterData(data, "date");
};
