import { Horizon, Keypair, Transaction, hash, scValToNative } from '@stellar/stellar-sdk';
import { Api } from '@stellar/stellar-sdk/lib/soroban';
import { Contract, networks } from 'kalewalk-sdk'
import { parseArgs } from "util";
import open from "open";

const { values: { secret } } = parseArgs({
    args: Bun.argv,
    options: {
        secret: {
            type: 'string',
        },
    },
    strict: true,
    allowPositionals: true,
});

if (!secret)
    throw new Error('The --secret arg is required');

const keypair = Keypair.fromSecret(secret)
const pubkey = keypair.publicKey()

const horizon = new Horizon.Server('https://horizon-futurenet.stellar.org')

await horizon.loadAccount(pubkey)
    .catch(() => horizon.friendbot(pubkey).call())
    .catch(() => { throw new Error('Failed to fund account') })

const contractId = 'CBJM4YYC6PQ3BEX4DHYI4HWSIF5UNV53ZNWXT7BDPO7TRB2Q5545VQ3N'

class Wallet {
    async isConnected() {
        return true
    }
    async isAllowed() {
        return true
    }
    async getUserInfo() {
        return {
            publicKey: pubkey
        }
    }
    async signTransaction(xdr: string) {
        const transaction = new Transaction(xdr, networks.futurenet.networkPassphrase)

        transaction.sign(keypair)

        return transaction.toXDR()
    }
    async signAuthEntry(entryXdr: string) {
        return keypair
            .sign(hash(Buffer.from(entryXdr, "base64")))
            .toString('base64')
    }
}

const contract = new Contract({
    ...networks.futurenet,
    contractId,
    rpcUrl: 'https://rpc-futurenet.stellar.org',
    wallet: new Wallet()
})

const encoder = new TextEncoder()
const decoder = new TextDecoder()

const str = `
┌┬┬┬┐
││▀▄│
│█│▀│
│▄▀││
┴┴┴┴┴
`.replace(/\n/g, '')

const canvas = Array.from(str).map((char) => {
    const arr = new Uint8Array(4)
    encoder.encodeInto(char, arr)
    return [...arr]
}).flat()

const mintRes = await contract.mint({
    name: `Soroban`,
    author: pubkey,
    canvas: Buffer.from(canvas),
})

const mintResult = await mintRes.signAndSend()

let number = 0

if (mintResult.getTransactionResponse?.status === Api.GetTransactionStatus.SUCCESS) {
    if (mintResult.getTransactionResponse.returnValue) {
        number = scValToNative(mintResult.getTransactionResponse.returnValue)
    }
}

console.log(number)

await fetch(`https://kalewalk-api.sdf-ecosystem.workers.dev/picture/${number}`, {
    method: 'POST'
})

const pictureRes = await contract.getPicture({
    number
})

const {
    name,
    canvas: picture
}: {
    name: string,
    canvas: Buffer,
} = scValToNative(pictureRes.simulationData.result.retval)

let pictureResult = ''

for (let i = 0; i < picture.length; i += 4) {
    const slice = picture.subarray(i, i + 4)

    pictureResult += decoder.decode(slice)

    if ((i + 4) % 20 === 0)
        pictureResult += '\n'
}

console.log(pictureResult.replace(/\n$/, ` ${name}`))
await open(`https://kalewalk.pages.dev/picture/${number}`);
