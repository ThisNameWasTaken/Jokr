/**
 * @param {string} id - joke's id
 * @returns {Promise}
 */
function fetchJoke(id) {
    let url = 'https://api.chucknorris.io/jokes/random';
    if (id) {
        url += id;
    }
    return new Promise((resolve, reject) => {
        fetch(url)
            .then(response => response.json())
            .then(response => resolve(response.value));
    });
}

export default fetchJoke;