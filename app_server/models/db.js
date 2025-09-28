// Globals
const mongoose = require('mongoose');
const readLine = require('readline');
const dbURI ='mongodb://localhost/Loc8r';
require('./locations');

/**
 * This function is a wrap for the mongoose disconnection logic, logging and the needed callback.
 * @param msg Provide valuable logging information in a string literal.
 * @param callback Provide a function or lambda function for shutdown procedures.
 */
function gracefulShutdown (msg, callback) {
    mongoose.connection.close(() => {
        console.log(`Mongoose disconnected through ${msg}`);
        callback();
    });
}

// Establish connection
mongoose.connect(dbURI, {});

// closure listeners and procedures
if (process.platform === 'win32') {
    const rl = readLine.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    
    rl.on('SIGINT', () => {
        process.emit('SIGINT');
    });
}

process.once('SIGUSR2', () => {
    gracefulShutdown('nodemon restart', () => {
        process.kill(process.pid, 'SIGUSR2');     
    });
});

process.on('SIGINT', () => {
    gracefulShutdown('app termination', () => {
        process.exit(0);
    });  
});

process.on('SIGTERM', () =>{
    gracefulShutdown('Heroku app shutdown', () => {
        process.exit(0);
    })
});

/* Logging events */

// Successful Connection
mongoose.connection.on('connected', () => {
    console.log(`Mongoose connected to ${dbURI}`);
});

// Error
mongoose.connection.on('error', err => {
    console.log('Mongoose connection error: ', err);
});

// Disconnected
mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected');
});