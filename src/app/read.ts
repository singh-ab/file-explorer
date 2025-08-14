import * as fs from "fs";

const data = fs.readFileSync("example.txt", { encoding: "utf8" });
console.log(data);

fs.readFile("example.txt", "utf8", (err, data) => {
  if (err) throw err;
  console.log(data);
});
