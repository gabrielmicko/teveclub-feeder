import nConf from 'nconf';
import Camel from './camel.js';
import Communication from './communication.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let configPath = path.join(__dirname, '../config.json');
nConf.argv().env().file({ file: configPath });

const camels = nConf.get('camels').slice(0);
const sleep = (ms = 3000) => new Promise((res) => setTimeout(res, ms));

async function processCamel(camel) {
  const camelInstance = new Camel(camel);
  const communication = new Communication();

  try {
    communication.setCamel(camelInstance);
    console.log(`[${camel.username}] Before getSession`);
    await communication.getSession();
    console.log(`[${camel.username}] After getSession`);
    await sleep();
    console.log(`[${camel.username}] Before auth`);
    await communication.auth();
    console.log(`[${camel.username}] After auth`);
    await sleep();
    console.log(`[${camel.username}] Before feed`);
    await communication.feed();
    console.log(`[${camel.username}] After feed`);
    await sleep();
    console.log(`[${camel.username}] Before teach`);
    await communication.teach();
    console.log(`[${camel.username}] After teach`);
    await sleep();
    console.log(`[${camel.username}] Before lotto`);
    await communication.lotto();
    console.log(`[${camel.username}] After lotto`);

    await sleep();
  } catch (error) {
    console.error(
      `Error with camel ${camel.username}:`,
      error || 'Unknown error'
    );
  }
}

async function feedAllCamels() {
  for (const camel of camels) {
    await processCamel(camel);
    await new Promise((res) => setTimeout(res, 100)); // slight pause to yield CPU
  }

  process.exit();
}

feedAllCamels();
