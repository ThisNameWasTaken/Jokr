import JokeList from './jokeList/jokeList';
import Joke from './joke/joke';
import idb from './idb';

export default class IndexController {
    constructor(container) {
        this._container = container;
        this._jokeList = new JokeList(container);

        this._registerServiceWorker();
        this._idb = this._openDatabase();
        this._fetchJokesFromNetwork();
    }

    _openDatabase() {
        if (!navigator.serviceWorker) {
            return Promise.resolve();
        }

        return idb.open('jokr', 1, upgradeDb => {
            upgradeDb.createObjectStore('jokes');
        });
    }

    _registerServiceWorker() {
        if (!navigator.serviceWorker) {
            return;
        }

        navigator.serviceWorker.register('/sw.js').then(function () {
            console.log('SW registered!');
        }).catch(function () {
            console.log('SW did NOT register! :/');
        });
    }

    /**
     * @private Fetches a random joke or a specific one if an id is passed as an argument
     * @param {string|number} id - joke's id
     * @param {string} url - the url from which the joke can be fetched
     */
    _fetchJoke(id, url = 'https://api.chucknorris.io/jokes/random') {
        if (id) {
            url += id;
        }

        return new Promise(
            (resolve, reject) => fetch(url)
                .then(response => response.json())
                .then(response => {
                    this._idb.then(db => db.transaction('jokes', 'readwrite').objectStore('jokes').put(response.value, response.id));
                    resolve(response.value);
                })
        );
    }

    /**
     * @private Fetches a given number of jokes jokes from the network
     * @param {number} numOfJokes - the number of jokes which must be fetched (10 by default)
     */
    _fetchJokesFromNetwork(numOfJokes = 10) {
        for (let i = 0; i < numOfJokes; i++) {
            this._fetchJoke().then(response => this._jokeList.addJoke(
                new Joke(
                    response,
                    Math.floor(Math.random() * 999)
                )
            ));
        }
    }
}