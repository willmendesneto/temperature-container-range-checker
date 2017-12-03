# Temperature Range Checker

> A Nodebots app to check the temperature of a container using NodeJS Johnny-five

[![Build Status](https://travis-ci.org/willmendesneto/temperature-container-range-checker.png?branch=master)](https://travis-ci.org/willmendesneto/temperature-container-range-checker)
[![Build Windows Status](https://ci.appveyor.com/api/projects/status/github/willmendesneto/temperature-container-range-checker?svg=true)](https://ci.appveyor.com/project/willmendesneto/temperature-container-range-checker/branch/master)
[![Coverage Status](https://coveralls.io/repos/willmendesneto/temperature-container-range-checker/badge.svg?branch=master)](https://coveralls.io/r/willmendesneto/temperature-container-range-checker?branch=master)


## INTRODUCTION

Application using Arduino + Johnny Five + NodeJS for to check if a container is in a allowed temperature range, starting a Piezo alarm message if it doesn't.


## First steps

- [Install Arduino](https://www.arduino.cc/en/Main/Software)
- [Install NodeJS](https://nodejs.org/en/download/)
- [Setup your board](http://johnny-five.io/platform-support/)
- (Optional) Install Johnny-Five Package using ```npm install johnny-five <--global|--save>```


## Usage

```bash
$ git clone <project> && cd $_
$ npm install
$ node index.js # or npm start
```

You will need of:
- 1 Arduino with 2 GND inputs and 2 ports (in this case we are using A0 port + GND port for Termometer sensor and 3 port + GND port for piezo sensor);
- NodeJS;


## Author

**Wilson Mendes (willmendesneto)**
+ <https://plus.google.com/+WilsonMendes>
+ <https://twitter.com/willmendesneto>
+ <http://github.com/willmendesneto>
