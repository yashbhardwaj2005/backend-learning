/*
PURPOSE: Creates a consistent structure for successful API responses.

- Stores the HTTP status code.
- Stores the response data.
- Stores a success message.
- Helps return responses in a standard format from controllers.
*/


class ApiResponse {
    constructor(statusCode, data, message = "Success"){
        this.statusCode = statusCode
        this.data = data
        this.message = message
        this.success = statusCode < 400
    }
}

export { ApiResponse }