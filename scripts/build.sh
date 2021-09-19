#!/bin/bash

rm -rf ./dist

node_modules/.bin/pkg index.js --target arm64 --no-bytecode --public-packages \"*\" --public --output dist/desec-dyndns-client

mkdir dist/config
mkdir dist/systemd

cp config/config.jsonc dist/config/
cp systemd/desec-dyndns-client.service dist/systemd/

echo '#!/bin/bash' >> dist/daemon.sh
echo 'setsid ./desec-dyndns-client >> $PWD/desec-dyndns-client.log 2>&1 < /dev/null &' >> dist/daemon.sh

chmod +x dist/daemon.sh
