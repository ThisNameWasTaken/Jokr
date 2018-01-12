import JokeList from './../jokeList/jokeList';
import Joke from './../joke/joke';
import fetchJoke from './../jokeFetcher/jokeFetcher';

// TODO: find a better name?
// Here might be a good place to fetch add and remove items from a list
function printJokes() {
    let jokeList = new JokeList(document.getElementById('joke-list'));

    // HELP:
    // I didn't manage to get the promise's value right, may be you can, please let me know if you do :)
    console.log(fetchJoke());

    // Just adding some dummy text
    jokeList.addJoke(
        new Joke('1',
            'Lorem ipsum dolor',
            'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Modi, quos minus repudiandae animi ipsum laboriosam quam obcaecati, magni, magnam quis consequuntur alias nobis aspernatur adipisci nemo consequatur quasi reiciendis expedita!',
            424));

    jokeList.addJoke(
        new Joke('1',
            'Blanditiis autem',
            'Blanditiis autem, iste, sapiente reiciendis nihil qui repudiandae quod, asperiores earum debitis incidunt impedit dicta quis! Eligendi consequatur, rerum perspiciatis soluta dolorem autem repudiandae excepturi voluptatum ducimus illo. Voluptas, molestiae.',
            51));

    jokeList.addJoke(
        new Joke('1',
            'Veritatis non officia',
            'Veritatis non officia qui ullam amet nihil, reprehenderit error exercitationem sequi ratione illum atque omnis, iusto sapiente quod assumenda cum voluptatum libero dolore! Ipsum harum magnam accusantium repellendus, dolores reprehenderit!',
            83));
}

export default printJokes;