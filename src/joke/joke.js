import createElement from "../createElement/createElement";

const HIDDEN_INPUT_ID = 'hidden-copy-input';

class Joke {
    /**
     * @param {string} title
     * @param {number} votes 
     */
    constructor(text, votes) {
        this.text = text;
        this.votes = votes;
        // we set this input's value to the joke's then copy it
        this._hiddenCopyInput = document.getElementById(HIDDEN_INPUT_ID);
    }

    // copies a joke's text
    copy() {
        if (!this._hiddenCopyInput) {
            this._hiddenCopyInput = document.createElement('input');
            this._hiddenCopyInput.type = "text";
            this._hiddenCopyInput.id = HIDDEN_INPUT_ID;
            document.body.appendChild(this._hiddenCopyInput);
        }

        this._hiddenCopyInput.value = this.text;
        this._hiddenCopyInput.select();
        document.execCommand("copy");
    }
}

export default Joke;