#!/bin/bash
source /etc/profile
source /home/liloli/.bash_profile
set -e



source $HOME/.keychain/${HOSTNAME}-sh

chk=$(command -v git)
len=${#chk}

if [[ $len == 0 ]]
  then 
    echo "$1 is not found. Script ended." ; exit 11
fi




REPO='/home/liloli/linotes'
COMMIT_TIMESTAMP=`date +'%Y-%m-%d %H:%M:%S %Z'`
DATELOG=`date +'%Y.%m.%d.%H.%M.%S'`
LOG="/var/log/git/sync.log"

sudo echo -e "== ${DATELOG} ==============================\n" >> ${LOG}

if [ ! -d ${REPO}/.git ]
  then
    sudo echo "${REPO} is not a valid git repo! Aborting..." >> ${LOG}
    exit 0
  else
    cd ${REPO}
    jekyll build >> ${LOG} 2>&1
    echo -e "\n\n.........................  jekyll buid done  ....... \n\n"
    git  add -A >> ${LOG} 2>&1
    echo -e "..........................    git add done   ....... \n\n"
    sudo git  commit -m "update on ${COMMIT_TIMESTAMP}" >> ${LOG} 2>&1
    echo -e "\n\n.........................  git commit done   .......  ${COMMIT_TIMESTAMP} \n\n"
    sudo git push >> ${LOG} 2>&1
    echo -e "\n\n.........................   git push done  .......\n"
    echo 
    echo
    echo -e "============================== git sync finished =====\n\n\n"
fi
