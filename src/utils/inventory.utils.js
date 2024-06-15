const filterData = (query, data) => {
  let filteredData = [...data];
  console.log("filterd Dta :", query);
  if (query.make) {
    let makes = Array.isArray(query.make) ? query.make : [query.make];
    makes = makes[0].split(",");
    filteredData = filteredData.filter((item) => makes.includes(item.brand));
  }

  if (query.duration) {
    const durations = Array.isArray(query.duration)
      ? query.duration
      : [query.duration];
    const currentDate = new Date();
    let startDate;

    filteredData = filteredData.filter((item) => {
      for (let duration of durations) {
        switch (duration) {
          case "last-month":
            startDate = new Date(
              currentDate.getFullYear(),
              currentDate.getMonth() - 1,
              1
            );
            break;
          case "this-month":
            startDate = new Date(
              currentDate.getFullYear(),
              currentDate.getMonth(),
              1
            );
            break;
          case "last-3-months":
            startDate = new Date(
              currentDate.setMonth(currentDate.getMonth() - 3)
            );
            break;
          case "last-6-months":
            startDate = new Date(
              currentDate.setMonth(currentDate.getMonth() - 6)
            );
            break;
          case "this-year":
            startDate = new Date(currentDate.getFullYear(), 0, 1);
            break;
          case "last-year":
            startDate = new Date(currentDate.getFullYear() - 1, 0, 1);
            break;
          default:
            startDate = new Date(0);
        }

        if (new Date(item.timestamp) >= startDate) {
          return true;
        }
      }

      return false;
    });
  }

  return filteredData;
};

const getTotalCounts = (filteredData) => {
  let totalCounts = {
    NEW: 0,
    USED: 0,
    CPO: 0,
  };

  filteredData.forEach((item) => {
    if (item.condition === "new") {
      totalCounts.NEW++;
    } else if (item.condition === "used") {
      totalCounts.USED++;
    } else if (item.condition === "cpo") {
      totalCounts.CPO++;
    }
  });

  return totalCounts;
};

const calculateAverageMSRP = (filteredData) => {
  let averageMSRP = {
    NEW: 0,
    USED: 0,
    CPO: 0,
  };

  let totalMSRP = {
    NEW: 0,
    USED: 0,
    CPO: 0,
  };

  let count = {
    NEW: 0,
    USED: 0,
    CPO: 0,
  };

  filteredData.forEach((item) => {
    const price = parseFloat(item.price.replace(" USD", ""));

    if (item.condition === "new") {
      totalMSRP.NEW += price;
      count.NEW++;
    } else if (item.condition === "used") {
      totalMSRP.USED += price;
      count.USED++;
    } else if (item.condition === "cpo") {
      totalMSRP.CPO += price;
      count.CPO++;
    }
  });

  if (count.NEW > 0) {
    averageMSRP.NEW = totalMSRP.NEW / count.NEW;
  }

  if (count.USED > 0) {
    averageMSRP.USED = totalMSRP.USED / count.USED;
  }

  if (count.CPO > 0) {
    averageMSRP.CPO = totalMSRP.CPO / count.CPO;
  }

  return {
    totalMSRP,
    averageMSRP,
  };
};

const aggregateDataByDate = (data) => {
  const aggregation = {};

  data.forEach((item) => {
    const date = new Date(item.timestamp).toISOString().split("T")[0];
    const price = parseFloat(item.price.replace(" USD", ""));

    if (!aggregation[date]) {
      aggregation[date] = {
        new: { count: 0, totalMsrp: 0, avgMsrp: 0 },
        used: { count: 0, totalMsrp: 0, avgMsrp: 0 },
        cpo: { count: 0, totalMsrp: 0, avgMsrp: 0 },
      };
    }

    if (item.condition === "new") {
      aggregation[date].new.count += 1;
      aggregation[date].new.totalMsrp += price;
    } else if (item.condition === "used") {
      aggregation[date].used.count += 1;
      aggregation[date].used.totalMsrp += price;
    } else if (item.condition === "cpo") {
      aggregation[date].cpo.count += 1;
      aggregation[date].cpo.totalMsrp += price;
    }
  });

  Object.keys(aggregation).forEach((date) => {
    const newCount = aggregation[date].new.count;
    const usedCount = aggregation[date].used.count;
    const cpoCount = aggregation[date].cpo.count;

    if (newCount > 0) {
      aggregation[date].new.avgMsrp =
        aggregation[date].new.totalMsrp / newCount;
    }

    if (usedCount > 0) {
      aggregation[date].used.avgMsrp =
        aggregation[date].used.totalMsrp / usedCount;
    }

    if (cpoCount > 0) {
      aggregation[date].cpo.avgMsrp =
        aggregation[date].cpo.totalMsrp / cpoCount;
    }
  });

  return aggregation;
};

const getRecentData = (filteredData) => {
  const sortedData = [...filteredData].sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  );

  return sortedData.length > 0 ? sortedData[0] : null;
};

export {
  filterData,
  aggregateDataByDate,
  getTotalCounts,
  calculateAverageMSRP,
  getRecentData,
};
