// This module operates a parameterized build manager.
//
// This program is strict-mode throughout.
//
// Doug Johnson, June 2016

const Builder = require("./builder");
const log4js = require("log4js");
const path = require("path");
const thisModule = path.basename(module.filename,".js");
const log = log4js.getLogger(thisModule);
log.setLevel('DEBUG');

let builder = {
  cmd: "arduino-builder",
  options: {'debug-level': '5'},
  hardware: ['C:/PROGRA~2/Arduino/hardware','C:/Users/finson/AppData/Local/Arduino15/packages'],
  tools: ['C:/PROGRA~2/Arduino/hardware/tools/avr','C:/PROGRA~2/Arduino/tools-builder',
  'C:/Users/finson/AppData/Local/Arduino15/packages'],
  libraries: [],
  target: 'e:/users/finson/repos/batman/bldtgt'
};

let buildable = {
  name: 'uno-blinker',
  board: 'arduino:avr:uno',
  sketch: './bldsrc/Blink/Blink.ino',
  libraries: '',
  options: {}
};

let bat = new Builder.BldMan();
let osCmd = bat.composeBuilderCommand(builder,buildable);
log.info(osCmd);
bat.executeBuilderCommand(osCmd);
