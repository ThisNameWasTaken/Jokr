/**
 * Creates a new html Element
 * @param {string} element 
 * @param {string} className 
 * @returns {HTMLElement}
 */
function createElement(element, className) {
    let newElement = document.createElement(element);

    if (className) {
        let classes = className.split(' ');
        for (let i = 0; i < classes.length; i++) {
            newElement.classList.add(classes[i]);
        }
    }

    return newElement;
}

export default createElement;