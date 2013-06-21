/*jslint node:true nomen:true */
// uses jasmine-node-karma
// https://npmjs.org/package/jasmine-node-karma
"use strict";

var Enterpreter = require('../Enterpreter');
var e = new Enterpreter();
function evaluate(s) {
    return e.evaluate(e.parse(s));
}
describe('Enterpreter Suite', function () {
    it('evaluates numbers',
        function () {
            expect(evaluate('1')).toBe(1);
        });
    it('evaluates booleans',
        function () {
            var t = evaluate('#t'),
                f = evaluate('#f');

            expect(e.isTrue(t)).toBe(true);
            expect(e.isTrue(f)).toBe(false);
        });
    it('evaluates strings',
         function () {
           // wrap string in single-quotes
            function wrapString(s) {
                return "'" + s + "'";
            }
            var s = 'Hello, World!';
            expect(evaluate(wrapString(s))).toBe(s);

            s = 'chicken fish soup';
            expect(evaluate(wrapString(s))).toBe(s);
        });
    it('evaluates application of primitive procedures',
        function () {
            expect(evaluate('(+ 1 2)')).toBe(3);
            expect(evaluate('(* 1 2)')).toBe(2);
        });
    it('recursively evaluates primitive procedures',
        function () {
            expect(evaluate('(+ 1 (* 5 2))')).toBe(11);
            expect(evaluate('(+ (* 5 2) 1)')).toBe(11);
        });
    it('allows defining and getting of variables in the environment',
        function () {
            expect(evaluate('( define age 32 )')).toBe('age');
            expect(evaluate('( define weight 135.6)')).toBe('weight');
            expect(evaluate('age')).toBe(32);
            expect(evaluate('weight')).toBe(135.6);
        });
    it('allows setting and getting of variables in the environment',
        function () {
            expect(evaluate('( define age 32 )')).toBe('age');
            expect(evaluate('( define weight 135.6)')).toBe('weight');
            expect(evaluate('( set! age 88 )')).toBe(88);
            expect(evaluate('( set! weight 240.9)')).toBe(240.9);
            expect(evaluate('age')).toBe(88);
            expect(evaluate('weight')).toBe(240.9);
        });
    it('does not allow setting of undefined variables',
        function () {
            expect(function () {evaluate('( set! undefinedThing 32 )'); }).toThrow(
                e.ERROR.UNBOUND_VARIABLE
            );
        });
    it('throws an error if you evaluate something not defined in the environment',
        function () {
            expect(function () {evaluate('notdefined'); }).toThrow(
                e.ERROR.UNKNOWN_EXPRESSION_TYPE
            );
        });
    it('handles quoted numbers and lists',
        function () {
            expect(evaluate('(quote 1)')).toBe(1);
            expect(evaluate('(quote (1 2 3))')).toMatch([1, 2, 3]);
        });
    it('evaluates if expressions',
        function () {
            expect(evaluate('( if #t "YES" "NO" )')).toBe("YES");
            expect(evaluate('( if #f "YES" "NO" )')).toBe("NO");
            expect(evaluate('( if #t ( + 3 ( * 2 9 ) ) "NO" )')).toBe(21);
        });
    it('allows for definition of lambda expressions',
        function () {
            expect(evaluate('( lambda ( x ) ( + x 3 ) )')).toBe("TODO"); // add 3
        });
    it('executes lambda expressions',
        function () {
            expect(evaluate('(( lambda ( x ) ( + x 3 )) 3)')).toBe(6); // add 3
        });
    it('executes begin expressions',
        function () {
            expect(evaluate('(begin (define x 7) (define y 32) (+ x y))')).toBe(39);
        });
    it('executes cond expressions',
        function () {
            expect(evaluate('(cond ((#f 123) (#f 555) (#t 333)')).toBe(333);
        });

});
