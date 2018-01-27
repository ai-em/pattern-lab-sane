#!/usr/bin/env bash

export CWD=`pwd`

# create/fix console
cp -r ./core/console ./vendor/bin/pl-console
sed -i .bak 's/$baseDir = __DIR__."\/..\/";/$baseDir = __DIR__."\/..\/..\/";/' ./vendor/bin/pl-console

# create server (routing)
echo "" > ./core/server/index.html

# create config
mkdir -p config
echo "{\"patternengines\":[\"\\\\PatternLab\\\\PatternEngine\\\\Mustache\\\\PatternEngineRule\"]}" > config/patternengines.json
echo "patternExtension: \"mustache\"" >> config/config.yml
echo "styleguideKit: \"pattern-lab/styleguidekit-mustache-default\"" >> config/config.yml
echo "styleguideKitPath: \"vendor/pattern-lab/styleguidekit-mustache-default\"" >> config/config.yml

# install starter kit
php ./vendor/bin/pl-console --starterkit --install pattern-lab/starterkit-mustache-demo

# add custom javascript (to enable plugin)
cat ./vendor/pattern-lab/plugin-reload/dist/js/plugin-reload.js >> ./source/js/custom.js
cat util/jsLoader.js >> source/js/custom.js
cat util/enableReloadPlugin.js >> source/js/custom.js
awk '/<\/body>/{print "  <script type=\"text\/javascript\" src=\"\/js\/custom.js\"></script>"}1' \
    source/_meta/_01-foot.mustache \
    > tmp && mv tmp \
    source/_meta/_01-foot.mustache

# perform first generate
php ./vendor/bin/pl-console --generate

# install assets
cd ./vendor/pattern-lab/styleguidekit-assets-default
npm install
bower install
gulp --copy-dist=.././../../public
cd ${CWD}

# done
echo ""
echo "Run server with \"php ./vendor/bin/pl-console --server\""
echo ""
