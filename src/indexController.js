import JokeView from './jokeView/jokeView';
import snackbarView from './snackbarView/snackbarView';
import idb from './idb';
import supportsPassive from './supportsPassive/supportsPassive';

const MAX_CACHED_JOKES = 10;

export default class IndexController {
    constructor(container) {
        this._container = container;
        this._jokeView = new JokeView(container);
        this._reachedBottom = false;
        this._isFetchingJokes = false;
        this._cachedJokesNum = 0;

        this._registerServiceWorker();
        this._idb = this._openDatabase();
        this._showCachedJokes()
            // if the jokes from the cache are not enough, fetch some more from the network
            .catch(() => this._fetchJokesFromNetwork());
        this._fetchJokesOnScrollBottom();
    }

    /**
     * @private returns a promise for the database
     */
    _openDatabase() {
        if (!navigator.serviceWorker) {
            return Promise.resolve();
        }

        return idb.open('jokr', 1, upgradeDb => {
            upgradeDb.createObjectStore('jokes', { keyPath: 'id' });
            let jokeStore = upgradeDb.transaction.objectStore('jokes');
            jokeStore.createIndex('dateTime', 'dateTime');
        });
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
                        likedByUser: Math.round(Math.random()) ? true : false,
                        dateTime: new Date().toISOString()
                    }
                    this._idb.then(db => db.transaction('jokes', 'readwrite').objectStore('jokes').put(jokeData));

                    // call the cleanCache method when too many jokes were cached
                    if (this._cachedJokesNum < MAX_CACHED_JOKES) {
                        this._cachedJokesNum++;
                        this._isFetchingJokes = true;
                    } else {
                        this._cachedJokesNum = 0;
                        this._cleanCache();
                    }

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
            this._fetchJoke().then(jokeData => this._jokeView.addJoke(jokeData));
        }
    }

    /**
     * @private Fetches a given number of jokes jokes from the network
     * when the user scrolled to the bottom of the page
     * @param {number} numOfJokes - the number of jokes which must be fetched (10 by default)
     */
    _fetchJokesOnScrollBottom(numOfJokes = 10) {
        const layoutContent = document.getElementsByClassName('mdl-layout__content')[0];
        layoutContent.addEventListener('scroll', () => {
            // if the scroll event has already been triggered 
            // and jokes are still being fetched from the network reurn
            if (this._isFetchingJokes) {
                this._isFetchingJokes = (this._cachedJokesNum < 10);
                return;
            }

            // that 8 is just an offset so the "bottom" doesn't have to be the end of the document
            if (layoutContent.scrollTop + layoutContent.clientHeight >= layoutContent.scrollHeight - 8) {
                if (!this._reachedBottom) {
                    this._reachedBottom = true;
                    this._fetchJokesFromNetwork(numOfJokes);
                }
            } else {
                this._reachedBottom = false;
            }
        }, supportsPassive ? { passive: true } : false);
    }

    /**
     * @private returns a promise which resolves if at least 10 jokes were gathered from the database,
     * otherwise it rejects
     */
    _showCachedJokes() {
        return this._idb.then(db => db.transaction('jokes').objectStore('jokes').index('dateTime').getAll())
            .then(jokes => {
                if (!jokes.length) {
                    return Promise.reject();
                }

                // TODO: use a cursor instead because when database gets bigger getAll() might be significantly slower
                // show the last 10 jokes from the cache
                // if there are not 10 jokes in the cache then show whatever amount there is in the cache
                const start = (jokes.length - MAX_CACHED_JOKES) > 0 ? (jokes.length - MAX_CACHED_JOKES) : 0;
                for (let i = start; i < jokes.length; i++) {
                    this._jokeView.addJoke(jokes[i]);
                }

                if (jokes.length < MAX_CACHED_JOKES) {
                    return Promise.reject();
                }

                return Promise.resolve();
            });
    }

    /**
     * @private deletes all jokes, which are not liked by the user, from the databse
     */
    _cleanCache() {
        this._idb.then(db => db.transaction('jokes', 'readwrite').objectStore('jokes').index('dateTime').openCursor()
            .then(function (cursor) {
                if (!cursor) {
                    return;
                }

                return cursor.advance(MAX_CACHED_JOKES); // Always keep the least MIN_CACHE_ENTRIES entries inside the database
            })
            .then(function logJoke(cursor) {
                if (!cursor) {
                    return;
                }

                if (!cursor.value.likedByUser) {
                    cursor.delete();
                }

                return cursor.continue().then(logJoke);
            }));
    }
}