import Joke from './../joke/joke';
import createElement from './../createElement/createElement';
import componentHandler from './../mdlComponentHandler';

class JokeList {
    /**
     * @param {HTMLElement} element
     */
    constructor(element) {
        this.element = element;
    }

    /**
     * adds a joke inside the dom list element
     * @param {Joke} joke 
     */
    addJoke(joke) {
        // this is what we are creating
        // <div class="mdl-card--joke mdl-card mdl-shadow--2dp">
        //     <div class="mdl-card__supporting-text">
        //         Joke goes here ...
        //     </div>

        //     <div class="mdl-card__actions">
        //         <div class="mdl-layout-spacer"></div>
        //         <div>
        //             Joke votes
        //         </div>

        //         <button class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">
        //             <i class="material-icons">tag_faces</i>
        //         </button>

        //         <button class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">
        //             <i class="material-icons">content_copy</i>
        //         </button>
        //     </div>
        // </div>

        let list = this.element;
        // <div class="mdl-card mdl-card--joke mdl-shadow--2dp">
        let card = createElement('div', 'mdl-card mdl-card--joke mdl-shadow--2dp');
        list.appendChild(card);

        // div class="mdl-card__supporting-text" > here goes the joke...</div >
        let cardSupportingText = createElement('div', 'mdl-card__supporting-text');
        cardSupportingText.innerHTML = joke.text;
        card.appendChild(cardSupportingText);

        // <div class="mdl-card__actions">
        let cardActions = createElement('div', 'mdl-card__actions');
        card.appendChild(cardActions);

        // <div class="mdl-layout-spacer"></div>
        let layoutSpacer = createElement('div', 'mdl-layout-spacer');
        cardActions.appendChild(layoutSpacer);

        // <div>joke_votes</div>
        let jokeVotes = document.createElement('div');
        jokeVotes.innerHTML = joke.votes;
        cardActions.appendChild(jokeVotes);

        // <button class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">
        let smileButton = createElement('button', 'mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect');
        cardActions.appendChild(smileButton);

        // <i class="material-icons">tag_faces</i>
        let smileIcon = createElement('i', 'material-icons');
        smileIcon.innerHTML = 'tag_faces';
        smileButton.appendChild(smileIcon);

        // <button class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">
        let copyButton = createElement('button', 'mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect');
        copyButton.addEventListener('click', () => joke.copy());
        cardActions.appendChild(copyButton);

        // i class="material-icons">content_copy</i>
        let copyIcon = createElement('i', 'material-icons');
        copyIcon.innerHTML = 'content_copy';
        copyButton.appendChild(copyIcon);

        componentHandler.upgradeElements(smileButton);
        componentHandler.upgradeElements(copyButton);
    }

    /**
    * removes the last joke inside the element joke-list
    */
    removeJoke() {
        this.element.removeChild(this.element.lastChild);
    }
}

export default JokeList;