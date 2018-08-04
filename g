#!/bin/bash
# env -i
source /etc/profile
source /home/liloli/.bash_profile
set -e


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
#LOG="/home/liloli/log/${DATELOG}.log"
LOG="/home/liloli/git.log"
#G="/usr/bin/git"
#J="/home/liloli/gems/wrappers/jekyll"

echo -e "== ${DATELOG} ==============================\n" >> ${LOG}

if [ ! -d ${REPO}/.git ]
  then
    echo "${REPO} is not a valid git repo! Aborting..." >> ${LOG}
    exit 0
  else
    cd ${REPO}
    jekyll build >> ${LOG} 2>&1
    echo -e "\n\n.........................  jekyll buid done  ....... \n\n"
    git  add -A >> ${LOG} 2>&1
    echo -e "..........................    git add done   ....... \n\n"
    git  commit -m "update on ${COMMIT_TIMESTAMP}" >> ${LOG} 2>&1
    echo -e "\n\n.........................  git commit done   .......  ${COMMIT_TIMESTAMP} \n\n"
    git push >> ${LOG} 2>&1
    echo -e "\n\n.........................   git push done  .......\n"
    echo 
    echo
    echo -e "============================== git sync finished =====\n\n\n"
fi
