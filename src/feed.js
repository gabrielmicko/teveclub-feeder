import nConf from 'nconf';
import Camel from './camel';
import Communication from './communication';
import path from 'path';

let configPath = path.join(__dirname, '../config.json');
nConf.argv().env().file({ file: configPath });

const camels = nConf.get('camels').slice(0);

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function feedCamel() {
  if (camels.length === 0) {
    process.exit();
  }

  const camel = camels.pop();
  const camelInstance = new Camel(camel);
  const communication = new Communication();

  try {
    communication.setCamel(camelInstance);
    await communication.auth();
    await sleep(5000);
    await communication.feed();
    await sleep(5000);
    await communication.teach();
    await sleep(5000);
    await communication.lotto();
    await sleep(5000);
  } catch (error) {
    console.error('Error while feeding camel:', error || 'Unknown error');
  }

  // Always call the next one regardless of success/failure
  feedCamel();
}

feedCamel();
