// This module operates a parameterized build manager.
//
// This program is strict-mode throughout.
//
// Doug Johnson, June 2016

const log4js = require("log4js");
const path = require("path");
const thisModule = path.basename(module.filename,".js");
const log = log4js.getLogger(thisModule);
log.setLevel('DEBUG');

const Sequencer = require("lib/Sequencer").Sequencer;
const Builder = require("./builder");

let getAction = {
  cmd: 'c:/apps/curl-7.49.1/bin/curl',
  user: 'finson',
  out: './bldsrc/libraries',
  options: {L:''}
};

let getItem = {
  repoRoot: 'https://api.github.com/repos',
  repos: [
  {name:'Luni', branch: 'v0.10.0', release: 'latest'},
  {name: 'FirmataWithDeviceFeature', branch: 'v0.10.0', release: 'latest'}
  ]
};

let bldAction = {
  cmd: "arduino-builder",
  options: {'debug-level': '5'},
  hardware: ['C:/PROGRA~2/Arduino/hardware','C:/Users/finson/AppData/Local/Arduino15/packages'],
  tools: ['C:/PROGRA~2/Arduino/hardware/tools/avr','C:/PROGRA~2/Arduino/tools-builder',
  'C:/Users/finson/AppData/Local/Arduino15/packages'],
  libraries: [],
  target: 'e:/users/finson/repos/batman/bldtgt'
};

let bldItem = {
  name: 'uno-blinker',
  board: 'arduino:avr:uno',
  sketch: './bldsrc/Blink/Blink.ino',
  libraries: '',
  options: {}
};

let bat = new Builder.BldMan();

let seq = new Sequencer(bat,["exit"]);
log.trace(`Sequencer is created.`);

seq.on("error", (apiError) => {
  log.error(`Error: ${apiError}`);
});

seq.on("done", (apiResult) => {
  log.info(`Steps completed.`);
});

function makeStepFunction(c) {
  return function(apiResult) {
    log.debug(`step result: ${apiResult.status}`);
    log.debug(`next step: ${c}`);
    bat.executeOSCommand(c);
  };
}

let osCmd = bat.composeGetCommand(getAction,getItem);
let step = [];
for (let c of osCmd) {
  log.trace(c);
  step.push(makeStepFunction(c));
}

seq.start(step);


// osCmd = bat.composeBuildCommand(bldAction,bldItem);
// log.info(osCmd);
// bat.executeOSCommand(osCmd);
