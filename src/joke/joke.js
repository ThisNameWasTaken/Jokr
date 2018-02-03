import createElement from "./../createElement/createElement";
import componentHandler from "./../mdlComponentHandler";
import snackbarView from "./../snackbarView/snackbarView"

const HIDDEN_INPUT_ID = 'hidden-copy-input';

class Joke {
    /**
     * @param {string} title
     * @param {number} votes 
     */
    constructor(text, votes) {
        this.text = text;
        this.votes = votes;

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

        snackbarView.showSnackbar({
            message: 'Joke copied to clipboard.'
        });
    }

    /** @private creates an input with an id of HIDDEN_INPUT_ID and adds it to the DOM */
    _createHiddenCopyInput() {
        // <input type="text" id="hidden-copy-input">
        this._hiddenCopyInput = document.createElement('input');
        this._hiddenCopyInput.type = "text";
        this._hiddenCopyInput.id = HIDDEN_INPUT_ID;
        document.body.appendChild(this._hiddenCopyInput);
    }
}

export default Joke;