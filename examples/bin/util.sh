#!/bin/bash

invokeCmd() {
  echo "CMD: $1"
  eval $1 > $tmpfile
  exec 1>&3 2>&4 # reset stderr and stdout
  status=$(cat $tmpfile | jq .status -r)
  if [ "$status" == "1" ] && [ "$2" != "skiperror" ]; then
    #tmpfile=mktemp
    #cat outcome > $tmpfile
    sfdx alerter:slack:uploadfile -f $tmpfile -c '#random' -t 'Build Errors' -n 'Errors.json'
  elif [ "$status" == "0" ]; then
    #cat outcome
    if [ "$verbose" == "-v" ]; then
        cat $tmpfile
    fi
  fi
}

function exitHandler {
    exec 1>&3 2>&4 #reset any redirect that happened above
    echo "In exitHandler"
    #status=$(cat outcome | jq .status -r)
    status=$(cat $tmpfile + jq .status -r)
    if [ "$status" == "1" ]; then
        #tmpfile=mktemp
        #echo $tmpfile
        #cat outcome > $tmpfile
        echo "Errors encounted and posted to slack"
        cat $tmpfile
        sfdx alerter:slack:uploadfile -f $tmpfile -c '#random' -t 'Build Errors' -n 'Errors.json'
    elif [ "$status" == "100" ]; then
        testoutcome=$(cat $tmpfile | jq .result.summary.outcome -r)
        testurl=$(sfdx force:org:open -r -p lightning/setup/ApexTestHistory/home --json | jq .result.url -r)
        #tmpfile=mktemp
        #cat outcome > $tmpfile
        sfdx alerter:slack:sendalert -m ':thumbsdown: <@here> Tests have completed, with a failure. <'$testurl'|Test Results>' -c '#random' -e ':thumbsdown:'
        sfdx alerter:slack:uploadfile -f $tmpfile -c '#random' -t 'Build Errors' -n 'Errors.json'
    else
        #cat outcome
        cat $tmpfile
    fi
    exit
}