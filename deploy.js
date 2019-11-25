const fs = require('fs');
const path = require('path');
console.log('deploy.js files ' + new Date().toString());
let new_files = [];
let new_files_yandex = [];
const remote_path = '/home/aehafgdz/public_html/smartoboto/';
let remote_path_yandex = '/var/www/test/';

const argv = process.argv.slice(2);
const PROD_BUILD = argv.indexOf('--prod') !== -1;
const passphrase = argv.find(item => item.startsWith('--passphrase'));
const passphraseValue = passphrase && passphrase.split('=')[1].trim();
console.log(passphraseValue, 'passphraseValue');
console.log(passphrase, 'passphrase');
if (PROD_BUILD) 
	remote_path_yandex = '/var/www/html/';

fs.copyFileSync(path.join('build', 'index.html'), path.join('build', 'lk.html'));

// Get hashes from asset-manifest.json
const hashes = JSON.parse(fs.readFileSync(path.join('build', 'asset-manifest.json'), 'utf8'));
for (let dest_file in hashes) {
  let src = path.join('build', hashes[dest_file].substring(2));
  let this_is_map = src.split('.').pop() === 'map';
  let from = src.replace(new RegExp('/', 'g'), path.sep);
  let to =  remote_path + hashes[dest_file].substring(2);
  const skipThisFile = (this_is_map && PROD_BUILD);
  if (src.indexOf('static'+path.sep) > -1 && !skipThisFile)
  {
	new_files.push({ from, to });
	new_files_yandex.push({ from, to:  remote_path_yandex + hashes[dest_file].substring(2)});
  }
}
new_files.push({
		from: path.join('build', 'index.html'),
		to: remote_path + 'index.html',
	});
	
new_files_yandex.push({
		from: path.join('build', 'lk.html'),
		to: remote_path_yandex + 'lk.html',
	});
	

let Client = require('ssh2-sftp-client');


// let sftp = new Client();
// sftp.connect({
//   host: 'smartoboto.com',
//   port: 22,
//   username: '',
//   password: ''
// }).then(() => {
// 	let promises = [];
// 	new_files.forEach(pair => {
// 		promises.push(sftp.put(pair.from, pair.to));
// 	});
//     return Promise.all(promises);
// }).then((data) => {
//     console.log(data, 'the data info');
// 	sftp.end();
// }).catch((err) => {
//     console.log(err, 'catch error smartoboto.com');
// 	sftp.end();
// });

let sftp_yandex = new Client();
sftp_yandex.connect({
  host: '84.201.144.64',
  port: 22,
  username: 'aehafgdz',
  privateKey: fs.readFileSync('private_aehafgdz2.ppk'), // Buffer or string that contains
  passphrase: 'kokote', // string - For an encrypted private key
}).then(() => {
	let promises = [];
	new_files_yandex.forEach(pair => {
		promises.push(sftp_yandex.put(pair.from, pair.to));
	});
    return Promise.all(promises);
}).then((data) => {
    console.log(data, 'the data info');
	sftp_yandex.end();
}).catch((err) => {
    console.log(err, 'catch error 84.201.144.64');
	sftp_yandex.end();
});