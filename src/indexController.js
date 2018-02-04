import JokeList from './jokeList/jokeList';
import Joke from './joke/joke';
import snackbarView from './snackbarView/snackbarView';
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

        return idb.open('jokr', 1, upgradeDb => upgradeDb.createObjectStore('jokes', { keyPath: 'id' }));
    }

    _registerServiceWorker() {
        if (!navigator.serviceWorker) {
            return;
        }

        navigator.serviceWorker.register('/sw.js').then(reg => {
            if (!navigator.serviceWorker.controller) {
                return;
            }

            if (reg.waiting) {
                // if there is a sw already waiting then update since the user did not yet interact with the page
                reg.waiting.postMessage({ action: 'skipWaiting' });
                return;
            }

            if (reg.installing) {
                this._requestUpdateOnStateChange(reg);
                return;
            }

            reg.addEventListener('updatefound', () => this._requestUpdateOnStateChange(reg));
        });

        navigator.serviceWorker.addEventListener('controllerchange', () => location.reload());
    }

    /**
     * @private Sends a notification to the user that there is an update available and updates the app if the user choses to do so
     * @param {ServiceWorkerRegistration} reg
     */
    _requestUpdateOnStateChange(reg) {
        reg.installing.addEventListener('statechange', function () {
            if (this.state == 'installed') {
                snackbarView.showSnackbar({
                    message: 'Update available!',
                    timeout: 86400000, // 24h
                    actionHandler: () => { this.postMessage({ action: 'skipWaiting' }); },
                    actionText: 'Update!',
                    secondaryActionHandler: function () { },
                    secondaryActionText: 'No thanks!',
                });
            }
        })
    }

    /**
     * @private Fetches a random joke or a specific one if an id is passed as an argument
     * @param {string|number} id - joke's id
     * @param {string} url - the url from which the joke can be fetched
     * @returns {object}
     */
    _fetchJoke(id = 'random', url = 'https://api.chucknorris.io/jokes/') {
        if (id) {
            url += id;
        }

        return new Promise(
            (resolve, reject) => fetch(url)
                .then(response => response.json())
                .then(response => {
                    const jokeData = {
                        id: response.id,
                        text: response.value,
                        likes: Math.floor(Math.random() * 999),
                        likedByUser: false
                    }
                    this._idb.then(db => db.transaction('jokes', 'readwrite').objectStore('jokes').put(jokeData));
                    resolve(jokeData);
                })
        );
    }

    /**
     * @private Fetches a given number of jokes jokes from the network
     * @param {number} numOfJokes - the number of jokes which must be fetched (10 by default)
     */
    _fetchJokesFromNetwork(numOfJokes = 10) {
        for (let i = 0; i < numOfJokes; i++) {
            this._fetchJoke().then(jokeData => this._jokeList.addJoke(
                new Joke(
                    jokeData.id,
                    jokeData.text,
                    jokeData.likes,
                    jokeData.likedByUser
                )
            ));
        }
    }
}