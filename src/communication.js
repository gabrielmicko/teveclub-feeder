import fs from 'fs';
import nConf from 'nconf';
import jsdom from 'jsdom';
import RequestBuilder from './request.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

nConf.argv().env().file({
  file: 'config.json',
});

if (nConf.get('debug')) {
  //request.debug = true;
  let debugPath = path.join(__dirname, '../debug');
  if (fs.existsSync(debugPath) === false) {
    fs.mkdirSync(debugPath);
  }
}

class Communication {
  constructor() {
    this.drink = 0;
    this.food = 0;
    this.cookie = null;
  }

  setCamel(Camel) {
    this.camel = Camel;
  }

  getSession() {
    return new Promise((resolve, reject) => {
      const url = 'https://teveclub.hu/index.pet';
      fetch(url, {
        method: 'GET',
        headers: RequestBuilder.getHeaders(),
        redirect: 'follow',
      })
        .then((response) => {
          this.cookie = response.headers.get('set-cookie');
          if (!response.ok) {
            throw new Error(`HTTP ${response.status} ${response.statusText}`);
          }
          console.log('Successfully obtained a session id.');
          resolve();
          return;
        })
        .catch((error) => {
          console.log('Error in getSession()', error);
          reject();
          return;
        });
    });
  }

  auth() {
    return new Promise((resolve, reject) => {
      fetch('https://teveclub.hu/index.pet', {
        method: 'POST',
        body: RequestBuilder.buildAuthData(this.camel),
        headers: { ...RequestBuilder.getHeaders(), Cookie: this.cookie },
        redirect: 'follow',
      })
        .then((response) => {
          //this.cookie = response.headers.get('set-cookie');
          if (!response.ok) {
            throw new Error(`HTTP ${response.status} ${response.statusText}`);
          }
          return response.text().then((body) => ({ response, body }));
        })
        .then(({ response, body }) => {
          const finalPath = new URL(response.url).pathname;

          if (nConf.get('debug')) {
            let filePath = path.join(__dirname, '../debug/auth.html');
            fs.writeFileSync(filePath, body);
          }

          if (finalPath !== '/myteve.pet') {
            if (nConf.get('debug')) {
              console.log(
                'Failed to log in with the camel: ' + this.camel.username
              );
            }
            throw new Error(`Unexpected redirect to ${finalPath}`);
          }

          let document = jsdom.jsdom(body);
          let foodSelector = document.querySelector('select[name="kaja"]');
          let drinkSelector = document.querySelector('select[name="pia"]');

          this.food = foodSelector !== null ? foodSelector.children.length : 0;
          this.drink =
            drinkSelector !== null ? drinkSelector.children.length : 0;

          if (nConf.get('debug')) {
            console.log(
              'Successfully logged in with the camel: ' + this.camel.username
            );
          }
          resolve();
        })
        .catch((error) => {
          console.log('Error in Auth()', error);
          reject();
          return;
        });
    });
  }

  feed() {
    return new Promise((resolve, reject) => {
      if (this.drink > 0 || this.food > 0) {
        fetch('https://teveclub.hu/myteve.pet', {
          method: 'POST',
          body: RequestBuilder.buildFeedData(this.drink, this.food),
          headers: { ...RequestBuilder.getHeaders(), Cookie: this.cookie },
          redirect: 'follow',
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP ${response.status} ${response.statusText}`);
            }
            return response.text().then((body) => ({ response, body }));
          })
          .then(({ response, body }) => {
            if (nConf.get('debug')) {
              let filePath = path.join(__dirname, '../debug/food.html');
              fs.writeFileSync(filePath, body);
              console.log(
                'The camel got ' +
                  this.drink +
                  ' amount of drink & ' +
                  this.food +
                  ' amount of food.'
              );
            }
            resolve();
          })
          .catch((error) => {
            console.log('Error in feed()', error);
            reject();
            return;
          });
      } else {
        if (nConf.get('debug')) {
          console.log('The camel does not need any food or drink.');
        }
        resolve();
      }
    });
  }

  teach() {
    return new Promise((resolve, reject) => {
      fetch('https://teveclub.hu/tanit.pet', {
        method: 'POST',
        body: RequestBuilder.buildTeachData(),
        headers: { ...RequestBuilder.getHeaders(), Cookie: this.cookie },
        redirect: 'follow',
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP ${response.status} ${response.statusText}`);
          }
          return response.text().then((body) => ({ response, body }));
        })
        .then(({ response, body }) => {
          if (nConf.get('debug')) {
            let filePath = path.join(__dirname, '../debug/teach.html');
            fs.writeFileSync(filePath, body);
          }

          let document = jsdom.jsdom(body);
          let teachSelector = document.querySelector('select[name="tudomany"]');

          if (teachSelector !== null) {
            let firstOption = teachSelector.children[0].value;
            this.pickSubject(firstOption).then(resolve, reject);
          } else {
            if (nConf.get('debug')) {
              console.log('Teaching the camel has been done.');
            }
            resolve();
          }
        })
        .catch((error) => {
          console.log('Error in Teach()', error);
          reject();
          return;
        });
    });
  }

  pickSubject(subject) {
    return new Promise((resolve, reject) => {
      fetch('https://teveclub.hu/tanit.pet', {
        method: 'POST',
        body: RequestBuilder.buildPickSubjectData(subject),
        headers: { ...RequestBuilder.getHeaders(), Cookie: this.cookie },
        redirect: 'follow',
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP ${response.status} ${response.statusText}`);
          }
          return response.text().then((body) => ({ response, body }));
        })
        .then(({ response, body }) => {
          if (nConf.get('debug')) {
            let filePath = path.join(__dirname, '../debug/subject.html');
            fs.writeFileSync(filePath, body);
            console.log(
              'New subject (' + subject + ') has been picked to learn.'
            );
          }
          resolve();
        })
        .catch((error) => {
          console.log('Error in pickSubject()', error);
          reject();
          return;
        });
    });
  }

  lotto() {
    return new Promise((resolve, reject) => {
      let number = Math.floor(
        Math.random() * (this.camel.max - this.camel.min) + this.camel.min
      );

      fetch('https://teveclub.hu/egyszam.pet', {
        method: 'POST',
        body: RequestBuilder.buildLottoData(number),
        headers: { ...RequestBuilder.getHeaders(), Cookie: this.cookie },
        redirect: 'follow',
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP ${response.status} ${response.statusText}`);
          }
          return response.text().then((body) => ({ response, body }));
        })
        .then(({ response, body }) => {
          if (nConf.get('debug')) {
            let filePath = path.join(__dirname, '../debug/lotto.html');
            fs.writeFileSync(filePath, body);
            console.log(
              'Random number generated (' + number + ') for the lotto.'
            );
          }
          resolve();
        })
        .catch((error) => {
          console.log('Error in pickSubject()', error);
          reject();
          return;
        });
    });
  }
}

export default Communication;
