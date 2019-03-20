#!/bin/bash

set -e

rm -rf protected/*; 
./node_modules/.bin/gulp protect;

echo "Please enter password to encrypt private pages:" ; 
read password; 
for i in protected/*.html; 
do ./node_modules/.bin/staticrypt "$i" "$password" -f _includes/password_template.html -o "./protected/$(basename $i)"; 
done 

./node_modules/.bin/gulp build;
jekyll build --config _config.yml;