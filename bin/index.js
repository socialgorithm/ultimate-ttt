#!/usr/bin/env node

const server = require('../index');

// Parse cli input
const options = require('../lib/input')();

server(options);