const crypto = require('crypto')
const util = require('util')
const BN = require('bn.js')
const elliptic = require('elliptic')
const EC = elliptic.ec
const randomBytes = util.promisify(crypto.randomBytes)

const { encode } = require('@xmr-core/xmr-b58').cnBase58
const cnFastHash = require('@xmr-core/xmr-fast-hash').cn_fast_hash

const mnemonic = require('./mnemonic')

const ec = new EC('ed25519')

const l = new BN('2').pow(new BN('252')).add(new BN('27742317777372353535851937790883648493')) // 2**252 + 27742317777372353535851937790883648493

const intToHex = (num) => {
  return new BN(elliptic.eddsa.prototype.encodeInt(num))
}

const hexToInt = (hex) => {
  return new BN(hex, 'hex', 'le')
}

const scReduceKey = (key) => {
  return intToHex(hexToInt(key).mod(l))
}

const getPrivateViewKey = (key) => {
  return scReduceKey(cnFastHash(key))
}

const getPublicKeyFromPrivateKey = (key) => { // Public view key differs
  let s = ec.curve.g.mul(hexToInt(key))
  let enc = elliptic.eddsa.prototype.encodePoint(s)
  return new BN(enc)
}

const genAddress = (version, pk, vpk) => {
  const buffer = version + pk + vpk
  const hash = cnFastHash(buffer)
  const address = buffer + hash.slice(0, 8)
  return encode(address)
}

const normalizeKeys = keys => {
  return Object.keys(keys).reduce((previous, current) => {
    previous[current] = keys[current].toString('hex')
    return previous
  }, {})
}

const main = async () => {
  const seed = Buffer.from(await randomBytes(32))
  const sk = scReduceKey(seed.toString('hex'))
  const privateViewKey = getPrivateViewKey(sk.toString(16))
  const publicKey = getPublicKeyFromPrivateKey(sk.toString(16))
  const publicViewKey = getPublicKeyFromPrivateKey(privateViewKey.toString(16))

  const address = genAddress('12', publicKey.toString(16), publicViewKey.toString(16))
  const keys = normalizeKeys({ sk, privateViewKey, publicKey, publicViewKey, address })
  const wallet = mnemonic.encode(keys.sk)
  return { ...keys, mnemonic: wallet }
}

main()
  .then(val => {
    console.log(val)
  })
  .catch(err => {
    console.log(err)
    process.exit(1)
  })
