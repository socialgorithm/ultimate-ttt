#!/usr/bin/env node

const server = require('../dist/index')["default"];

// Parse cli input
const options = require('../dist/lib/input')["default"]();

server(options);