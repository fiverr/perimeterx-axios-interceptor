const store = require('.');

const { Map } = global;

const map = store();
delete global.Map;
const obj = store();
global.Map = Map;

describe('lib/store', () => {
    it('should return map if Map is supported', () => {
        expect(map instanceof Map).toBe(true);
    });
    it('should return map if Map is supported', () => {
        expect(obj instanceof Map).toBe(false);
    });
    it.each(
        [
            [ 'Map', map ],
            [ 'Obj', obj ]
        ]
    )('%p should implement the features we use of Map', (_, subject) => {
        [
            [ 'key1', 'key2', 'value1', 'value2' ],
            [ {}, {}, 'value1', 'value2' ],
            [ 'key1', 'key2', {}, {} ],
            [ new String(), new String(), NaN, NaN ]
        ].forEach(
            ([ key, missingKey, value, otherValue ]) => {
                expect(subject.has(key)).toBe(false);
                expect(subject.get(key)).toBe(undefined);
                expect(subject.set(key, value)).toBe(subject);
                expect(subject.has(key)).toBe(true);
                expect(subject.get(key)).toBe(value);
                subject.set(key, otherValue);
                expect(subject.get(key)).toBe(otherValue);
                expect(subject.delete(missingKey)).toBe(false);
                expect(subject.delete(key)).toBe(true);
                expect(subject.has(key)).toBe(false);
                expect(subject.get(key)).toBe(undefined);
            }
        );
    });
});
