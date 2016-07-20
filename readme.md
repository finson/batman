##Batman - A build and test manager for Arduino based applications

This repo contains packages in a future automated test framework for Arduino embedded applications.  The initial target architecture (in June 2016) is applications with a client component (Firmata based) and a host Arduino component (Configurable Firmata with Luni DeviceFeature).

The content of this repo is based on the work of Tomasz Bogdal (initial product) and Dmitry Ananyev (bringing it forward to the 1.5 series Arduino IDE) published in their respective GitHub repos:
  https://github.com/queezythegreat/arduino-cmake.git
  https://github.com/altexdim/arduino-cmake.git

I have made various changes in order to implement a build system suited to
my particular needs, but I could not have gotten anywhere on this idea
without the previous development described above.

Doug Johnson (finson, finson-release) July 2016

----

input: 
The top level sketch directory (eg batcave)
A directory/repo formatted as an arduino library to define the tests (eg LuniTest)
    library.properties, keywords.txt, readme.md
    src/        any shims needed for testing
    examples/   main programs to be built for this test exercise


Each of the subdirectories under examples contains:
    - .ino Arduino main file
    - list of libraries to be installed prior to compile/link (in CMakeLists.txt?)
    - 
