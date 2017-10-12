export default function(params) {
  var encoded = '';

  var keys = Object.keys(params);
  keys.forEach((param, key) => {
    encoded += param + '=' + params[param];
    if (keys.length - 1 !== key) {
      encoded += '&';
    }
  });

  var asciiBase = [
    {
      char: 'Í',
      replace: '%CD'
    },
    {
      char: 'É',
      replace: '%C8'
    },
    {
      char: 'Á',
      replace: '%C1'
    },
    {
      char: 'Ü',
      replace: '%DC'
    },
    {
      char: 'Ü',
      replace: '%DC'
    },
    {
      char: 'Ó',
      replace: '%D3'
    },
    {
      char: 'Ö',
      replace: '%D6'
    },
    {
      char: 'Ú',
      replace: '%DA'
    },
    {
      char: 'Ü',
      replace: '%DC'
    },
    {
      char: 'ü',
      replace: '%FC'
    },
    {
      char: ' ',
      replace: '%20'
    },
    {
      char: 'ý',
      replace: '%FD'
    },
    {
      char: 'ø',
      replace: '%F8'
    },
    {
      char: 'õ',
      replace: '%F5'
    },
    {
      char: 'ó',
      replace: '%F3'
    },
    {
      char: 'í',
      replace: '%ED'
    },
    {
      char: 'ü',
      replace: '%FC'
    },
    {
      char: 'é',
      replace: '%E9'
    },
    {
      char: 'á',
      replace: '%E1'
    },
    {
      char: '!',
      replace: '%21'
    },
    {
      char: ':',
      replace: '%3A'
    },
    {
      char: '$',
      replace: '%24'
    },
    {
      char: '-',
      replace: '%2D'
    }
  ];

  var finalEncodedString = '';
  for (var i = 0, len = encoded.length; i < len; i++) {
    finalEncodedString += searchAndReplace(encoded[i]);
  }

  function searchAndReplace(char) {
    var replaceChar = char;
    try {
      asciiBase.forEach(logic => {
        if (logic.char == char) {
          throw logic.replace;
        }
      });
    } catch (e) {
      replaceChar = e;
    }
    return replaceChar;
  }
  //http://www.backbone.se/urlencodingUTF8.htm
  //http://www.degraeve.com/reference/urlencoding.php
  return finalEncodedString;
}
