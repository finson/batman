

let childProcess = require('child_process');

let hardwareA = 'hardware="C:/Program Files (x86)/Arduino/hardware"';
let hardwareB = 'hardware=C:/Users/finson/AppData/Local/Arduino15/packages';
let toolsA = 'tools=C:/PROGRA~2/Arduino/hardware/tools/avr';
let toolsB = 'tools=C:/PROGRA~2/Arduino/tools-builder';
let toolsC = 'tools=C:/Users/finson/AppData/Local/Arduino15/packages';
let fqbn = 'fqbn=arduino:avr:uno';
let builtInLibraries = 'built-in-libraries="C:/Program Files (x86)/Arduino/libraries"';

let buildPath = 'build-path=E:/users/finson/repos/batman/bldtgt';
let libraries = 'libraries=E:/users/finson/repos/pipe/libraries';
let options = 'verbose=true';
let sketch = './bldsrc/Blink/Blink.ino';

let command = `arduino-builder -${options} -${hardwareA} -${hardwareB} -${toolsA} -${toolsB} -${toolsC} -${builtInLibraries} -${fqbn} -${libraries} -${buildPath} ${sketch}`;

let child = childProcess.exec(`${command}`, (error, stdout, stderr)  => {
   if (error) {
     console.log(error.stack);
//     console.log('Error code: '+error.code);
//     console.log('Signal received: '+error.signal);
   }
   console.log('Child Process STDOUT: '+stdout);
   console.log('Child Process STDERR: '+stderr);
 });

 child.on('exit', (code) => {
   console.log('Child process exited with exit code '+code);
 });
