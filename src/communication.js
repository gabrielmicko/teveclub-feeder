import request from 'request';
import fs from 'fs';
import nConf from 'nconf';
import jsdom from 'jsdom';
import RequestBuilder from './request';

nConf.argv().env().file({
    file: 'config.json'
});

if (nConf.get('debug')) {
    //request.debug = true;
}

class Communication {

    constructor() {
        this.drink = 0;
        this.food = 0;
        this.jar = request.jar();
    }

    setCamel(Camel) {
        this.camel = Camel;
    }

    auth() {
        let options = {
            ... {
                'url': 'http://teveclub.hu/index.pet',
                'jar': this.jar,
                'form': RequestBuilder.buildAuthData(this.camel),
            },
            ...RequestBuilder.getBaseRequest()
        };

        return new Promise(function(resolve, reject) {
            request.post(options, (err, httpResponse, body) => {
                if (err) reject('Auth() request error.');

                if (nConf.get('debug')) {
                    fs.writeFileSync('../debug/auth.html', body);
                }

                if (httpResponse.statusCode == 200 && httpResponse.request.uri.pathname == '/myteve.pet') {
                    let document = jsdom.jsdom(body);
                    let foodSelector = document.querySelector('select[name="kaja"]');
                    let drinkSelector = document.querySelector('select[name="pia"]');

                    this.food = (foodSelector !== null) ? foodSelector.children.length : 0;
                    this.drink = (drinkSelector !== null) ? drinkSelector.children.length : 0;

                    if (nConf.get('debug')) {
                        console.log('Successfully logged in with the camel: ' + this.camel.username);
                    }
                    resolve();
                } else {
                    if (nConf.get('debug')) {
                        console.log('Failed to log in with the camel: ' + this.camel.username)
                    }
                    reject();
                }
            });
        }.bind(this));
    }

    feed() {
        return new Promise(function(resolve, reject) {
            if (this.drink > 0 || this.food > 0) {
                let options = {
                    ... {
                        'url': 'http://teveclub.hu/myteve.pet',
                        'jar': this.jar,
                        'form': RequestBuilder.buildFeedData(this.drink, this.food)
                    },
                    ...RequestBuilder.getBaseRequest()
                };

                request(options, (err, httpResponse, body) => {
                    if (err) reject('Feed() request error.');

                    if (nConf.get('debug')) {
                        fs.writeFileSync('../debug/food.html', body);
                        console.log('The camel got ' + this.drink + ' amount of drink & ' + this.food + ' amount of food.');
                    }
                    resolve();
                });
            } else {
                if (nConf.get('debug')) {
                    console.log('The camel does not need any food or drink.');
                }
                resolve();
            }
        }.bind(this));
    }

    teach() {
        return new Promise((resolve, reject) => {
            let options = {
                ... {
                    'url': 'http://teveclub.hu/tanit.pet',
                    'jar': this.jar,
                    'form': RequestBuilder.buildTeachData()
                },
                ...RequestBuilder.getBaseRequest()
            };

            request(options, function(err, httpResponse, body) {
                if (err) reject('Teach() request error.');

                if (nConf.get('debug')) {
                    fs.writeFileSync('../debug/teach.html', body);
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

            }.bind(this));
        });
    }

    pickSubject(subject) {
        return new Promise(function(resolve, reject) {
            let options = {
                ... {
                    'url': 'http://teveclub.hu/tanit.pet',
                    'jar': this.jar,
                    'form': RequestBuilder.buildPickSubjectData(subject)
                },
                ...RequestBuilder.getBaseRequest()
            };

            request(options, (err, httpResponse, body) => {
                if (err) reject('pickSubject() request error.');

                if (nConf.get('debug')) {
                    fs.writeFileSync('../debug/subject.html', body);
                    console.log('New subject (' + subject + ') has been picked to learn.');
                }
                resolve();
            });
        }.bind(this));
    }

    lotto() {
        return new Promise(function(resolve, reject) {
            let number = Math.floor(Math.random() * (this.camel.max - this.camel.min) + this.camel.min);

            let options = {
                ... {
                    'url': 'http://teveclub.hu/egyszam.pet',
                    'jar': this.jar,
                    'form': RequestBuilder.buildLottoData(number)
                },
                ...RequestBuilder.getBaseRequest()
            };

            request(options, (err, httpResponse, body) => {
                if (err) reject('lotto() request error.');

                if (nConf.get('debug')) {
                    fs.writeFileSync('../debug/lotto.html', body);
                    console.log('Random number generated (' + number + ') for the lotto.');
                }
                resolve();
            });

        }.bind(this));
    }
}

export default Communication;
