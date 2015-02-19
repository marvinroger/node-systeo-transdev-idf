function ServerError(message) {
    this.name = "ServerError";
    this.message = message || 'The server response was errored';
}
ServerError.prototype = Object.create(Error.prototype);
ServerError.prototype.constructor = ServerError;

module.exports = {
  ServerError: ServerError
};