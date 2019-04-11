#!/bin/bash

verbose=$1
exec 3>&1 4>&2 #save original stdout and stderr in case of redirection
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

tmpfile=$(mktemp)
source $DIR/util.sh

function deployToScratchOrg {
    invokeCmd "sfdx force:org:delete -p -u alertme --json 2>&1" "skiperror"
    set -o pipefail
    set -e
    invokeCmd "sfdx force:org:create -s -f config/project-scratch-def.json -a alertme --json 2>&1"
    invokeCmd "sfdx force:source:push --json 2>&1 | jq ."
    invokeCmd "sfdx force:user:permset:assign -n dreamhouse --json 2>&1 | jq ."
    invokeCmd "sfdx force:data:tree:import -p data/sample-data.json --json 2>&1 | jq ."
    exec 1>&3 2>&4 # reset stderr and stdout
    orgurl=$(sfdx force:org:open -r --json | jq .result.url -r)
    sfdx alerter:twilio:sendalert -m 'Dreamhouse app finished installing in scratch org '$orgurl -p 6507430794
    sfdx alerter:slack:sendalert -m 'Dreamhouse app finished install in scratch org :smile: <'$orgurl'|Scratch Org>' -c '#random' -e ':lol:'
    $(sfdx force:apex:test:run -w 10 --json > $tmpfile)
    testurl=$(sfdx force:org:open -r -p lightning/setup/ApexTestHistory/home --json | jq .result.url -r)
    sfdx alerter:slack:sendalert -m ':thumbsup: Tests have completed with no failures. <'$testurl'|Test Results>' -c '#random' -e ':thumbsup:'
    return 0
}

trap exitHandler INT TERM EXIT
  deployToScratchOrg 
trap - INT TERM EXIT