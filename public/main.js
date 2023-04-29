const Buffer = require('buffer/').Buffer
const sigUtil = require('eth-sig-util')

const encryptInput = document.getElementById('encryptInput')
const encryptButton = document.getElementById('encryptButton')
const encryptedMessage = document.getElementById('encryptedMessage')

const decryptInput = document.getElementById('decryptInput')
const decryptButton = document.getElementById('decryptButton')
const decryptedMessage = document.getElementById('decryptedMessage')

async function getPublicKey () {
  const provider = window.ethereum;
  const accounts = await provider.enable();
  return await provider.request({
    method: 'eth_getEncryptionPublicKey',
    params: [accounts[0]]
  });
}

async function encrypt (msg) {
  const encryptionPublicKey = await getPublicKey();
  const buf = Buffer.from(
    JSON.stringify(
      sigUtil.encrypt(
        encryptionPublicKey,
        { data: msg },
        'x25519-xsalsa20-poly1305'
      )
    ),
    'utf8'
  );

  return '0x' + buf.toString('hex');
}

async function encryptHandler () {
  try {
    encryptedMessage.innerText = '';
    const msg = encryptInput.value;
    encryptedMessage.innerText = await encrypt(msg);
  } catch (err) {
    alert(err.message)
    console.error(err);
  }
}

async function decrypt (encMsg) {
  const provider = window.ethereum;
  const accounts = await provider.enable();
  return await provider.request({
    method: 'eth_decrypt',
    params: [encMsg, accounts[0]]
  });
}

async function decryptHandler () {
  try {
    decryptedMessage.innerText = '';
    const msg = decryptInput.value;
    decryptedMessage.innerText = await decrypt(msg);
  } catch (err) {
    alert(err.message);
    console.error(err);
  }
}

encryptButton.addEventListener('click', encryptHandler);
decryptButton.addEventListener('click', decryptHandler);
