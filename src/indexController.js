import JokeList from './jokeList/jokeList';
import Joke from './joke/joke';

export default class IndexController {
    constructor(container) {
        this._container = container;
        this._jokeList = new JokeList(container);

        // TODO: turn this code block into a function
        const JOKE_FETCH_COUNT = 10;

        for (let i = 0; i < JOKE_FETCH_COUNT; i++) {
            this._fetchJoke().then(response => this._jokeList.addJoke(
                new Joke(
                    response,
                    Math.floor(Math.random() * 999)
                )
            ));
        }
        // end of the code block
    }

    /**
     * Fetches a random joke or a specific one if an id is passed as an argument
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
}