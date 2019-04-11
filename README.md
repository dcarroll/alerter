alerter
=======

Send Twilio SMS messages or post chats to Slack from the command line.

[![Version](https://img.shields.io/npm/v/alerter.svg)](https://npmjs.org/package/alerter)
[![CircleCI](https://circleci.com/gh/dcarroll/alerter/tree/master.svg?style=shield)](https://circleci.com/gh/dcarroll/alerter/tree/master)
[![Appveyor CI](https://ci.appveyor.com/api/projects/status/github/dcarroll/alerter?branch=master&svg=true)](https://ci.appveyor.com/project/heroku/alerter/branch/master)
[![Greenkeeper](https://badges.greenkeeper.io/dcarroll/alerter.svg)](https://greenkeeper.io/)
[![Known Vulnerabilities](https://snyk.io/test/github/dcarroll/alerter/badge.svg)](https://snyk.io/test/github/dcarroll/alerter)
[![Downloads/week](https://img.shields.io/npm/dw/alerter.svg)](https://npmjs.org/package/alerter)
[![License](https://img.shields.io/npm/l/alerter.svg)](https://github.com/dcarroll/alerter/blob/master/package.json)

There are two methods available for sending alerts. Either with Twilio or with Slack. In either case, there is some setup work on both of those services that need to be done.  
* Twilio - You will need a valid Twilio account and phone number. Creaate a Twilio app to obtain an Auth Token, Account SID and Twilio phone number
* Slack - You will need to create a Slack token which also involves, creating a Slack Web API app and setting scopes to obtain the token.
  
  **Scopes**
    * *Conversations*
      * Access user’s public channels (channels:history)
      * Access information about user’s public channels (channels:read)
      * Send messages as sfdxplugin (chat:write:bot)
    * *Emojis*
      * Access the workspace’s emoji (emoji:read)
    * *Files*
      * Upload and modify files as user (files:write:user)
    * *Unfurls
      * Add link previews to messages (links:write)

There is also a sample set of bash scripts that represent a possible way to use this plugin to receive notifications during the process of creating and populating a Scratch Org and handling the result of running Apex tests in the Scratch Org.

_See code [examples/bin/setup.sh](https://github.com/dcarroll/alerter/blob/master/examples/bin/setup.sh) and [examples/bin/util.sh](https://github.com/dcarroll/alerter/blob/master/examples/bin/util.sh)_

<!-- toc -->
### [Debugging your plugin](#debugging-your-plugin)
<!-- tocstop -->
<!-- install -->
<!-- noreplace -->
**This has not yet been published to npm, please clone, build and then link to the Salesforce CLI**
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
* [`sfdx alerter:slack:channels [--json] [--loglevel trace|debug|info|warn|error|fatal]`](#sfdx-alerterslackchannels---json---loglevel-tracedebuginfowarnerrorfatal)
* [`sfdx alerter:slack:config -t <string> [-c <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal]`](#sfdx-alerterslackconfig--t-string--c-string---json---loglevel-tracedebuginfowarnerrorfatal)
* [`sfdx alerter:slack:sendalert -m <string> [-c <string>] [-e <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal]`](#sfdx-alerterslacksendalert--m-string--c-string--e-string---json---loglevel-tracedebuginfowarnerrorfatal)
* [`sfdx alerter:slack:uploadfile -f <string> -c <string> [-n <string>] [-i <string>] [-t <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal]`](#sfdx-alerterslackuploadfile--f-string--c-string--n-string--i-string--t-string---json---loglevel-tracedebuginfowarnerrorfatal)
* [`sfdx alerter:twilio:config -t <string> -a <string> -v <string> -n <string> [--json] [--loglevel trace|debug|info|warn|error|fatal]`](#sfdx-alertertwilioconfig--t-string--a-string--v-string--n-string---json---loglevel-tracedebuginfowarnerrorfatal)
* [`sfdx alerter:twilio:sendalert -m <string> -p <string> [--json] [--loglevel trace|debug|info|warn|error|fatal]`](#sfdx-alertertwiliosendalert--m-string--p-string---json---loglevel-tracedebuginfowarnerrorfatal)

## `sfdx alerter:slack:channels [--json] [--loglevel trace|debug|info|warn|error|fatal]`

list the channels in the workspace

```
USAGE
  $ sfdx alerter:slack:channels [--json] [--loglevel trace|debug|info|warn|error|fatal]

OPTIONS
  --json                                          format output as json
  --loglevel=(trace|debug|info|warn|error|fatal)  [default: warn] logging level for this command invocation

EXAMPLE
  $ sfdx alerter:slack:channels

  Name     ID         Purpose
  ───────  ─────────  ────────────────────────────────────────────────────
  general  C0SA487L4  This channel is for team-wide communication and a...
  random   C0SA487PE  A place for non-work-related flimflam, faffing, h...
```

_See code: [src/commands/alerter/slack/channels.ts](https://github.com/dcarroll/alerter/blob/v1.0.0/src/commands/alerter/slack/channels.ts)_

## `sfdx alerter:slack:config -t <string> [-c <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal]`

configure the slack authentication and hook url

```
USAGE
  $ sfdx alerter:slack:config -t <string> [-c <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal]

OPTIONS
  -c, --slackchannel=slackchannel                 slack channel to post verification message to, defaults to Slackbot
  -t, --slacktoken=slacktoken                     (required) slack Oauth 2.0 token (from slack app web interface)
  --json                                          format output as json
  --loglevel=(trace|debug|info|warn|error|fatal)  [default: warn] logging level for this command invocation

EXAMPLE
  $ sfdx alerter:slack:config --slacktoken xxxxxxx --slackchannel '#CoolKids'
     Successfully configured alerter! Congratulations!
```

_See code: [src/commands/alerter/slack/config.ts](https://github.com/dcarroll/alerter/blob/v1.0.0/src/commands/alerter/slack/config.ts)_

## `sfdx alerter:slack:sendalert -m <string> [-c <string>] [-e <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal]`

sends specified message to the specified slack channel

```
USAGE
  $ sfdx alerter:slack:sendalert -m <string> [-c <string>] [-e <string>] [--json] [--loglevel 
  trace|debug|info|warn|error|fatal]

OPTIONS
  -c, --channel=channel                           the channel to post the message to
  -e, --emoji=emoji                               an emoji to add like ':thumbsup:'
  -m, --message=message                           (required) the message to post
  --json                                          format output as json
  --loglevel=(trace|debug|info|warn|error|fatal)  [default: warn] logging level for this command invocation

EXAMPLE
  $ sfdx alerter:slack:sendalert --message 'Hey, you package is created'
     Ok, message posted.
```

_See code: [src/commands/alerter/slack/sendalert.ts](https://github.com/dcarroll/alerter/blob/v1.0.0/src/commands/alerter/slack/sendalert.ts)_

## `sfdx alerter:slack:uploadfile -f <string> -c <string> [-n <string>] [-i <string>] [-t <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal]`

sends specified file to slack channel

```
USAGE
  $ sfdx alerter:slack:uploadfile -f <string> -c <string> [-n <string>] [-i <string>] [-t <string>] [--json] [--loglevel 
  trace|debug|info|warn|error|fatal]

OPTIONS
  -c, --channel=channel                           (required) the channel to post the file to
  -f, --filepath=filepath                         (required) the path to the file to be posted
  -i, --initialcomment=initialcomment             an initial comment to include with the file
  -n, --filename=filename                         the name of the file to be posted
  -t, --title=title                               a title to give to the file post
  --json                                          format output as json
  --loglevel=(trace|debug|info|warn|error|fatal)  [default: warn] logging level for this command invocation

EXAMPLE
  $ sfdx alerter:slack:fileupload --filepath /tmp/filetoload.json --initialcomment 'Check out this file' --title 'Error 
  Text' --channel '#general'
     Ok, file posted.
```

_See code: [src/commands/alerter/slack/uploadfile.ts](https://github.com/dcarroll/alerter/blob/v1.0.0/src/commands/alerter/slack/uploadfile.ts)_

## `sfdx alerter:twilio:config -t <string> -a <string> -v <string> -n <string> [--json] [--loglevel trace|debug|info|warn|error|fatal]`

configure the twilio authentication and origination information

```
USAGE
  $ sfdx alerter:twilio:config -t <string> -a <string> -v <string> -n <string> [--json] [--loglevel 
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

_See code: [src/commands/alerter/twilio/config.ts](https://github.com/dcarroll/alerter/blob/v1.0.0/src/commands/alerter/twilio/config.ts)_

## `sfdx alerter:twilio:sendalert -m <string> -p <string> [--json] [--loglevel trace|debug|info|warn|error|fatal]`

sends specified message to the specified phone number

```
USAGE
  $ sfdx alerter:twilio:sendalert -m <string> -p <string> [--json] [--loglevel trace|debug|info|warn|error|fatal]

OPTIONS
  -m, --message=message                           (required) the message to send
  -p, --phone=phone                               (required) the phone to send the message to
  --json                                          format output as json
  --loglevel=(trace|debug|info|warn|error|fatal)  [default: warn] logging level for this command invocation

EXAMPLE
  $ sfdx alerter:sendalert --message 'Hey, you package is created' --phone 1234567890
     Message sent!
```

_See code: [src/commands/alerter/twilio/sendalert.ts](https://github.com/dcarroll/alerter/blob/v1.0.0/src/commands/alerter/twilio/sendalert.ts)_
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
