
const yymmdd = date => {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return `${year}-${month}-${day}`;
};

const format = (date, formatString) => {
  if (formatString === "yy-mm-dd") return yymmdd(date);

  console.warn("given date format is not found");
  return yymmdd(date);
};

module.exports = {
  format
}