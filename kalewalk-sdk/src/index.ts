import { ContractSpec, Address } from '@stellar/stellar-sdk';
import { Buffer } from "buffer";
import { AssembledTransaction, Ok, Err } from './assembled-tx.js';
import type {
  u32,
  i32,
  u64,
  i64,
  u128,
  i128,
  u256,
  i256,
  Option,
  Typepoint,
  Duration,
  Error_,
  Result,
} from './assembled-tx.js';
import type { ClassOptions, XDR_BASE64 } from './method-options.js';

export * from './assembled-tx.js';
export * from './method-options.js';

if (typeof window !== 'undefined') {
    //@ts-ignore Buffer exists
    window.Buffer = window.Buffer || Buffer;
}

export const networks = {
    futurenet: {
        networkPassphrase: "Test SDF Future Network ; October 2022",
        contractId: "CBPTQXBM3A2SQYYKU6YDD5KOTVTEOKOJN7ZLNFUABEJDVZYC24GLGYQ5",
    }
} as const

/**
    
    */
export const Errors = {
1: {message:""},
  2: {message:""},
  3: {message:""}
}
/**
    
    */
export interface Picture {
  /**
    
    */
canvas: Buffer;
  /**
    
    */
ledger: u32;
  /**
    
    */
name: string;
  /**
    
    */
network: Buffer;
  /**
    
    */
timestamp: u64;
  /**
    
    */
version: u32;
}

/**
    
    */
export type Key = {tag: "Cursor", values: void} | {tag: "Picture", values: readonly [u32]} | {tag: "Author", values: readonly [u32]} | {tag: "Number", values: readonly [string]} | {tag: "Authors", values: readonly [u32]};


export class Contract {
    spec: ContractSpec;
    constructor(public readonly options: ClassOptions) {
        this.spec = new ContractSpec([
            "AAAABAAAAAAAAAAAAAAABUVycm9yAAAAAAAAAwAAAAAAAAAITm90Rm91bmQAAAABAAAAAAAAAAhOb3RFbXB0eQAAAAIAAAAAAAAAB1Rvb0xvbmcAAAAAAw==",
        "AAAAAQAAAAAAAAAAAAAAB1BpY3R1cmUAAAAABgAAAAAAAAAGY2FudmFzAAAAAAPuAAAAZAAAAAAAAAAGbGVkZ2VyAAAAAAAEAAAAAAAAAARuYW1lAAAAEAAAAAAAAAAHbmV0d29yawAAAAPuAAAAIAAAAAAAAAAJdGltZXN0YW1wAAAAAAAABgAAAAAAAAAHdmVyc2lvbgAAAAAE",
        "AAAAAgAAAAAAAAAAAAAAA0tleQAAAAAFAAAAAAAAAAAAAAAGQ3Vyc29yAAAAAAABAAAAAAAAAAdQaWN0dXJlAAAAAAEAAAAEAAAAAQAAAAAAAAAGQXV0aG9yAAAAAAABAAAABAAAAAEAAAAAAAAABk51bWJlcgAAAAAAAQAAABMAAAABAAAAAAAAAAdBdXRob3JzAAAAAAEAAAAE",
        "AAAAAAAAAAAAAAAEbWludAAAAAMAAAAAAAAABG5hbWUAAAAQAAAAAAAAAAZhdXRob3IAAAAAABMAAAAAAAAABmNhbnZhcwAAAAAD7gAAAGQAAAABAAAD6QAAAAQAAAAD",
        "AAAAAAAAAAAAAAAIZ2V0X2xpc3QAAAABAAAAAAAAAARwYWdlAAAABAAAAAEAAAPsAAAABAAAABM=",
        "AAAAAAAAAAAAAAAKZ2V0X2F1dGhvcgAAAAAAAQAAAAAAAAAGbnVtYmVyAAAAAAAEAAAAAQAAA+kAAAATAAAAAw==",
        "AAAAAAAAAAAAAAALZ2V0X3BpY3R1cmUAAAAAAQAAAAAAAAAGbnVtYmVyAAAAAAAEAAAAAQAAA+kAAAfQAAAAB1BpY3R1cmUAAAAAAw==",
        "AAAAAAAAAAAAAAAOZ2V0X3BpY3R1cmVfYnkAAAAAAAEAAAAAAAAABmF1dGhvcgAAAAAAEwAAAAEAAAPpAAAH0AAAAAdQaWN0dXJlAAAAAAM="
        ]);
    }
    private readonly parsers = {
        mint: (result: XDR_BASE64 | Err): Ok<u32> | Err<Error_> => {
            if (result instanceof Err) return result
            return new Ok(this.spec.funcResToNative("mint", result))
        },
        getList: (result: XDR_BASE64): Map<u32, string> => this.spec.funcResToNative("get_list", result),
        getAuthor: (result: XDR_BASE64 | Err): Ok<string> | Err<Error_> => {
            if (result instanceof Err) return result
            return new Ok(this.spec.funcResToNative("get_author", result))
        },
        getPicture: (result: XDR_BASE64 | Err): Ok<Picture> | Err<Error_> => {
            if (result instanceof Err) return result
            return new Ok(this.spec.funcResToNative("get_picture", result))
        },
        getPictureBy: (result: XDR_BASE64 | Err): Ok<Picture> | Err<Error_> => {
            if (result instanceof Err) return result
            return new Ok(this.spec.funcResToNative("get_picture_by", result))
        }
    };
    private txFromJSON = <T>(json: string): AssembledTransaction<T> => {
        const { method, ...tx } = JSON.parse(json)
        return AssembledTransaction.fromJSON(
            {
                ...this.options,
                method,
                parseResultXdr: this.parsers[method],
            },
            tx,
        );
    }
    public readonly fromJSON = {
        mint: this.txFromJSON<ReturnType<typeof this.parsers['mint']>>,
        getList: this.txFromJSON<ReturnType<typeof this.parsers['getList']>>,
        getAuthor: this.txFromJSON<ReturnType<typeof this.parsers['getAuthor']>>,
        getPicture: this.txFromJSON<ReturnType<typeof this.parsers['getPicture']>>,
        getPictureBy: this.txFromJSON<ReturnType<typeof this.parsers['getPictureBy']>>
    }
        /**
    * Construct and simulate a mint transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
    */
    mint = async ({name, author, canvas}: {name: string, author: string, canvas: Buffer}, options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number,
    } = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'mint',
            args: this.spec.funcArgsToScVals("mint", {name, author: new Address(author), canvas}),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['mint'],
        });
    }


        /**
    * Construct and simulate a get_list transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
    */
    getList = async ({page}: {page: u32}, options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number,
    } = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'get_list',
            args: this.spec.funcArgsToScVals("get_list", {page}),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['getList'],
        });
    }


        /**
    * Construct and simulate a get_author transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
    */
    getAuthor = async ({number}: {number: u32}, options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number,
    } = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'get_author',
            args: this.spec.funcArgsToScVals("get_author", {number}),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['getAuthor'],
        });
    }


        /**
    * Construct and simulate a get_picture transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
    */
    getPicture = async ({number}: {number: u32}, options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number,
    } = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'get_picture',
            args: this.spec.funcArgsToScVals("get_picture", {number}),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['getPicture'],
        });
    }


        /**
    * Construct and simulate a get_picture_by transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
    */
    getPictureBy = async ({author}: {author: string}, options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number,
    } = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'get_picture_by',
            args: this.spec.funcArgsToScVals("get_picture_by", {author: new Address(author)}),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['getPictureBy'],
        });
    }

}