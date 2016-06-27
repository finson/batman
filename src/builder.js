// This module provides a parameterized build manager.
//
// This program is strict-mode throughout.
//
// Doug Johnson, June 2016

const EventEmitter = require("events");
const log4js = require("log4js");

const path = require("path");
const thisModule = path.basename(module.filename,".js");
const log = log4js.getLogger(thisModule);
log.setLevel('DEBUG');

let builderSwitches = {
  hardware: '-hardware',
  tools: '-tools',
  libraries: '-built-in-libraries'
};

let itemSwitches = {
  board: '-fqbn',
  libraries: '-libraries'
};

class BldMan extends EventEmitter {

  constructor() {
    super();
  }

/**
 * Given two objects containing various options for the build, this method
 * constructs the OS command to perform the build.
 * @param  {object} action options that define the context for the builder
 * @param  {object} item   options that define the package being built and its target environment
 * @return {string}        the OS command string to run for the build
 */
  buildCommand(action, item) {

    let partA = action.cmd;

    for (let s of ['hardware', 'tools', 'libraries']) {
      let values = (Array.isArray(action[s])) ? action[s] : [action[s]];
      log.debug(`action: ${s} : ${values}`);
      for (let v of values) {
        if (v.length > 0) {
          partA += ' ' + builderSwitches[s] + '=' + v;
        }
      }
    }

    let partB = '';
    for (let s of ['board','libraries']) {
      let values = (Array.isArray(item[s])) ? item[s] : [item[s]];
      log.debug(`item: ${s} : ${values}`);
      for (let v of values) {
        if (v.length > 0) {
          partB += ' ' + itemSwitches[s] + '=' + v;
        }
      }
    }

    partB += ' ' + item.sketch;

    return partA + partB;
  }
}


// let hardwareA = '-hardware=C:/PROGRA~2/Arduino/hardware';
// // let hardwareB = '-hardware=C:/Users/finson/AppData/Local/Arduino15/packages';
// let hardwareB = '';
// let toolsA = '-tools=C:/PROGRA~2/Arduino/hardware/tools/avr';
// let toolsB = '-tools=C:/PROGRA~2/Arduino/tools-builder';
// // let toolsC = '-tools=C:/Users/finson/AppData/Local/Arduino15/packages';
// let toolsC = '';
// let fqbn = '-fqbn=arduino:avr:uno';
// // let builtInLibraries = '-built-in-libraries="C:/Program Files (x86)/Arduino/libraries"';
// let builtInLibraries = '';

// let buildPath = '-build-path=E:/users/finson/repos/batman/bldtgt';
// // let libraries = '-libraries=E:/users/finson/repos/pipe/libraries';
// let libraries = '';
// let options = '-verbose=true';

// let sketch = './bldsrc/Blink/Blink.ino';

// let command = `arduino-builder ${options} ${hardwareA} ${hardwareB} ${toolsA} ${toolsB} ${toolsC} ${builtInLibraries} ${fqbn} ${libraries} ${buildPath} ${sketch}`;

// let child = require('child_process').exec(`${command}`, (error, stdout, stderr)  => {
//    if (error) {
//      console.log(error.stack);
// //     console.log('Error code: '+error.code);
// //     console.log('Signal received: '+error.signal);
//    }
//    console.log('Child Process STDOUT: '+stdout);
//    console.log('Child Process STDERR: '+stderr);
//  });

//  child.on('exit', (code) => {
//    console.log('Child process exited with exit code '+code);
//  });
// }
// }


let buildable = {
  name: 'uno-blinker',
  board: 'arduino:avr:uno',
  sketch: './bldsrc/Blink/Blink.ino',
  libraries: '',
  options: {}
};

let builder = {
  cmd: "arduino-builder",
  hardware: ['C:/PROGRA~2/Arduino/hardware'],
  tools: ['C:/PROGRA~2/Arduino/hardware/tools/avr','C:/PROGRA~2/Arduino/tools-builder'],
  libraries: [],
  options: {}
};

let bat = new BldMan();
let osCmd = bat.buildCommand(builder,buildable);
log.info(osCmd);
