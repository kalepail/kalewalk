import { xdr } from '@stellar/stellar-sdk'

const raw = 'AAAAAAAAAAAAAAABAAAABgAAAAF5bvfbP7WBs18KugqHFXzLc8XvYLCGYPPYrImLMsb4hwAAABAAAAABAAAAAQAAAA8AAAAHQXV0aG9ycwAAAAABAAAAAAAACigAAAooAAAAAAAAU00='
const parsed = xdr.SorobanTransactionData.fromXDR(raw, 'base64')

console.log(parsed.resources().footprint().readWrite()[0].contractData().key().toXDR('base64'));
