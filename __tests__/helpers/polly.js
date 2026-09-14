// VCR-style record/replay for HTTP calls made via axios in jest.
// Uses Polly.js + node-http adapter (works because axios in jest runs on Node's http module).
//
// Modes:
//   - default: replay from __recordings__/. A request with no fixture fails
//     loudly instead of silently hitting the network, so a desynced test shows
//     up as "recording not found" rather than a confusing waitFor timeout.
//   - POLLY_MODE=record: (re-)record against the live backend.

const path = require('path');
const { Polly } = require('@pollyjs/core');
const NodeHttpAdapter = require('@pollyjs/adapter-node-http');
const FSPersister = require('@pollyjs/persister-fs');

Polly.register(NodeHttpAdapter);
Polly.register(FSPersister);

function setupPolly(recordingName) {
  const mode = process.env.POLLY_MODE === 'record' ? 'record' : 'replay';
  const polly = new Polly(recordingName, {
    adapters: ['node-http'],
    persister: 'fs',
    persisterOptions: {
      fs: {
        recordingsDir: path.resolve(__dirname, '..', '..', '__recordings__'),
      },
    },
    mode,
    recordIfMissing: mode === 'record',
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

  // POLLY_DEBUG=1 prints every request and where its response came from.
  // Invaluable when the happy path desyncs from the recorded fixtures.
  if (process.env.POLLY_DEBUG) {
    polly.server.any().on('response', (req, res) => {
      console.log(
        `[polly] ${req.method} ${req.url} -> ${res.statusCode} (${req.action || 'replay'})`
      );
    });
  }

  return polly;
}

module.exports = { setupPolly };
