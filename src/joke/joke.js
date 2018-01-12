import createElement from "./../createElement/createElement";
import componentHandler from "./../mdlComponentHandler";

const HIDDEN_INPUT_ID = 'hidden-copy-input';
const SNACKBAR_ID = "snackbar";

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
        /** @private used to let the user know they've copied the joke */
        this._snackBar = document.getElementById(SNACKBAR_ID);
    }

    // copies a joke's text
    copy() {
        if (!this._hiddenCopyInput) {
            this._createHiddenCopyInput();
        }

        this._hiddenCopyInput.value = this.text;
        this._hiddenCopyInput.select();
        document.execCommand("copy");

        if (!this._snackBar) {
            this._createSnackbar();
        }

        this._snackBar.MaterialSnackbar.showSnackbar({
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

    /** @private creates snackbar with an id of SACKBAR_ID and adds it to the DOM */
    _createSnackbar() {
        // <div id="snackbar" class="mdl-js-snackbar mdl-snackbar">
        this._snackBar = createElement('div', 'mdl-js-snackbar mdl-snackbar');
        this._snackBar.id = SNACKBAR_ID;
        document.body.appendChild(this._snackBar);

        // <div class="mdl-snackbar__text"></div>
        let snackbarText = createElement('div', 'mdl-snackbar__text');
        this._snackBar.appendChild(snackbarText);

        // <button type="button" class="mdl-snackbar__action"></button>
        let snackbarAction = createElement('button', 'mdl-snackbar__action');
        snackbarAction.type = "button";
        this._snackBar.appendChild(snackbarAction);

        componentHandler.upgradeElements(this._snackBar);
    }
}

export default Joke;