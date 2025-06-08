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

function sleep() {
  return new Promise((resolve) => setTimeout(resolve, 5000));
}

async function feedAllCamels() {
  while (camels.length > 0) {
    const camel = camels.pop();
    const camelInstance = new Camel(camel);
    const communication = new Communication();

    try {
      communication.setCamel(camelInstance);
      console.log('Before getSession');
      await communication.getSession();
      await sleep();
      console.log('Before auth');
      await communication.auth();
      await sleep();
      console.log('Before feed');
      await communication.feed();
      await sleep();
      console.log('Before teach');
      await communication.teach();
      await sleep();
      console.log('Before lotto');
      await communication.lotto();
      await sleep();
    } catch (error) {
      console.error('Error while feeding camel:', error || 'Unknown error');
    }
  }

  process.exit();
}

feedAllCamels();
