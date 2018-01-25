import JokeList from './jokeList/jokeList';
import Joke from './joke/joke';

export default class IndexController {
    constructor(container) {
        this._container = container;
        this._jokeList = new JokeList(container);

        this._fetchJokesFromNetwork();
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

        return new Promise((resolve, reject) => {
            fetch(url)
                .then(response => response.json())
                .then(response => resolve(response.value));
        });
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