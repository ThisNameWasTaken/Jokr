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
        //     <div class="mdl-card__title">
        //         <h2 class="mdl-card__title-text">
        //             Joke title
        //         </h2>
        //     </div>
        //     <div class="mdl-card__supporting-text">
        //         Joke text
        //     </div>
        //     <div class="mdl-card__actions">
        //         <div class="mdl-layout-spacer"></div>
        //         <div>
        //             Joke votes
        //         </div>
        //         <button class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">
        //             <i class="material-icons">tag_faces</i>
        //         </button>
        //     </div>
        //     <div class="mdl-card__menu">
        //         <button class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">
        //             <i class="material-icons">content_copy</i>
        //         </button>
        //     </div>
        // </div>

        let list = this.element;
        // <div class="mdl-card mdl-card--joke mdl-shadow--2dp">
        let card = createElement('div', 'mdl-card mdl-card--joke mdl-shadow--2dp');
        list.appendChild(card);

        // <div class="mdl-card__title">
        let cardTitle = createElement('div', 'mdl-card__title');
        card.appendChild(cardTitle);

        // <h2 class="mdl-card__title-text">Joke title</h2>
        let cardTitleText = createElement('h2', 'mdl-card__title-text');
        cardTitleText.innerHTML = joke.title;
        cardTitle.appendChild(cardTitleText);

        // div class="mdl-card__supporting-text">here goes the joke...</div>
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

        // <div class="mdl-card__menu">
        let cardMenu = createElement('div', 'mdl-card__menu');
        card.appendChild(cardMenu);

        // <button class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">
        let copyButton = createElement('button', 'mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect');
        cardMenu.appendChild(copyButton);

        // i class="material-icons">content_copy</i>
        let copyIcon = createElement('i', 'material-icons');
        copyIcon.innerHTML = 'content_copy';
        copyButton.appendChild(copyIcon);

        componentHandler.upgradeElements(smileButton);
        componentHandler.upgradeElements(copyButton);
    }

    removeJoke() {
        // TODO: implement this method
    }
}

export default JokeList;
// export default Joke;