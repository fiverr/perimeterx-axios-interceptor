let output;

/**
 * Add debug log records at the top
 * @param {...string}
 * @returns {void}
 */
export default function debug(...text) {
    output = output || document.getElementById('output');
    const line = document.createElement('p');
    print(text.join(' '), line);
    if (output.children.length) {
        output.insertBefore(line, output.firstChild);
    } else {
        output.appendChild(line);
    }
    console.debug(...text);
}

/**
 * Typewriter effect
 * @param {string}
 * @param {HTMLElement}
 * @returns {void}
 */
function print(str, ele) {
    const [ char, ...rest ] = str;
    ele.appendChild(document.createTextNode(char));

    str = rest.join('');
    if (str.length === 0) {
        return;
    }
    setTimeout(print, 40, str, ele);
}
