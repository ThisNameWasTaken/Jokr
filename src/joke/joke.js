import createElement from "./../createElement/createElement";
import componentHandler from "./../mdlComponentHandler";
import snackbarView from "./../snackbarView/snackbarView"

const HIDDEN_INPUT_ID = 'hidden-copy-input';

export default class Joke {
    /**
     * @param {Object} jokeData
     * @param {string|number} jokeData.id
     * @param {string} jokeData.title
     * @param {number} jokeData.likes
     * @param {boolean} jokeData.isLikedByUser
     */
    constructor(jokeData = { id, text, likes, isLikedByUser: false }) {
        this.id = jokeData.id;
        this.text = jokeData.text;
        this.likes = jokeData.likes;
        this.isLikedByUser = jokeData.isLikedByUser;

        /** @private we set this input's value to the joke's then copy it */
        this._hiddenCopyInput = document.getElementById(HIDDEN_INPUT_ID);
    }

    // copies a joke's text
    copyToClipboard() {
        if (!this._hiddenCopyInput) {
            this._createHiddenCopyInput();
        }

        this._hiddenCopyInput.value = this.text;
        this._hiddenCopyInput.select();
        document.execCommand("copy");
        this._hiddenCopyInput.blur();

        snackbarView.showSnackbar({ message: 'Joke copied to clipboard.' });
    }

    toggleLike() {
        // TODO: update the cache and the database
        this.isLikedByUser ? this.likes-- : this.likes++;
        this.isLikedByUser = !this.isLikedByUser;
    }

    /** @private creates an input with an id of HIDDEN_INPUT_ID and adds it to the DOM */
    _createHiddenCopyInput() {
        // <input type="text" id="hidden-copy-input">
        this._hiddenCopyInput = document.createElement('input');
        this._hiddenCopyInput.type = "text";
        this._hiddenCopyInput.id = HIDDEN_INPUT_ID;
        this._hiddenCopyInput.setAttribute("aria-hidden", "true");
        document.body.appendChild(this._hiddenCopyInput);
    }
}