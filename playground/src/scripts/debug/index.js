let output;

/**
 * Add debug log records at the top
 * @param {...string}
 * @returns {void}
 */
export function debug(...text) {
    log('debug', ...text);
}

/**
 * Add info log records at the top
 * @param {...string}
 * @returns {void}
 */
export function info(...text) {
    log('info', ...text);
}

/**
 * Add debug log records at the top
 * @param {...string}
 * @returns {void}
 */
function log(level, ...text) {
    output = output || document.getElementById('output');
    const line = document.createElement('p');
    line.className = level;
    print(text.join(' '), line);
    if (output.children.length) {
        output.insertBefore(line, output.firstChild);
    } else {
        output.appendChild(line);
    }
    console[level](...text);
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
