import encoder from './encoder.js';

export default {
  getBaseRequest() {
    return {
      encoding: null,
      followAllRedirects: true,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.10; rv:47.0) Gecko/20100101 Firefox/47.0',
        Referer: 'https://teveclub.hu/',
      },
    };
  },

  getHeaders() {
    return {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.10; rv:47.0) Gecko/20100101 Firefox/47.0',
      Referer: 'https://teveclub.hu/',
    };
  },

  buildAuthData(Camel) {
    return encoder({
      tevenev: Camel.username,
      pass: Camel.password,
      login: 'Gyere!',
      x: Math.floor(Math.random() * (50 - 1) + 1),
      y: Math.floor(Math.random() * (50 - 1) + 1),
    });
  },

  buildFeedData(food, drink) {
    return encoder({
      kaja: food,
      pia: drink,
      etet: 'Mehet!',
    });
  },

  buildTeachData() {
    return encoder({
      learn: 'Tanulj teve!',
    });
  },

  buildPickSubjectData(subject) {
    return encoder({
      tudomany: subject,
      learn: 'Tanulj teve!',
    });
  },

  buildLottoData(number) {
    return encoder({
      honnan: number,
      tipp: 'Ez a tippem!',
    });
  },
};
