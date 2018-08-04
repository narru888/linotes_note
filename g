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
G="/usr/bin/git"
J="/home/liloli/gems/wrappers/jekyll"

echo -e "--------------------${DATELOG}-----------------------\n" >> ${LOG}

if [ ! -d ${REPO}/.git ]
  then
    echo "${REPO} is not a valid git repo! Aborting..." >> ${LOG}
    exit 0
  else
    cd ${REPO}
    echo -e "starting git process ...... \n \n"
    ${J} build >> ${LOG} 2>&1
    echo -e "jekyll buid done.\n" | tee -a ${LOG}
    ${G}  add -A >> ${LOG} 2>&1
    echo -e "git add done.\n"
    ${G}  commit -m "update on ${COMMIT_TIMESTAMP}" >> ${LOG} 2>&1
    echo -e  "git commit done. ${COMMIT_TIMESTAMP} \n"
    ${G} push >> ${LOG} 2>&1
    echo -e "\n\n git push done."
    echo 
    echo
    echo ".........................git sync finished....................."
fi
