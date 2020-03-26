const stack = require('.');

describe('lib/stack', () => {
    afterEach(() => {
        stack.release();
    });
    it('Should stack functions', () => {
        expect(stack.size).toBe(0);
        stack.enqueue(() => null);
        expect(stack.size).toBe(1);
    });
    it('should fire all callbacks on release', () => {
        let trigerred = 0;
        stack.enqueue(() => trigerred++);
        stack.enqueue(() => trigerred++);
        stack.enqueue(() => trigerred++);
        stack.release();
        expect(trigerred).toBe(3);
    });
    it('should empty stack before firing all callbacks', () => {
        stack.enqueue(() => expect(stack.size).toBe(0));
        expect(stack.size).toBe(1);
        stack.release();
    });
});
