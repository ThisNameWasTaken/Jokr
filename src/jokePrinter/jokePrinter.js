import JokeList from './../jokeList/jokeList';
import Joke from './../joke/joke';
import fetchJoke from './../jokeFetcher/jokeFetcher';

// TODO: find a better name?
// Here might be a good place to fetch add and remove items from a list
export default (function () {
    'use strict';

    let jokeList = new JokeList(document.getElementById('joke-list'));
    const JOKE_FETCH_COUNT = 10;

    for (let i = 0; i < JOKE_FETCH_COUNT; i++) {
        fetchJoke().then(response => jokeList.addJoke(
            new Joke(
                response,
                Math.floor(Math.random() * 999)
            )
        ));  
    }
})();