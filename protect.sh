#!/bin/bash

set -e

echo "Please enter password to encrypt private pages:" ; \
read password; \
rm -rf protected/*; \
for i in private/*.html; \
do ./node_modules/.bin/staticrypt "$i" "$password" -f _includes/password_template.html -o "./protected/$(basename $i)"; \
done \