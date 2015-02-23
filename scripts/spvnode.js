'use strict';
var path = require('path');
var BloomFilter = require('bloom-filter');

var spv = require('..');
var Pool = spv.Pool;
var Wallet = spv.Wallet;


var pool = new Pool({ relay: false });
pool.on('chain-progress', function(progress) {
    var height = pool.chain.index.lastHeight;
    var date = new Date();
    console.log(date.toString(),
      'syncProgress:', progress, 'height:', height,
      'estimatedHeight', pool.chain.estimatedBlockHeight());
});
pool.connect();

pool.watch([
  '019f5b01d4195ecbc9398fbf3c3b1fa9bb3183301d7a1fb3bd174fcfa40a2b65'
]);

process.once('SIGINT', finish);

var hasRun = 0;
function finish() {
  if (hasRun)
    return;
  hasRun = 1;

  console.log('Done...');
  var chain = '// Autogenerated by scripts/spvnode.js\n' +
    'module.exports = ' +
    JSON.stringify(pool.chain.toJSON(), null, 2) + '\n';
  var file = path.resolve(__dirname,'..','lib','data','index.js');
  require('fs').writeFileSync(file, chain);
  pool.disconnect();
}
