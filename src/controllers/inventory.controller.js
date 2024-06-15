import {
  filterData,
  aggregateDataByDate,
  getTotalCounts,
  calculateAverageMSRP,
  getRecentData,
} from "../utils/inventory.utils.js";

export const getInventory = (req, res) => {
  const filteredData = filterData(req.query, req.inventoryData);
  const aggregatedData = aggregateDataByDate(filteredData);
  const totalCounts = getTotalCounts(filteredData);
  const { totalMSRP, averageMSRP } = calculateAverageMSRP(filteredData);
  const recentData = getRecentData(filteredData);

  const response = {
    filteredData,
    aggregatedData,
    totalCounts,
    totalMSRP,
    averageMSRP,
    recentData,
  };

  res.json(response);
};
