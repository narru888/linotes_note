#!/bin/bash  
python tag_generator.py
wait
git add .  
git commit -m "update"
git push