import MaterialSnackbar from './../snackbar/snackbar';
import mdlComponentHandler from './../mdlComponentHandler';
import createElement from '../createElement/createElement';

const SNACKBAR_ID = "snackbar";

const snackbar = document.getElementById(SNACKBAR_ID) || createSnackbar();
mdlComponentHandler.upgradeElements(snackbar);

// creates a snackbar with an id of 'SNACKBAR_ID'
function createSnackbar() {
    // <div id="snackbar" class="mdl-js-snackbar mdl-snackbar">
    //     <div class="mdl-snackbar__text"></div>
    //     <div class="mdl-snackbar__actions">
    //         <button class="mdl-snackbar__action" type="button"></button>
    //         <button class="mdl-snackbar__action" type="button"></button>
    //     </div>
    // </div>

    let snackbar = createElement('div', 'mdl-js-snackbar mdl-snackbar');
    snackbar.id = SNACKBAR_ID;
    document.body.appendChild(snackbar);

    let snackbarText = createElement('div', 'mdl-snackbar__text');
    snackbar.appendChild(snackbarText);

    let snackbarActions = createElement('div', 'mdl-snackbar__actions');
    snackbar.appendChild(snackbarActions);

    let snackbarPrimaryAction = createElement('button', 'mdl-snackbar__action');
    snackbarActions.appendChild(snackbarPrimaryAction);

    let snackbarSecondaryAction = createElement('button', 'mdl-snackbar__action');
    snackbarActions.appendChild(snackbarSecondaryAction);

    return snackbar;
}

const snackbarView = snackbar.MaterialSnackbar;
export default snackbarView;