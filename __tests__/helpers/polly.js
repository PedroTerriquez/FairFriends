// VCR-style record/replay for HTTP calls made via axios in jest.
// Uses Polly.js + node-http adapter (works because axios in jest runs on Node's http module).
//
// Modes:
//   - default: replay from __recordings__/. Records on first run if missing.
//   - POLLY_MODE=record: always re-record (overwrite existing fixtures).

const path = require('path');
const { Polly } = require('@pollyjs/core');
const NodeHttpAdapter = require('@pollyjs/adapter-node-http');
const FSPersister = require('@pollyjs/persister-fs');

Polly.register(NodeHttpAdapter);
Polly.register(FSPersister);

function setupPolly(recordingName) {
  const mode = process.env.POLLY_MODE === 'record' ? 'record' : 'replay';
  return new Polly(recordingName, {
    adapters: ['node-http'],
    persister: 'fs',
    persisterOptions: {
      fs: {
        recordingsDir: path.resolve(__dirname, '..', '..', '__recordings__'),
      },
    },
    mode,
    recordIfMissing: true,
    recordFailedRequests: true,
    flushRequestsOnStop: true,
    // Match requests by method + URL + order only. We deliberately ignore
    // headers (auth tokens rotate) and body (emails use Date.now() in record
    // mode so bodies never match between runs). Order-based matching lets
    // replay return the Nth recorded response for the Nth matching request.
    matchRequestsBy: {
      headers: false,
      body: false,
      order: true,
    },
  });
}

module.exports = { setupPolly };
