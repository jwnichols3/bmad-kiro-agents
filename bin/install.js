#!/usr/bin/env node

import { parseArgs } from 'node:util';
import path from 'node:path';
import readline from 'node:readline';
import os from 'node:os';
import fs from 'node:fs';

async function main() {
  try {
    const { values, positionals } = parseArgs({
      options: {
        force: { type: 'boolean' },
        branch: { type: 'string', default: 'main' }
      },
      allowPositionals: true
    });

    const target = positionals[0] ? path.resolve(positionals[0]) : process.cwd();

    // TODO: fetchManifest()
    // TODO: checkExisting()
    // TODO: promptUser()
    // TODO: downloadAndExtract()
    // TODO: copyDirectories()
    // TODO: cleanup()
    // TODO: success message

  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
}

main();