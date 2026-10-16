/*
PURPOSE: Handles errors in a structured format.

- Stores HTTP status code, error message, and other error details.
- Can be used to throw errors from controllers and middleware.
- Helps maintain consistent error handling across the backend.
*/


class ApiError extends Error {
    constructor(
        statusCode,
        message= "Something went wrong",
        errors = [],
        stack = ""
    ){
        super(message)
        this.statusCode = statusCode
        this.data = null
        this.message = message
        this.success = false;
        this.errors = errors

        if (stack) {
            this.stack = stack
        } else{
            Error.captureStackTrace(this, this.constructor)
        }

    }
}

export {ApiError}