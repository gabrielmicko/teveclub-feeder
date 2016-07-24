import nConf from 'nconf';
import httpPost from 'http-post';
import Camel from './lib/camel';
import Communication from './lib/communication';

nConf.argv().env().file({ file: 'config.json' });

const camels = nConf.get('camels').slice(0);

function feedCamel() {
    if(camels.length > 0) {
        let camel = camels.pop();

        let camelInstance = new Camel(camel);
        let communication = new Communication();
        var feedPromise = new Promise(function(resolve, reject) {
          communication.setCamel(camelInstance);
          communication.auth()
          .then(() => { return communication.feed() })
          .then(() => { return communication.teach() })
          .then(() => { return communication.lotto() })
          .then(resolve)
          .catch(reject);
        });

        feedPromise.then(feedCamel, (error = 'Unknown error.') => {console.log(error)});
    }
    else {
        process.exit();
    }
}

feedCamel();
