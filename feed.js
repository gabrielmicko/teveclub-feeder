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
          .then(() => { return communication.feed() }, reject)
          .then(() => { return communication.teach() }, reject)
          .then(() => { return communication.lotto() }, reject)
          .then(resolve, reject);
        });

        feedPromise.then(feedCamel, (error) => {console.log(error)});
    }
    else {
        process.exit();
    }
}

feedCamel();
