#!/usr/bin/env node

const chalk = require('chalk');
const ora = require('ora');
const visit = require('./visit');
const commandLineArgs = require('command-line-args');

const spinner = ora('Fetching Links...').start();

const optionDefinitions = [
    { name: 'url', alias: 'u', type: String }
];
const options = commandLineArgs(optionDefinitions);

const doCheck = async ( url ) => {
    try {
        const links = await visit(url);
        spinner.stop();
        links.forEach((ele) => {
            console.log(chalk.green(ele.url, ele.lastmod));
        });
    } catch( e ) {
        spinner.stop();
        console.log(chalk.red("Error: ", e));
    }
 }

doCheck(options.url);