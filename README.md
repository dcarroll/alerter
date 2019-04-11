alerter
=======

Send twilio sms messages from command line

[![Version](https://img.shields.io/npm/v/alerter.svg)](https://npmjs.org/package/alerter)
[![CircleCI](https://circleci.com/gh/dcarroll/alerter/tree/master.svg?style=shield)](https://circleci.com/gh/dcarroll/alerter/tree/master)
[![Appveyor CI](https://ci.appveyor.com/api/projects/status/github/dcarroll/alerter?branch=master&svg=true)](https://ci.appveyor.com/project/heroku/alerter/branch/master)
[![Greenkeeper](https://badges.greenkeeper.io/dcarroll/alerter.svg)](https://greenkeeper.io/)
[![Known Vulnerabilities](https://snyk.io/test/github/dcarroll/alerter/badge.svg)](https://snyk.io/test/github/dcarroll/alerter)
[![Downloads/week](https://img.shields.io/npm/dw/alerter.svg)](https://npmjs.org/package/alerter)
[![License](https://img.shields.io/npm/l/alerter.svg)](https://github.com/dcarroll/alerter/blob/master/package.json)

<!-- toc -->
* [Debugging your plugin](#debugging-your-plugin)
<!-- tocstop -->
<!-- install -->
<!-- usage -->
```sh-session
$ npm install -g alerter
$ sfdx COMMAND
running command...
$ sfdx (-v|--version|version)
alerter/1.0.0 darwin-x64 node-v10.15.1
$ sfdx --help [COMMAND]
USAGE
  $ sfdx COMMAND
...
```
<!-- usagestop -->
<!-- commands -->
* [`sfdx alerter:config -t <string> -a <string> -v <string> -n <string> [--json] [--loglevel trace|debug|info|warn|error|fatal]`](#sfdx-alerterconfig--t-string--a-string--v-string--n-string---json---loglevel-tracedebuginfowarnerrorfatal)
* [`sfdx alerter:sendalert -m <string> -p <string> [--json] [--loglevel trace|debug|info|warn|error|fatal]`](#sfdx-alertersendalert--m-string--p-string---json---loglevel-tracedebuginfowarnerrorfatal)

## `sfdx alerter:config -t <string> -a <string> -v <string> -n <string> [--json] [--loglevel trace|debug|info|warn|error|fatal]`

configure the twilio authentication and origination information

```
USAGE
  $ sfdx alerter:config -t <string> -a <string> -v <string> -n <string> [--json] [--loglevel 
  trace|debug|info|warn|error|fatal]

OPTIONS
  -a, --accountsid=accountsid                            (required) twilio account sid
  -n, --twilionumber=twilionumber                        (required) valid twilio phone number
  -t, --authtoken=authtoken                              (required) twilio authorization token
  -v, --verificationphonenumber=verificationphonenumber  (required) phone number to send verification message to
  --json                                                 format output as json
  --loglevel=(trace|debug|info|warn|error|fatal)         [default: warn] logging level for this command invocation

EXAMPLE
  $ sfdx alerter:config --authtoken feae4a --accountsid 80b18 --verificationphonenumber 1232314321
     Message successfully sent, configuration confirmed 
     Message Id: SM170bf514384c4428bd293198b5558017
```

_See code: [src/commands/alerter/config.ts](https://github.com/dcarroll/alerter/blob/v1.0.0/src/commands/alerter/config.ts)_

## `sfdx alerter:sendalert -m <string> -p <string> [--json] [--loglevel trace|debug|info|warn|error|fatal]`

sends specified message to the specified phone number

```
USAGE
  $ sfdx alerter:sendalert -m <string> -p <string> [--json] [--loglevel trace|debug|info|warn|error|fatal]

OPTIONS
  -m, --message=message                           (required) the message to send
  -p, --phone=phone                               (required) the phone to send the message to
  --json                                          format output as json
  --loglevel=(trace|debug|info|warn|error|fatal)  [default: warn] logging level for this command invocation

EXAMPLE
  $ sfdx alerter:sendalert --message 'Hey, you package is created' --phone 1234567890
     Ok, saved the auth token and the account sid, you should have received a message to verify it's working
```

_See code: [src/commands/alerter/sendalert.ts](https://github.com/dcarroll/alerter/blob/v1.0.0/src/commands/alerter/sendalert.ts)_
<!-- commandsstop -->
<!-- debugging-your-plugin -->
# Debugging your plugin
We recommend using the Visual Studio Code (VS Code) IDE for your plugin development. Included in the `.vscode` directory of this plugin is a `launch.json` config file, which allows you to attach a debugger to the node process when running your commands.

To debug the `hello:org` command: 
1. Start the inspector
  
If you linked your plugin to the sfdx cli, call your command with the `dev-suspend` switch: 
```sh-session
$ sfdx hello:org -u myOrg@example.com --dev-suspend
```
  
Alternatively, to call your command using the `bin/run` script, set the `NODE_OPTIONS` environment variable to `--inspect-brk` when starting the debugger:
```sh-session
$ NODE_OPTIONS=--inspect-brk bin/run hello:org -u myOrg@example.com
```

2. Set some breakpoints in your command code
3. Click on the Debug icon in the Activity Bar on the side of VS Code to open up the Debug view.
4. In the upper left hand corner of VS Code, verify that the "Attach to Remote" launch configuration has been chosen.
5. Hit the green play button to the left of the "Attach to Remote" launch configuration window. The debugger should now be suspended on the first line of the program. 
6. Hit the green play button at the top middle of VS Code (this play button will be to the right of the play button that you clicked in step #5).
<br><img src=".images/vscodeScreenshot.png" width="480" height="278"><br>
Congrats, you are debugging!
