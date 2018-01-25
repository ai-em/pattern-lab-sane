#!/usr/bin/env bash

# create/fix console
cp -r ./vendor/pattern-lab/edition-thin/core/console ./vendor/bin/pl-console
sed -i .bak 's/$baseDir = __DIR__."\/..\/";/$baseDir = __DIR__."\/..\/..\/";/' ./vendor/bin/pl-console

# create server (routing)
mkdir -p core
cp -r ./vendor/pattern-lab/edition-thin/core/server ./core/
echo "" > ./core/server/index.html


# create config
mkdir -p config
echo "{\"patternengines\":[\"\\\\PatternLab\\\\PatternEngine\\\\Mustache\\\\PatternEngineRule\"]}" > config/patternengines.json
echo "patternExtension: \"mustache\"" >> config/config.yml
echo "styleguideKit: \"pattern-lab/styleguidekit-mustache-default\"" >> config/config.yml
echo "styleguideKitPath: \"vendor/pattern-lab/styleguidekit-mustache-default\"" >> config/config.yml

# install starter kit
php ./vendor/bin/pl-console --starterkit --install pattern-lab/starterkit-mustache-materialdesign

# perform first generate
php ./vendor/bin/pl-console --generate

# done
echo ""
echo "Run server with \"php ./vendor/bin/pl-console --server\""
echo ""
