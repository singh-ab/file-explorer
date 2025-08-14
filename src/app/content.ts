import * as fs from "fs";

fs.writeFileSync("example.txt", "Hello");
console.log("File written successfully.");

fs.writeFile("example.txt", "test", (err) => {
  if (err) throw err;
  console.log("File overwritten successfully.");
});
