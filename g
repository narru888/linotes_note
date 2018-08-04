#!/bin/bash
# env -i
# set -e

# check if git is available
chk=$(command -v git)
len=${#chk}

if [[ $len == 0 ]]
  then 
    echo "$1 is not found. Script ended." ; exit 11
fi




REPO='/home/liloli/linotes'
COMMIT_TIMESTAMP=`date +'%Y-%m-%d %H:%M:%S %Z'`
DATELOG=`date +'%Y.%m.%d.%H.%M.%S'`
LOG="/home/liloli/log/${DATELOG}.log"
GIT=`command -v git`
J=`command -v jekyll`


if [ ! -d ${REPO}/.git ]
  then
    echo "${REPO} is not a valid git repo! Aborting..." >> ${LOG}
    exit 0
  else
    echo "${REPO} is a valid git repo! Proceeding..." >> ${LOG}
    cd ${REPO}
    echo 'starting git process ......'
    echo "jekyll is ${J}"
    ${J} build >> ${LOG}
    echo 'jekyll buid done.'
    ${GIT} --git-dir=.git add -A >> ${LOG}
    echo 'git add done.'
    ${GIT} --git-dir=.git commit -m "update on ${COMMIT_TIMESTAMP}" >> ${LOG}
    echo "git commit done. ${COMMIT_TIMESTAMP}"
    ${GIT} --git-dir=.git push >> ${LOG}
fi
