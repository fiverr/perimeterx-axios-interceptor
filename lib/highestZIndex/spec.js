const highestZIndex = require('.');

let all;
const { getComputedStyle } = document.defaultView;

describe('lib/highestZIndex', () => {
    beforeAll(() => {
        all = [...document.querySelectorAll('*')];
    });
    afterEach(() => {
        [...document.querySelectorAll('*')].filter(
            (element) => !all.includes(element)
        ).forEach(
            (element) => element.parentNode.removeChild(element)
        );

        document.defaultView.getComputedStyle = getComputedStyle;
    });
    it('should return 1 by default', () => {
        expect(highestZIndex()).toBe(1);
    });
    it('should return 1 more than passed in value', () => {
        expect(highestZIndex(100)).toBe(101);
    });
    it('should top the highest DOM elements on the page', () => {
        const div = document.createElement('div');
        div.style.zIndex = 10;
        document.body.appendChild(div);
        expect(highestZIndex()).toBe(11);
    });
    it('should top the highest DOM elements on the page', () => {
        const divs = new Array(10).fill(null).map(
            () => document.createElement('div')
        );
        divs.forEach((div, index) => { div.style.zIndex = index; });
        divs.forEach((div) => document.body.appendChild(div));
        expect(highestZIndex()).toBe(10);
    });
    it('should ignore "auto" zIndex', () => {
        const div = document.createElement('div');
        div.style.zIndex = 'auto';
        document.body.appendChild(div);
        expect(highestZIndex()).toBe(1);
    });
    it('should use the highest of values', () => {
        const div = document.createElement('div');
        div.style.zIndex = 10;
        document.body.appendChild(div);
        expect(highestZIndex(20)).toBe(21);
    });
    it('should cap at max supported z-index', () => {
        const div = document.createElement('div');
        div.style.zIndex = 9999999999;
        document.body.appendChild(div);
        expect(highestZIndex()).toBe(2147483647);
    });
    it('should fall back to max z index', () => {
        const div = document.createElement('div');
        div.style.zIndex = 9999999999;
        document.body.appendChild(div);
        document.defaultView.getComputedStyle = () => { throw new Error('Not supported'); };
        expect(highestZIndex()).toBe(2147483647);
    });
});
