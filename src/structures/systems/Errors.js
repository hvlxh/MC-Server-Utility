const chalk = require('chalk');

/**
 * 
 * @param {import('../lib/Client')} client 
 */
module.exports = (client) => {
    client.on('error', (error) => {
        console.error(
            chalk.red('--------------- Client Error ---------------'),
            error
        );
    });

    client.on('warn', (message) => {
        console.error(
            chalk.yellow('-------------- Client Warning ---------------'),
            message,
        );
    });

    process.on('unhandledRejection', (r, p) => {
        console.error(
            chalk.red('--------------- Unhandled Rejection ---------------'),
            `Reason: ${r}`,
            `Promise: ${p}`,
        );
    });

    process.on('uncaughtException', (e, o) => {
        console.error(
            chalk.red('--------------- Uncaught Expection ---------------'),
            `Error: ${e}`,
            `Origin: ${o}`,
        );
    });

    process.on('uncaughtExceptionMonitor', (e, o) => {
        console.error(
            chalk.red('--------------- Uncaught Expection ---------------'),
            `Error: ${e}`,
            `Origin: ${o}`,
        );
    });

    process.on('warning', (w) => {
        console.error(
            chalk.yellow('--------------- Node Warning ---------------'),
            w
        );
    });
};