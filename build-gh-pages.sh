#/bin/bash.sh
rm -rf gh-pages
mkdir gh-pages

cp -R \
index.html \
zbar-main.js \
zbar-processor.js \
icon-128.png \
LICENSE \
cache.manifest \
manifest.webapp \
css \
gh-pages/

cd gh-pages
git init
git checkout -b gh-pages
git add *
git commit -m "created by build-gh-pages.sh"

echo "cd gh-pages; git push -f https://github.com/<username>/zbarjs.git gh-pages"
