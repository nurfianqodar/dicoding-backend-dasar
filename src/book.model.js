const { nanoid } = require("nanoid");

class Book {
  constructor({
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  }) {
    this.id = nanoid();
    this.name = name;
    this.year = year;
    this.author = author;
    this.summary = summary;
    this.publisher = publisher;
    this.pageCount = pageCount;
    this.readPage = readPage;
    this.finished = this.pageCount === this.readPage;
    this.reading = reading;
    this.insertedAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  update({
    name = this.name,
    year = this.year,
    author = this.author,
    summary = this.summary,
    publisher = this.publisher,
    pageCount = this.pageCount,
    readPage = this.readPage,
    reading = this.reading,
  }) {
    this.updatedAt = new Date().toISOString();
    this.name = name;
    this.year = year;
    this.author = author;
    this.summary = summary;
    this.publisher = publisher;
    this.pageCount = pageCount;
    this.readPage = readPage;
    this.finished = this.pageCount === this.readPage;
    this.reading = reading;

    return this;
  }
}

module.exports = Book;
