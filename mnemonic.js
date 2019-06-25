/* Adapted and modified from https://github.com/luigi1111/xmr.llcoins.net */

const words = require('./words')

const encode = (str) => {
  let out = []
  let n = words.length

  for (let j = 0; j < str.length; j += 8) {
    str = str.slice(0, j) + swapEndian4byte(str.slice(j, j + 8)) + str.slice(j + 8)
  }

  for (let i = 0; i < str.length; i += 8) {
    let x = parseInt(str.substr(i, 8), 16)
    let w1 = (x % n)
    let w2 = (Math.floor(x / n) + w1) % n
    let w3 = (Math.floor(Math.floor(x / n) / n) + w2) % n
    out = out.concat([words[w1], words[w2], words[w3]])
  }

  return out
}

const swapEndian4byte = (str) => {
  if (str.length !== 8) {
    throw new Error(`Invalid input length: ${str.length}`)
  }
  return str.slice(6, 8) + str.slice(4, 6) + str.slice(2, 4) + str.slice(0, 2)
}

module.exports = {
  encode
}
