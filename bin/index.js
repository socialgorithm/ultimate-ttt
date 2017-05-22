#!/usr/bin/env node

const server = require('../dist/index');

// Parse cli input
const options = require('../dist/lib/input')();

server(options);