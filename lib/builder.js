// This module provides a parameterized build manager.
//
// This program is strict-mode throughout.
//
// Doug Johnson, June 2016

const log4js = require("log4js");
const path = require("path");
const thisModule = path.basename(module.filename,".js");
const log = log4js.getLogger(thisModule);
log.setLevel('DEBUG');

const HTTP = require('http');
const EventEmitter = require("events");
const process = require('process');
const processManager = require('child_process');

let registry = new Map();

let getActionSwitches = {
  out: '-o'
};

let getItemSwitches = {

};

let bldActionSwitches = {
  hardware: '-hardware',
  tools: '-tools',
  libraries: '-built-in-libraries',
  target: '-build-path'
};

let bldItemSwitches = {
  board: '-fqbn',
  libraries: '-libraries'
};

class BldMan extends EventEmitter {

  constructor() {
    super();
  }

/**
 * Given two objects containing various options describing what to get and how
 * to get it, this method creates an array of commands to accomplish the get.
 * @param  {object} action options that define the context for the getter
 * @param  {object} item   options that define the packages to be copied
 * @return {string}        the array of OS command strings to run for the getting
 */
  composeGetCommand(action,item) {

    let partA = action.cmd;

    // Simple options are copied directly to the command as switches

    if (typeof action.options === "object") {
      for (let opt of Object.keys(action.options)) {
        partA += ' -' + opt;
        let value = action.options[opt];
        if (typeof value === 'string' && value.length > 0) {
          partA += '=' + value;
        }
      }
    }

    // Action keys are translated to switches and added to the command

    for (let s of []) {
      let values = (Array.isArray(action[s])) ? action[s] : [action[s]];
      log.debug(`action: ${s} : ${values}`);
      for (let v of values) {
        if (v.length > 0) {
          partA += ' ' + getActionSwitches[s] + ' ' + v;
        }
      }
    }

    // Item keys are translated to switches and added to the command.

    let partB = '';
    for (let s of []) {
      let values = (Array.isArray(item[s])) ? item[s] : [item[s]];
      log.debug(`item: ${s} : ${values}`);
      for (let v of values) {
        if (v.length > 0) {
          partB += ' ' + getItemSwitches[s] + '=' + v;
        }
      }
    }

    // The url to download is composed and added to the end of the command
    // without a switch.


    let result = [];
    for (let r of item.repos) {
      let partC = ' '+ item.repoRoot + '/' + action.user + '/' + r.name + '/zipball/master';
      let partD = ' > ' +  action.out + '/' + r.name + '.zip';
      result.push(partA+partB+partC+partD);

      let unzip = 'c:/PROGRA~1/7-zip/7z';
      unzip += ' -y -o' + action.out;
      unzip += ' x ' + action.out + '/' + r.name + '.zip';
      result.push(unzip);

      let erase = 'rm ' + action.out + '/' + r.name + '.zip';
      result.push(erase);
    }
    return result;
  }


/**
 * Given two objects containing various options for the build, this method
 * constructs the OS command to perform the build.
 * @param  {object} action options that define the context for the builder
 * @param  {object} item   options that define the package being built and its target environment
 * @return {string}        the OS command string to run for the build
 */
  composeBuildCommand(action, item) {

    let partA = action.cmd;
    if (typeof action.options === "object") {
      for (let opt of Object.keys(action.options)) {
        partA += ' -' + opt;
        let value = action.options[opt];
        if (typeof value === 'string' && value.length > 0) {
          partA += '=' + value;
        }
      }
    }

    for (let s of ['hardware', 'tools', 'libraries', 'target']) {
      let values = (Array.isArray(action[s])) ? action[s] : [action[s]];
      log.debug(`action: ${s} : ${values}`);
      for (let v of values) {
        if (v.length > 0) {
          partA += ' ' + bldActionSwitches[s] + '=' + v;
        }
      }
    }

    let partB = '';
    for (let s of ['board','libraries']) {
      let values = (Array.isArray(item[s])) ? item[s] : [item[s]];
      log.debug(`item: ${s} : ${values}`);
      for (let v of values) {
        if (v.length > 0) {
          partB += ' ' + bldItemSwitches[s] + '=' + v;
        }
      }
    }
    partB += ' ' + item.sketch;
    return partA + partB;
  }

  buildRegistry(sourceLocations) {
    let groups = (Array.isArray(sourceLocations)) ? sourceLocations : [sourceLocations];
    for (let group of groups) {
      if (typeof group === "object") {
        if (group.hasOwnProperty("url")) {
          let url = group.url;
          if (group.hasOwnProperty("repos")) {
            let repos = (Array.isArray(group.repos)) ? group.repos : [group.repos];
            for (let repo of repos) {
              let getterURL = url.replace('\$\{repo\}',repo);
              log.debug(`${repo} => ${getterURL}`);
              registry.set(repo,getterURL);
            }
          }
        }
      }
    }
  }


executeOSCommand(cmd) {
  let child = processManager.exec(`${cmd}`, (error, stdout, stderr)  => {
     if (error) {
       this.emit("error",error);
     }
   });

  child.on('exit', (code) => {
      this.emit("childExit",{status: code});
    });
  }
}

module.exports.BldMan = BldMan;
