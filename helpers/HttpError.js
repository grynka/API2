const HttpError = (status, messeage) => {
    const error = new Error(messeage);
    error.status = status;
    return error;
}

module.exports = HttpError