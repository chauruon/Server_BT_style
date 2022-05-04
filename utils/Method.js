const formatDateMongoose = require("../utils/HandleDate/formatDate");

function removeDuplicatesByDate(arr) {
  const dates = arr.map((o) => formatDateMongoose(o.dateOrdered));
  const data = dates.filter((item, index) => {
    return !dates.includes(item, index + 1);
  });
  return data;
}

/**
 *
 * @param {*} myObject
 * @returns String
 */
function removeObjectIdByObject(myObject) {
  console.log(
    "🚀 ~ file: Method.js ~ line 17 ~ removeObjectIdByObject ~ myObject",
    myObject
  );
  delete myObject._id;
  return myObject.totalsales;
}

function removePropertiesFromArray(myarray) {
  const array = JSON.parse(myarray);

  const cleanArray = array.map((item) => {
    delete item._id;
    return item;
  });

  return cleanArray;
}

module.exports = {
  removeDuplicatesByDate,
  removePropertiesFromArray,
  removeObjectIdByObject,
};
