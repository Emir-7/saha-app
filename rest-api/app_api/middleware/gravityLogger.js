const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, '..', '..', 'gravity.log');

// Helper to write to file asynchronously
const writeToLogFile = (logLine) => {
    fs.appendFile(logFilePath, logLine + '\n', (err) => {
        if (err) console.error('⚠️ [Gravity Logger] Log dosyasına yazma hatası:', err.message);
    });
};

const gravityLogger = {
    info: (message, meta = {}) => {
        const timestamp = new Date().toISOString();
        const logLine = `[${timestamp}] [INFO] [Gravity Agent] ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}`;
        console.log(`🚀 ${logLine}`);
        writeToLogFile(logLine);
    },
    error: (message, meta = {}) => {
        const timestamp = new Date().toISOString();
        const logLine = `[${timestamp}] [ERROR] [Gravity Agent] ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}`;
        console.error(`⚠️ ${logLine}`);
        writeToLogFile(logLine);
    }
};

// Observability Middleware to log requests
const observabilityMiddleware = (req, res, next) => {
    const start = process.hrtime();
    
    // When the request finishes, log the details
    res.on('finish', () => {
        const diff = process.hrtime(start);
        const responseTimeMs = (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(2);
        
        const logData = {
            method: req.method,
            url: req.originalUrl,
            status: res.statusCode,
            responseTime: `${responseTimeMs}ms`,
            ip: req.ip
        };
        
        const timestamp = new Date().toISOString();
        const logLine = `[${timestamp}] [INFO] [Gravity Agent] Request: ${req.method} ${req.originalUrl} -> Status ${res.statusCode} in ${responseTimeMs}ms`;
        
        console.log(`📡 ${logLine}`);
        writeToLogFile(logLine);
    });
    
    next();
};

module.exports = {
    logger: gravityLogger,
    observabilityMiddleware
};
