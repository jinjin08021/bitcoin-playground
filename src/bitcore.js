const bitcore = require("bitcore-lib")
const bip39 = require("bip39")
const hdAddress = require("hd-address")

function getMnemonicSeedPair(){
  let mnemonic = bip39.generateMnemonic()
  let seed = bip39.mnemonicToSeedSync(mnemonic).toString('hex')
  return {"mnemonic":mnemonic,"seed":seed}
}

function seedInitialization(seed){
  let seedBuf = Buffer.from(seed, "hex")
  let hd = hdAddress.HD(seedBuf,hdAddress.keyType.seed)
  return hd

}

function getWallet(hd,hdIndex){
  const [account,external,index] = hdIndex
  let hdPath = `m/44'/0'/${account}'/${external}/${index}`
  let wallet = hd.wallet.getChainCodeByPath(hdPath)
  let address = hd.BTC.getAddressByPublicKey(wallet.pub)
  let privateKey = (new bitcore.PrivateKey(wallet.pri.toString('hex'))).toWIF();
  return {
    "address":address.address,
    "pub":wallet.pub.toString('hex'),
    "pri":privateKey
  }
}

// https://iancoleman.io/multisig/
function generateMultisigAddress(publicKeys, requiredSig){

  let publicKeysList = publicKeys.split("\n");
  // publicKeysList = [
  //   "026477115981fe981a6918a6297d9803c4dc04f328f22041bedff886bbc2962e01",
  //   "02c96db2302d19b43d4c69368babace7854cc84eb9e061cde51cfa77ca4a22b8b9",
  //   "03c6103b3b83e4a24a0e33a4df246ef11772f9992663db0c35759a5e2ebf68d8e9"
  // ]
  for(let pub of publicKeysList){
    if(!bitcore.PublicKey.isValid(pub)){
      alert("invalid public key")
      return ""
    }
  }
  let address = new bitcore.Address(publicKeysList, requiredSig);
  return address.toString()
}

export {getWallet,getMnemonicSeedPair,seedInitialization,generateMultisigAddress};
