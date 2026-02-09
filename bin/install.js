#!/usr/bin/env node

import { parseArgs } from 'node:util';
import { execSync } from 'node:child_process';
import path from 'node:path';
import readline from 'node:readline';
import os from 'node:os';
import fs from 'node:fs';

const REPO = 'jwnichols3/bmad-kiro-agents';

function getGitHubToken() {
  try {
    return execSync('gh auth token', { encoding: 'utf8' }).trim();
  } catch {
    return null;
  }
}

function authHeaders(token) {
  return token ? { Authorization: `token ${token}`, Accept: 'application/vnd.github.v3+json' } : {};
}

async function fetchManifest(branch, token) {
  const url = `https://api.github.com/repos/${REPO}/contents/bmad-manifest.json?ref=${branch}`;
  const res = await fetch(url, { headers: { ...authHeaders(token), Accept: 'application/vnd.github.v3.raw' } });
  if (!res.ok) {
    if (res.status === 404) throw new Error(`Branch '${branch}' not found. Check the branch name and try again.`);
    throw new Error('Unable to reach GitHub. Check your connection and try again.');
  }
  try {
    return await res.json();
  } catch {
    throw new Error('Invalid manifest file. The repository may be corrupted.');
  }
}

async function downloadAndExtract(branch, tmpDir, token) {
  const url = `https://api.github.com/repos/${REPO}/tarball/${branch}`;
  const res = await fetch(url, { headers: authHeaders(token) });
  if (!res.ok) throw new Error('Failed to download archive. Check your connection and try again.');
  const buf = Buffer.from(await res.arrayBuffer());
  const tarball = path.join(tmpDir, 'repo.tar.gz');
  fs.writeFileSync(tarball, buf);
  try {
    execSync(`tar xzf ${tarball} -C ${tmpDir}`, { stdio: 'ignore' });
  } catch {
    throw new Error("Failed to extract archive. Ensure 'tar' is installed and try again.");
  }
}

function findExtractedDir(tmpDir) {
  const entries = fs.readdirSync(tmpDir).filter(e => fs.statSync(path.join(tmpDir, e)).isDirectory());
  return entries[0] ? path.join(tmpDir, entries[0]) : null;
}

function checkExisting(dirs, target) {
  return dirs.map(name => ({ name, exists: fs.existsSync(path.join(target, name)) }));
}

function displaySummary(entries) {
  const maxLen = Math.max(...entries.map(e => e.name.length));
  console.log('');
  for (const { name, exists } of entries) {
    const padded = (name + '/').padEnd(maxLen + 2);
    const status = exists ? 'exists (will overwrite)' : 'new';
    console.log(`  ${padded} → ${status}`);
  }
  console.log('');
}

function copyDirectories(dirs, srcRoot, target) {
  for (const dir of dirs) {
    const src = path.join(srcRoot, dir);
    const dest = path.join(target, dir);
    if (!fs.existsSync(src)) continue;
    fs.cpSync(src, dest, { recursive: true });
  }
}

function promptUser(target) {
  return new Promise(resolve => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    const ask = () => {
      rl.question(`Install to ${target}? (y/N) `, answer => {
        const a = answer.trim().toLowerCase();
        if (a === 'y') { rl.close(); resolve(true); }
        else if (a === 'n' || a === '') { rl.close(); resolve(false); }
        else ask();
      });
    };
    ask();
  });
}

function cleanup(tmpDir) {
  if (tmpDir && fs.existsSync(tmpDir)) {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
}

async function main() {
  let tmpDir;
  try {
    const { values, positionals } = parseArgs({
      options: {
        force: { type: 'boolean' },
        branch: { type: 'string', default: 'main' }
      },
      allowPositionals: true
    });

    const branch = values.branch;
    const target = positionals[0] ? path.resolve(positionals[0]) : process.cwd();
    const token = getGitHubToken();

    const dirs = await fetchManifest(branch, token);
    const entries = checkExisting(dirs, target);

    if (!values.force) {
      displaySummary(entries);
      const confirmed = await promptUser(target);
      if (!confirmed) process.exit(0);
    }

    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'bmad-'));
    await downloadAndExtract(branch, tmpDir, token);

    const srcRoot = findExtractedDir(tmpDir);
    if (!srcRoot) throw new Error('Failed to extract archive. Try again.');

    copyDirectories(dirs, srcRoot, target);
    cleanup(tmpDir);

    console.log('Installing... done');

    // TODO: success handoff — Epic 4

  } catch (err) {
    cleanup(tmpDir);
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
}

main();
