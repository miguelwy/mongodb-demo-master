// Prep the demo before a meeting:  npm run vector:setup
import { closeClient } from '../../lib/db.js';
import * as svc from './service.js';

const commands = {
  async seed() {
    console.log(await svc.seed());
  },
  async setup() {
    console.log('seed:', await svc.seed());
    console.log('autoEmbed index:', await svc.createIndex('auto'));
    console.log('text index:', await svc.createIndex('text'));
    console.log('\nIndexes build in the background. Check with: npm run vector:status');
  },
  async status() {
    const s = await svc.status();
    if (!s.configured) return console.log('MONGODB_URI not configured (.env).');
    console.log(`${s.host}  MongoDB ${s.version}  ${s.db}.${s.collection}: ${s.count} docs`);
    for (const i of s.indexes) console.log(`  - ${i.name.padEnd(24)} ${i.type.padEnd(13)} ${i.status.padEnd(10)} queryable=${i.queryable}`);
    if (!s.indexes.length) console.log('  (no search indexes)');
  },
  async teardown() {
    console.log(await svc.teardown());
  },
};

const name = process.argv[2];
if (!commands[name]) {
  console.log(`usage: node demos/vector-search/cli.js <${Object.keys(commands).join('|')}>`);
  process.exit(1);
}
try {
  await commands[name]();
} catch (err) {
  console.error('Error:', err.message);
  process.exitCode = 1;
} finally {
  await closeClient();
}
