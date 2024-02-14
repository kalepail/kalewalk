import { Horizon, Keypair, Transaction, scValToNative } from '@stellar/stellar-sdk';
import { Api } from '@stellar/stellar-sdk/lib/soroban';
import fetchAdapter from '@vespaiach/axios-fetch-adapter';
import { Contract, networks } from 'kalewalk-sdk'

Horizon.AxiosClient.defaults.adapter = fetchAdapter as any

const horizon = new Horizon.Server('https://horizon-futurenet.stellar.org')

// GDHFKNNWNGWB5SFAAPELDU6IZ6D5CUZRDNOABBU5PMLYAE4OJIKODFCA
// SD2L6LW5NQ5BGIQXTIB3R7CMAP6LEXIDYMLHHPWUOERYKAI4S6ZXU425
const keypair = Keypair.random()
const pubkey = keypair.publicKey()

const readkey = 'GDYHBDPJ3KVDGILOJWJ6EKCGZKR5R2XSA2VM24IY23IQ3HUWHJS3EK6E'
const contractId = 'CBJM4YYC6PQ3BEX4DHYI4HWSIF5UNV53ZNWXT7BDPO7TRB2Q5545VQ3N'

class ReadWallet {
    async isConnected() {
        return true
    }
    async isAllowed() {
        return true
    }
    async getUserInfo() {
        return {
            publicKey: readkey
        };
    }
    async signTransaction(_xdr: string) {
        return ''
    }
    async signAuthEntry(_xdr: string) {
        return ''
    }
}
class WriteWallet {
    async isConnected() {
        return true
    }
    async isAllowed() {
        return true
    }
    async getUserInfo() {
        return {
            publicKey: pubkey
        };
    }
    async signTransaction(xdr: string) {
        const transaction = new Transaction(xdr, networks.futurenet.networkPassphrase)

        transaction.sign(keypair)

        return transaction.toXDR()
    }
    async signAuthEntry(_xdr: string) {
        return ''
    }
}

const readContract = new Contract({
    ...networks.futurenet,
    contractId,
    rpcUrl: 'https://rpc-futurenet.stellar.org',
    wallet: new ReadWallet()
})
const writeContract = new Contract({
    ...networks.futurenet,
    contractId,
    rpcUrl: 'https://rpc-futurenet.stellar.org',
    wallet: new WriteWallet()
})

export async function fundAccount() {
    try {
        await horizon.loadAccount(pubkey)
    } catch {
        await horizon.friendbot(pubkey).call()   
    }
}

export async function kalewalkMint(name: string, canvas: number[]) {
    await fundAccount()

    const mintRes = await writeContract.mint({
        name,
        author: pubkey,
        canvas: Buffer.from(canvas),
    })

    const mintResult = await mintRes.signAndSend()

    if (
        mintResult.getTransactionResponse?.status === Api.GetTransactionStatus.SUCCESS
        && mintResult.getTransactionResponse.returnValue
    ) {
        const number = scValToNative(mintResult.getTransactionResponse.returnValue)

        await fetch(`https://kalewalk-api.sdf-ecosystem.workers.dev/picture/${number}`, {
            method: 'POST'
        })

        return number
    }
}

export async function kalewalkGetPicture(number: number) {
    const pictureRes = await readContract.getPicture({ number })
    return scValToNative(pictureRes.simulationData.result.retval)
}