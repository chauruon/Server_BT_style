async function AggregateSalesOfDay({ day, model }) {
  const totalOrder = await model.aggregate([
    {
      $match: {
        dateOrdered: {
          $gte: new Date(day),
        },
      },
    },
    {
      $group: {
        _id: null,
        totalsales: {
          $sum: "$totalFinalPrice",
        },
      },
    },
  ]);
  return totalOrder.pop();
}
async function AggregateSalesOfDayByStatus({ day, model, status }) {
  const totalOrder = await model.aggregate([
    {
      $match: {
        dateOrdered: {
          $gte: new Date(day),
        },
        status: status,
      },
    },
    {
      $group: {
        _id: null,
        totalsales: {
          $sum: "$totalFinalPrice",
        },
      },
    },
  ]);

  if (totalOrder.length == 0) {
    // Works
    return { _id: null, totalsales: 0 };
  } else {
    return totalOrder.pop();
  }
}
module.exports = { AggregateSalesOfDay, AggregateSalesOfDayByStatus };
