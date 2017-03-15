#!/usr/bin/env node

const server = require('../src/index');

// Parse cli input
const options = require('../src/lib/input')();

server(options);