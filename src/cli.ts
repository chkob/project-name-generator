#! /usr/bin/env node
import generate, {Options} from "./generator";

const args = process.argv.slice(2); // Remove the first two elements

let options: Options = {
    words: 2,
    number: false,
    alliterative: false,
    vocab: 'default',
    numDigit: '4'
};

args.forEach((arg:string, index:number) => {
    switch (arg) {
        case '-w':
        case '--words':
            options.words = parseInt(args[index + 1]);
            break;
        case '-n':
        case '--numbers':
            options.number = true;
            break;
        case '-a':
        case '--alliterative':
            options.alliterative = true;
            break;
        case '-l':
        case '--first-letter':
            options.firstLetter = args[index + 1];
            break;
        case '-b':
        case '--blocklist':
            options.blocklist = args[index + 1].split(',');
            break;
        case '-v':
        case '--vocab':
            options.vocab = args[index + 1];
            break;
        case '-g':
        case '--geo':
            options.geo = args[index + 1];
            break;
        case '-d':
        case '--digit':
            options.numDigit = args[index + 1];
            break;
    }
});

if (args.includes('-h') || args.includes('--help')) {
    help();
} else  {
    const srvName = generate(options);
    if (args.includes('-f') || args.includes('--format')) {
        const flagIndex = args.indexOf('-f') !== -1 ? args.indexOf('-f') : args.indexOf('--format');
        const outputType = args[flagIndex + 1];
        switch (outputType) {
            case 'dashed':
                console.log(srvName.dashed);
                break;
            case 'raw':
                console.log(srvName.raw);
                break;
            case 'spaced':
                console.log(srvName.spaced);
                break;
            case 'dot':
                console.log(srvName.dot);
                break;
            case 'under_scored':
                console.log(srvName.under_scored);
                break;
            case 'camelCase':
                console.log(srvName.camelCase);
                break;
            default:
                console.log(srvName);
                break;
        }
    } else {
        console.log(srvName);
    }
}

function help() {
    const helpText = `
   _____            _   __                     ______         
  / ___/______   __/ | / /___ _____ ___  ___  / ____/__  ____ 
  \\__ \\/ ___/ | / /  |/ / __ \`/ __ \`__ \\/ _ \\/ / __/ _ \\/ __ \\
 ___/ / /   | |/ / /|  / /_/ / / / / / /  __/ /_/ /  __/ / / /
/____/_/    |___/_/ |_/\\__,_/_/ /_/ /_/\\___/\\____/\\___/_/ /_/ 
                                                              


Usage: server-name-gen [options]


Options:

  -w, --words [num]       number of words [2]
  -n, --numbers           suffix with a random number
  -a, --alliterative      use alliterative
  -f, --format [format]   output format type [raw|dashed|spaced|dot|under_scored|camelCase]
  -l, --first-letter [s]  first letter of the first word [single letter]
  -b, --blocklist [words] comma separated list of words to exclude
  -v, --vocab [category]  category of vocaburaries [default|fruits|breads]
  -g, --geo [category]    category of geolocations [default|numbers]
  -d, --digit [num]       number of digit when append with number [4]
  -h, --help              output usage information
`

    console.log(helpText);

}