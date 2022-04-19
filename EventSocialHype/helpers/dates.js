const moment = require("moment");

exports.yearStartDate = year => `${year}-01-01`;

exports.yearEndDate = year => `${year}-12-31`;

exports.yearFromDate = date => Number(moment(date, "YYYY-MM-DD").format("Y"));

exports.monthFromDate = date => Number(moment(date, "YYYY-MM-DD").format("M"));

exports.monthStartDate = (year, month) => `${year}-${month}-01`;

exports.monthName = month =>
  moment()
    .month(month - 1)
    .format("MMM");

exports.monthEndDate = (year, month) =>
  `${year}-${month}-${moment(`${year}-${month}`, "YYYY-MM").daysInMonth()}`;

exports.todaysDate = () => moment().format("YYYY-MM-DD");

exports.currentDay = Number(moment().format("D"));
exports.currentMonth = Number(moment().format("M"));
exports.currentYear = Number(moment().format("Y"));

exports.previousMonth = ({ year, month }) => {
  const prevousMonthDate = moment(`${year}-${month}`, "YYYY-MM-DD").subtract(
    1,
    "months"
  );

  return {
    month: prevousMonthDate.month() + 1,
    year: prevousMonthDate.year()
  };
};

exports.dateDIffInDays = ({ startDate, endDate }) => {
  const fromDate = moment(startDate);
  const toDate = moment(endDate);
  const days = toDate.diff(fromDate, "days");
  return Number(days) + 1; // first day inclusive
};

exports.numberOfMonthsInDateRange = ({ startDate, endDate }) => {
  const fromDate = moment(startDate);
  const toDate = moment(endDate);
  const months = toDate.diff(fromDate, "months");
  return Number(months) + 1; // Selected month inclusive
};

exports.nextMonth = ({ year, month }) => {
  const nextMonthDate = moment(`${year}-${month}`, "YYYY-MM-DD").add(
    1,
    "months"
  );

  return {
    nextMonth: nextMonthDate.month() + 1,
    nextYear: nextMonthDate.year()
  };
};

exports.daysInMonth = ({ year, month }) =>
  moment(`${year}-${month}`, "YYYY-MM").daysInMonth();

exports.monthsInYearToDate = year => {
  let currentMonthsInYear = Number(moment().format("M"));

  const currentYear = Number(moment().format("Y"));

  if (currentYear !== Number(year)) {
    currentMonthsInYear = 12;
  }
  if (currentYear < year) {
    currentMonthsInYear = 0;
  }

  const monthsInYearToDate = [];

  for (let index = 1; index <= currentMonthsInYear; index += 1) {
    monthsInYearToDate.push(index);
  }

  return monthsInYearToDate;
};

exports.monthsInDateRange = ({ startDate, endDate, months = [] }) => {
  const currentDate = moment(startDate, "YYYY-MM");
  const month = Number(currentDate.format("M"));
  const year = Number(currentDate.format("Y"));

  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();

  if (start > end) {
    return months;
  }

  months.push({
    name: `${currentDate.format("MMMM")} ${year}`,
    monthName: currentDate.format("MMMM"),
    year,
    month
  });

  const { nextMonth, nextYear } = this.nextMonth({ year, month });
  const nextMonthDate = moment(`${nextYear}-${nextMonth}`, "YYYY-MM").format(
    "YYYY-MM"
  );

  return this.monthsInDateRange({ startDate: nextMonthDate, endDate, months });
};

exports.monthlyDateRanges = ({ startDate, endDate }) => {
  // group dates by months and year
  const monthsInDates = this.monthsInDateRange({ startDate, endDate });

  // get date range for each month
  const dateRanges = monthsInDates.map((monthData, index, arr) => {
    let monthStartDate = `${monthData.year}-${monthData.month}-01`;
    let monthEndDate = `${monthData.year}-${
      monthData.month
    }-${this.daysInMonth({ year: monthData.year, month: monthData.month })}`;

    if (index === 0) {
      monthStartDate = startDate;
    }
    if (index === arr.length - 1) {
      monthEndDate = endDate;
    }
    return {
      month: monthData.month,
      year: monthData.year,
      monthStartDate,
      monthEndDate
    };
  });

  // return date ranges for each month in the given date range
  return dateRanges;
};

exports.currentWeeks = currentDate => {
  const weekStart = currentDate.clone().startOf("week");
  const weekEnd = currentDate.clone().endOf("week");

  const days = [];
  for (let i = 0; i <= 6; i++) {
    days.push(
      moment(weekStart)
        .add(i, "days")
        .format("MM-DD")
    );
  }
  console.log(days);
  return days;
};
