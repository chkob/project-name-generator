import nouns from './dictionaries/nouns.json';
import adjectives from './dictionaries/adjectives.json';

import fruits from './dictionaries/fruits.json';
import thailand_provinces from './dictionaries/thailand_provinces.json';
import thailand_districts from './dictionaries/thailand_districts.json';
import breads from './dictionaries/breads.json';

import {filter, merge, random, sample, times} from './utils';


export interface Options {
  number: boolean;
  words: number;
  alliterative: boolean;
  firstLetter?: string;
  blocklist?: string[];
  vocab: string;
  geo?: string;
  numDigit: string;
}

interface Result {
    raw: (string | number)[];
    dashed: string;
    spaced: string;
    dot: string;
    under_scored: string;
    camelCase: string;
}

function getVocab(options?: Partial<Options>): string[] {

  if(options?.geo === undefined) {
    switch(options?.vocab)
    {
      case "fruits": return fruits;
      case "breads": return breads;
      default: return nouns;
    }
  }
  else {
    return options.geo === 'default' || options.geo === 'numbers' ? thailand_provinces : thailand_districts;
  }
}

function generate(options?: Partial<Options>) :Result {
  const defaults: Options = {
    number: false,
    words: 2,
    alliterative: false,
    vocab: 'default',
    numDigit: '4'
  };
  const opt = merge(defaults, options || {});
  const raw = getRawProjName(opt);

  return {
    raw: raw,
    dashed: raw.join('-'),
    spaced: raw.join(' '),
    dot: raw.join('.'),
    under_scored: raw.join('_'),
    camelCase: camelCase(raw)
  };
}

function getRawProjName(options: Options) {

  const raw: (string | number)[] = [];
  const adj = blocklistFilter(options.blocklist || [], adjectives);
  const vocab = getVocab(options);
  const nou = blocklistFilter(options.blocklist || [], vocab);

  times(options.words - 1, function () {
    if (options.alliterative && raw.length) {
      const adjectiveSample = sample(getAlliterativeMatches(adj, raw[0].toString().substring(0, 1)));
      if (adjectiveSample !== undefined) {
        raw.push(adjectiveSample);
      }
    } else {
      let adjectiveSample;
      if(options.firstLetter && raw.length === 0) {
        adjectiveSample = sample(filter(adj, function(elm) { return elm.substring(0, 1).toLowerCase() === options.firstLetter; }));
      } else {
        adjectiveSample = sample(adj);
      }
      if (adjectiveSample !== undefined) {
        raw.push(adjectiveSample.toLowerCase());
      }
    }
  });

  if (options.alliterative) {
    const nounSample = sample(getAlliterativeMatches(nou, raw[0].toString().substring(0, 1)));
    if (nounSample !== undefined) {
      raw.push(nounSample);
    }
  } else {
    const noun = sample(nou);
    if (noun !== undefined) {
      raw.push(noun.toLowerCase());
    }
  }

  if (options.number || options.geo === 'numbers') {
    const characteristics = parseInt(options.numDigit, 10);
    const exponent = Math.min(20, Math.max(1, Math.abs(characteristics)));
    raw.push(random(1, Math.pow(10, exponent) - 1));
  }

  return raw;
}

function getAlliterativeMatches(arr: string[], letter: string) {
  const check = letter.toLowerCase();
  return filter(arr, function(elm) { return elm.substring(0, 1).toLowerCase() === check; });
}

function camelCase(input:(string | number)[]) {
  return input.map(function(n, i) {
    return i === 0 || typeof n !== 'string' ? n : n.substr(0, 1).toUpperCase() + n.substr(1);
  }).join("");
}

export function blocklistFilter(blocklist: string[], raw: string[]) {
  return filter(raw, function(elm) { return blocklist.indexOf(elm.toString()) === -1; });
}

export default generate;