import {includes} from '../src/utils';
import nouns from '../src/dictionaries/nouns.json';
import adjectives from '../src/dictionaries/adjectives.json';
import fruits from '../src/dictionaries/fruits.json';
import breads from '../src/dictionaries/breads.json';
import thailand_provinces from '../src/dictionaries/thailand_provinces.json';
import thailand_districts from '../src/dictionaries/thailand_districts.json';
import generate, {blocklistFilter} from '../src/generator';
import {test, expect, describe, beforeEach} from "vitest";

describe('generator', function () {
  test('has a generate function', function () {
    expect(typeof generate).toBe('function');
  });

  describe('generate', function () {
    describe('when called with no argument', function () {
      let srvName: any;
      beforeEach(function () {
        srvName = generate();
      });

      test('returns an object with keys: dashed, spaced, raw', function () {
          expect(srvName).not.toBeUndefined();
          expect(srvName.dashed).not.toBeUndefined();
          expect(srvName.spaced).not.toBeUndefined();
          expect(srvName.raw).not.toBeUndefined();
          expect(srvName.dot).not.toBeUndefined();
          expect(srvName.under_scored).not.toBeUndefined();
      });

      test('has a property raw which is an array of two strings', function () {
        expect(srvName.raw.length).toBe(2);
        expect(typeof srvName.raw[0]).toBe('string');
        expect(typeof srvName.raw[1]).toBe('string');
      });

      test("has an array raw, the first item of which is from the adjectives array", function () {
        expect(includes(adjectives, srvName.raw[0])).toBe(true);
      });

      test("has an array raw, the second item of which is from the nouns array", function () {
          expect(includes(nouns, srvName.raw[1])).toBe(true);
      });

      test("has a property dashed, which is a string of raw's items joined with a dash", function () {
        expect(srvName.dashed).toBe(srvName.raw.join('-'));
      });

      test("has a property spaced, which is a string of raw's items joined with a space", function () {
          expect(srvName.spaced).toBe(srvName.raw.join(' '));
      });

      test("has a property dot, which is a string of raw's items joined with a dot", function () {
          expect(srvName.dot).toBe(srvName.raw.join('.'));
      });

      test("has a property under scored, which is a string of raw's items joined with an underscored", function () {
          expect(srvName.under_scored).toBe(srvName.raw.join('_'));
      });
    });

    describe('when called with an options object', function () {
      let srvName: any;

      test('with {}, shows default behaviour', function () {
        srvName = generate({});
        expect(srvName.raw.length).toBe(2);
        expect(typeof srvName.raw[0]).toBe('string');
        expect(typeof srvName.raw[1]).toBe('string');
      })

      test('with {number: true}, includes number', function () {
        srvName = generate({number: true});
        expect(srvName.raw.length).toBe(3);
        expect(typeof srvName.raw[0]).toBe('string');
        expect(typeof srvName.raw[1]).toBe('string');
        expect(typeof srvName.raw[2]).toBe('number');
        expect(srvName.raw[2].toString().length).toBe(4);
      });

      test('with {number: true, numDigit: "6"}, includes number', function () {
        srvName = generate({number: true, numDigit: "6"});
        expect(srvName.raw.length).toBe(3);
        expect(typeof srvName.raw[0]).toBe('string');
        expect(typeof srvName.raw[1]).toBe('string');
        expect(typeof srvName.raw[2]).toBe('number');
        expect(srvName.raw[2].toString().length).toBe(6);
      });

      test('with {words: n}, has n-1 adjectives and 1 noun', function () {
        srvName = generate({words: 3});
        expect(srvName.raw.length).toBe(3);
        expect(includes(adjectives, srvName.raw[0])).toBe(true);
        expect(includes(adjectives, srvName.raw[1])).toBe(true);
        expect(includes(nouns, srvName.raw[2])).toBe(true);

        srvName = generate({words: 5});
        expect(srvName.raw.length).toBe(5);
        expect(includes(adjectives, srvName.raw[0])).toBe(true);
        expect(includes(adjectives, srvName.raw[1])).toBe(true);
        expect(includes(adjectives, srvName.raw[2])).toBe(true);
        expect(includes(adjectives, srvName.raw[3])).toBe(true);
        expect(includes(nouns, srvName.raw[4])).toBe(true);
      });

      test('with {words: n}, has n-1 adjectives and 1 noun from set of fruits', function () {
        srvName = generate({words: 3, vocab: "fruits"});
        expect(srvName.raw.length).toBe(3);
        expect(includes(adjectives, srvName.raw[0])).toBe(true);
        expect(includes(adjectives, srvName.raw[1])).toBe(true);
        expect(includes(fruits, srvName.raw[2])).toBe(true);
      });

      test('with {words: n}, has n-1 adjectives and 1 noun from set of breads', function () {
        srvName = generate({words: 3, vocab: "breads"});
        expect(srvName.raw.length).toBe(3);
        expect(includes(adjectives, srvName.raw[0])).toBe(true);
        expect(includes(adjectives, srvName.raw[1])).toBe(true);
        expect(includes(breads, srvName.raw[2])).toBe(true);
      });

      test('with {words: n}, has n-1 adjectives and 1 noun from set of Thailand\'s provinces', function () {
        srvName = generate({words: 3, geo: "default"});
        expect(srvName.raw.length).toBe(3);
        expect(includes(adjectives, srvName.raw[0])).toBe(true);
        expect(includes(adjectives, srvName.raw[1])).toBe(true);
        expect(includes(thailand_provinces, srvName.raw[2])).toBe(true);
      });

      test('with {words: n}, has n-1 adjectives and 1 noun from set of Thailand\'s provinces with a number', function () {
        srvName = generate({words: 3, geo: "numbers"});
        console.log(JSON.stringify(srvName));
        expect(srvName.raw.length).toBe(4);
        expect(includes(adjectives, srvName.raw[0])).toBe(true);
        expect(includes(adjectives, srvName.raw[1])).toBe(true);
        expect(includes(thailand_provinces, srvName.raw[2])).toBe(true);
        expect(srvName.raw[3].toString().length).toBe(4);
      });

      test('with {words: n}, has n-1 adjectives and 1 noun from set of Thailand\'s districts', function () {
        srvName = generate({words: 3, geo: "others"});
        console.log(JSON.stringify(srvName));
        expect(srvName.raw.length).toBe(3);
        expect(includes(adjectives, srvName.raw[0])).toBe(true);
        expect(includes(adjectives, srvName.raw[1])).toBe(true);
        expect(includes(thailand_districts, srvName.raw[2])).toBe(true);
      });

      test('with {alliterative: true}, has 1 adjective and 1 noun beginning with same letter', function () {
        srvName = generate({alliterative: true});
        expect(includes(adjectives, srvName.raw[0])).toBe(true);
        expect(includes(nouns, srvName.raw[1])).toBe(true);
        expect(srvName.raw[0].substring(0, 1).toLowerCase() === srvName.raw[1].substring(0, 1).toLowerCase()).toBe(true);
      });

      test('with {firstLetter: "a"}, has 1 adjective beginning with "a"', function () {
        srvName = generate({firstLetter: "a"});
        expect(includes(adjectives, srvName.raw[0])).toBe(true);
        expect(srvName.raw[0].substring(0, 1).toLowerCase() === "a").toBe(true);
        expect(srvName.raw[1].substring(0, 1).toLowerCase() === "a").toBe(false);
      });

      test("with {blocklist: ['abandoned', 'account']}, doesn't include 'abandoned' nor 'account'", function () {
        const blocklist = ['abandoned', 'account'];
        const adj = blocklistFilter(blocklist, adjectives);
        const nou = blocklistFilter(blocklist, nouns);
        expect(includes(adj, 'abandoned')).toBe(false);
        expect(includes(nou, 'account')).toBe(false);
      });

    });
  });
});