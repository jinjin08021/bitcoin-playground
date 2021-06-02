const {getWallet, getMnemonicSeedPair,seedInitialization,generateMultisigAddress} = require('./bitcore')
const bip39 = require("bip39")

test('mnemonic seed pair', ()=> {
  const {mnemonic,seed} = getMnemonicSeedPair()
  expect(bip39.mnemonicToSeedSync(mnemonic).toString('hex')).toBe(seed);
})

test('Check correct wallet info given seed', ()=>{
  const seed = "a2afc54780c4c160a675d85253046a7dbecb6d913bf8f2e56a0a85f5d0bf7ce0ba65ada9f6b1dacdaa954d9b50a5b644fdc230142aed2d4f647a134112b2385e"
  let hd = seedInitialization(seed)
  const {address,pub,pri} = getWallet(hd,[0,0,0])
  expect(address).toBe("17yCQuZfFVtWqmYYoBHqaEktPKGURo8rJ8")
  expect(pub).toBe("03fb1f40b5f4a22da25bed94651e5d6b594fbdebbcf136affd525020a983e94942")
  expect(pri).toBe("L3ymw1pZp8BTU2ohiKsjxLZHkMCCEEkmVkcLGMQtL4WDecZxMeR1")
})

test('Check correct wallet info given seed2', ()=>{
  const seed = "acdb958056715d13ba4a32f04942dbca9c9a9526ab74fb245a13c5f6c9f9bced5c1e5c4e7cc62536ff1128b4b7c6bfb3b4b28a9aaa7aad29b197ca93136829ec"
  let hd = seedInitialization(seed)
  const {address,pub,pri} = getWallet(hd,[1,0,1])
  expect(address).toBe("1MxtDuQuwu1RuytQCQ64AVasgW6UGUrbVY")
  expect(pub).toBe("02f4c4a807959ed062883263d518dc664df32b454e65c2603dcc9e6649d75976ea")
  expect(pri).toBe("Kx63kYmSDew2ZX2fKx7fyXfPQ1PuwB2sg54A8vPcfnQ6HScKEtKH")
})

test('Check multisig', ()=>{
  const pubkeys = "0258c7cffd5b989053a50fce647a707ed0361843ee04dc37006c29f64c205c4c8f\n030fff3f9a4d97671113558618f4da7845fe14f5f54ac0e97b7ccaf481083d955c\n02798cde05176e37b7983140305feaf02c5cbccf959b4321b68c31f79557c08f6c"
  const address = generateMultisigAddress(pubkeys,2)

  expect(address).toBe("3H2iBXM7hTr7sorSh87UqimjCaDXwj6VRi")

})
