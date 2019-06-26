/* global describe, it  */
/* eslint-disable no-unused-expressions */

const crypto = require('crypto')
const util = require('util')
const chai = require('chai')
const BN = require('bn.js')
const addr = require('@xmr-core/xmr-crypto-utils')

const { createAddress } = require('../address')

chai.use(require('chai-as-promised'))
chai.use(require('chai-bn')(BN))

const expect = chai.expect
const randomBytes = util.promisify(crypto.randomBytes)

describe('monero-address-generator', () => {
  describe('address', () => {
    it('should generate a valid address with fixed seed', () => {
      const SEED = 'eecada807110716409b9651627a4570ec377e26a3332ce2912b7b0cb1fd99e0f'
      const NETWORK = 0
      const a = addr.create_address(SEED, NETWORK)
      const b = createAddress(SEED)

      expect(a.spend.sec).to.be.equal(b.sk)
      expect(a.spend.pub).to.be.equal(b.publicKey)
      expect(a.view.sec).to.be.equal(b.privateViewKey)
      expect(a.view.pub).to.be.equal(b.publicViewKey)
    })

    it('should generate a valid address with random seed', async () => {
      const SEED = (await randomBytes(32)).toString('hex')
      const NETWORK = 0
      const a = addr.create_address(SEED, NETWORK)
      const b = createAddress(SEED)

      expect(a.spend.sec).to.be.equal(b.sk)
      expect(a.spend.pub).to.be.equal(b.publicKey)
      expect(a.view.sec).to.be.equal(b.privateViewKey)
      expect(a.view.pub).to.be.equal(b.publicViewKey)
    })
  })
})
