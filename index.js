const crypto = require('crypto')
const util = require('util')
const randomBytes = util.promisify(crypto.randomBytes)

const { createAddress } = require('./address')

const main = async () => {
  const seed = Buffer.from(await randomBytes(32))
  return createAddress(seed)
}

main()
  .then(val => {
    console.log(val)
  })
  .catch(err => {
    console.log(err)
    process.exit(1)
  })
