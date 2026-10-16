import fs from "node:fs/promises";

// Keep API errors readable by the frontend, including MongoDB duplicate keys.
export const errorHandler = async (error, req, res, next) => {
    if (res.headersSent) return next(error);

    const files = [req.file, ...Object.values(req.files || {}).flat()].filter(Boolean);
    await Promise.all(files.map((file) => fs.unlink(file.path).catch(() => {})));

    let statusCode = error.statusCode || error.status || 500;
    let message = error.message;
    if (error.code === 11000) {
        statusCode = 409;
        message = "That email or username is already in use";
    } else if (error.name === "ValidationError" || error.name === "CastError") {
        statusCode = 400;
        message = "Please check the account details you entered";
    } else if (error.name === "MulterError") {
        statusCode = 400;
        message = error.code === "LIMIT_FILE_SIZE" ? "Images must be smaller than 5 MB" : "Please check the uploaded image fields";
    }

    if (statusCode >= 500) {
        console.error("Request failed:", error.message);
        message = "The server could not complete this request";
    }
    return res.status(statusCode).json({ statusCode, data: null, message, success: false });
};
