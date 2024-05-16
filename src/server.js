const Hapi = require("@hapi/hapi");
const database = require("./database");
const { ResponseSuccess, ResponseError } = require("./response");
const init = async () => {
  const server = Hapi.server({
    port: 9000,
    host: "localhost",
  });

  // CREATE BOOK
  server.route({
    method: "POST",
    path: "/books",
    handler: (requset, h) => {
      try {
        const book = database.createData(requset.payload);
        const res = new ResponseSuccess({
          statusCode: 201,
          message: "Buku berhasil ditambahkan",
          data: {
            bookId: book.id,
          },
        });
        return h.response(res.getResponse()).code(res.statusCode);
      } catch (e) {
        return h.response(e.getResponse()).code(e.statusCode);
      }
    },
  });

  server.route({
    method: "GET",
    path: "/books",
    handler: (request, h) => {
      let data = [];
      const nameQ = request.query.name;
      const finishedQ = request.query.finished;
      const readingQ = request.query.reading;
      if (nameQ || readingQ || finishedQ) {
        database.updateFilters();
        if (nameQ !== undefined) {
          console.log("Name: ", nameQ);
          data = database
            .searchByNameContainsWith(nameQ)
            .map(({ id, name, publisher }) => {
              return { id, name, publisher };
            });
        } else if (readingQ !== undefined) {
          const reading = Boolean(Number(readingQ));
          console.log("Reading: ", reading);

          data = reading ? database.isReading : database.isNotReading;
        } else if (finishedQ !== undefined) {
          const finished = Boolean(Number(finishedQ));
          console.log("Finished: ", finished);
          data = finished ? database.isFinished : database.isNotFinished;
        }
      } else {
        data = database.getAllData();
      }

      data = data.map(({ id, name, publisher }) => {
        return {
          id,
          name,
          publisher,
        };
      });

      const res = new ResponseSuccess({
        statusCode: 200,
        data: {
          books: data,
        },
      });

      return h.response(res.getResponse()).code(res.statusCode);
    },
  });

  server.route({
    method: "PUT",
    path: "/books/{bookId}",
    handler: (request, h) => {
      try {
        const updated = database.updateData(
          request.params.bookId,
          request.payload
        );

        const res = new ResponseSuccess({
          statusCode: 200,
          message: "Buku berhasil diperbarui",
        });

        return h.response(res.getResponse()).code(res.statusCode);
      } catch (e) {
        if (e instanceof ResponseError) {
          return h.response(e.getResponse()).code(e.statusCode);
        } else {
          console.log(e);
        }
      }
    },
  });

  server.route({
    method: "GET",
    path: "/books/{bookId}",
    handler: (request, h) => {
      try {
        const data = database.getById(request.params.bookId);
        const res = new ResponseSuccess({
          statusCode: 200,
          data: {
            book: data,
          },
        });
        return h.response(res.getResponse()).code(res.statusCode);
      } catch (e) {
        return h.response(e.getResponse()).code(e.statusCode);
      }
    },
  });

  server.route({
    method: "DELETE",
    path: "/books/{bookId}",
    handler: (request, h) => {
      try {
        database.deleteData(request.params.bookId);
        const res = new ResponseSuccess({
          statusCode: 200,
          message: "Buku berhasil dihapus",
        });
        return h.response(res.getResponse()).code(res.statusCode);
      } catch (e) {
        return h.response(e.getResponse()).code(e.statusCode);
      }
    },
  });

  await server.start();
  console.log("Server running on %s", server.info.uri);
};

module.exports = init;
