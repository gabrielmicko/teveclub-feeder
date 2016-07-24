import nConf from 'nconf';
import httpPost from 'http-post';
import Camel from './lib/camel';
import Communication from './lib/communication';

nConf.argv().env().file({ file: 'config.json' });

let camels = nConf.get('camels').slice(0);

function feedCamel() {
  let camel = camels.pop();

  let camelInstance = new Camel(camel);
  let communication = new Communication();
  var feedPromise = new Promise(function(resolve, reject) {
    communication.setCamel(camelInstance);
    communication.auth()
    .then(() => { communication.feed() }, reject)
    .then(() => { communication.teach() }, reject)
    .then(() => { communication.lotto() }, reject)
    .then(resolve, reject);
  });

  feedPromise.then(feedCamel, (error) => {console.log(error)});
}

feedCamel();

setTimeout(function() {

},555000);
