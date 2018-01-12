class Joke {
    /**
     * @param {string} id 
     * @param {string} text
     * @param {string} title
     * @param {number} votes 
     */
    constructor(id, title, text, votes) {
        this.id = id;
        this.title = title;
        this.text = text;
        this.votes = votes;
    }
}

export default Joke;