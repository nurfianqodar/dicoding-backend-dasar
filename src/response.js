class ResponseSuccess {
  constructor({ statusCode, message = undefined, data = undefined }) {
    this.statusCode = statusCode;
    this.status = "success";
    this.message = message;
    this.data = data;
  }

  getResponse() {
    return this.message
      ? {
          status: this.status,
          message: this.message,
          data: this.data,
        }
      : {
          status: this.status,
          data: this.data,
        };
  }
}

class ResponseError extends Error {
  constructor({ statusCode = 400, message }) {
    super(message);
    this.message = message;
    this.statusCode = statusCode;
  }

  getResponse() {
    return {
      status: "fail",
      message: this.message,
    };
  }
}

module.exports = { ResponseSuccess, ResponseError };
