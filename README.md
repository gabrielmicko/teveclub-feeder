# Camel feeder

This application can feed, teach and play with your camel on behalf of you on cool camels website (http://teveclub.hu).

### What it does:
* logs in
* gives your pet drink and food
* picks a subject to learn (if not selected already), teaches it
* plays the lottery game

### Configuration

You can set your camel login details in the **config.json.** Please check out example.config.json for more details. You can set a range of numbers which  is needed for the lottery game. A random number is being picked from the range. You can debug the app, html, http requests and the results by setting the debug mode on.
```js
{
    "camels": [
    {
        "username": "Camel Username",
        "password": "Camel Password",
        "min": 15,
        "max": 88
    }
    ],
    "debug": 1
}
```
### Running the application
```sh
npm install
npm start
```

### Version
1.0.0

### Cron job
I suggest you to run the app once a day by setting up a cron job.
