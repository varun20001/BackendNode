import fs from "fs";
import csv from "csv-parser";

let inventoryData = [];

const loadData = () => {
  return new Promise((resolve, reject) => {
    fs.createReadStream("./public/sample-data-v2.csv")
      .pipe(csv())
      .on("data", (row) => {
        row.timestamp = new Date(row.timestamp);
        inventoryData.push(row);
      })
      .on("end", () => {
        console.log("CSV file successfully processed");
        resolve();
      })
      .on("error", (error) => {
        console.error("Error reading CSV file:", error);
        reject(error);
      });
  });
};

const dataLoader = async (req, res, next) => {
  if (inventoryData.length === 0) {
    await loadData();
  }
  req.inventoryData = inventoryData;
  next();
};

export default dataLoader;
