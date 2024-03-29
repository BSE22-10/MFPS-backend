import { PrismaClient } from "@prisma/client";
import moment from "moment";

const prisma = new PrismaClient();

const filterData = async (data, uniqueElement) => {
  var existingIds = [];
  const uniqueObjectsArray = [];
  data.map((info) => {
    var check = 0;
    if (existingIds.includes(info[`${uniqueElement}`])) {
      data.find((item, index) => {
        if (item[`${uniqueElement}`] === info[`${uniqueElement}`]) {
          data[index].count += info.count;
        }
      });
      check++;
    } else {
      uniqueObjectsArray.push(info);
      existingIds.push(info[`${uniqueElement}`]);
    }
  });
  // Object.keys(uniqueObjectsArray).forEach((key) => {
  //   {
  //     obj[key] === "count" && obj[key].toLocaleString("en-US");
  //   }
  // });
  console.log(uniqueObjectsArray);
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
      // .toLocaleString("en-US"),
      // transaction.bill,
    });
  });
  // console.log(data);
  // console.log(data);
  return filterData(data, "date");
};
