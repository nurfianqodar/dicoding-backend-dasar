const server = require("./src/server");

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

server();
