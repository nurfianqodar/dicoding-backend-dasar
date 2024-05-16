const { ResponseError } = require("./response");
const Book = require("./book.model");

class Database {
  constructor() {
    this.data = [];
  }
  updateFilters() {
    this.isReading = this.data.filter((item) => item.reading === true);
    this.isNotReading = this.data.filter((item) => item.reading === false);
    this.isFinished = this.data.filter((item) => item.finished === true);
    this.isNotFinished = this.data.filter((item) => item.finished === false);
  }

  createData(newData) {
    if (!newData.name) {
      throw new ResponseError({
        statusCode: 400,
        message: "Gagal menambahkan buku. Mohon isi nama buku",
      });
    }
    if (newData.readPage > newData.pageCount) {
      throw new ResponseError({
        statusCode: 400,
        message:
          "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
      });
    }

    const book = new Book({ ...newData });
    this.data.push(book);
    return book;
  }

  getAllData() {
    return this.data;
  }

  getById(reqId) {
    const result = this.data.find((item) => item.id === reqId);
    if (!result) {
      throw new ResponseError({
        statusCode: 404,
        message: "Buku tidak ditemukan",
      });
    }
    return result;
  }

  updateData(bookId, updatedData) {
    if (!updatedData.name) {
      throw new ResponseError({
        statusCode: 400,
        message: "Gagal memperbarui buku. Mohon isi nama buku",
      });
    }

    if (updatedData.readPage > updatedData.pageCount) {
      throw new ResponseError({
        statusCode: 400,
        message:
          "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
      });
    }

    const data = this.data.find((item) => item.id === bookId);

    if (!data) {
      throw new ResponseError({
        statusCode: 404,
        message: "Gagal memperbarui buku. Id tidak ditemukan",
      });
    }

    const index = this.data.findIndex((item) => item.id === bookId);
    if (index !== -1) {
      this.data[index] = this.data[index].update(updatedData);
    }
  }

  deleteData(id) {
    const data = this.data.find((item) => item.id === id);

    if (!data) {
      throw new ResponseError({
        statusCode: 404,
        message: "Buku gagal dihapus. Id tidak ditemukan",
      });
    }

    const newData = this.data.filter((item) => item.id !== id);
    this.data = newData;
  }

  searchByNameContainsWith(query) {
    const data = this.data.filter((item) =>
      item.name.toLowerCase().includes(query.toLowerCase())
    );

    console.log(data);
    return data;
  }

  searchByCondition(condition) {
    return this.data.filter((item) => item[condition.key] === condition.value);
  }
}

const database = new Database();

module.exports = database;
