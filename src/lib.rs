#![no_std]

use soroban_sdk::{
    contract, contracterror, contractimpl, contracttype, Address, BytesN, Env, Map, String,
};

#[contracterror]
#[derive(Copy, Clone)]
#[repr(u32)]
pub enum Error {
    NotFound = 1,
    NotEmpty = 2,
    TooLong = 3,
}

#[contracttype]
pub struct Picture {
    name: String,
    canvas: BytesN<100>,
    ledger: u32,
    timestamp: u64,
    version: u32,
    network: BytesN<32>,
}

#[contracttype]
pub enum Key {
    Cursor,
    Picture(u32),
    Author(u32),
    Number(Address),
    Authors(u32),
}

#[contract]
pub struct Contract;

#[cfg(test)]
mod test;

#[contractimpl]
impl Contract {
    pub fn mint(
        env: Env,
        name: String,
        author: Address,
        canvas: BytesN<100>,
    ) -> Result<u32, Error> {
        author.require_auth();

        if name.len() > 15 {
            return Err(Error::TooLong);
        }

        let number = match env.storage().persistent().get(&Key::Number(author.clone())) {
            Some(number) => number,
            None => {
                let number = env.storage().instance().get(&Key::Cursor).unwrap_or(1);

                // Store author <-> number
                env.storage()
                    .persistent()
                    .set(&Key::Author(number), &author);
                env.storage()
                    .persistent()
                    .set(&Key::Number(author.clone()), &number);

                // Add it to the list of authors
                let page = number / 20;
                let mut authors = env
                    .storage()
                    .persistent()
                    .get(&Key::Authors(page))
                    .unwrap_or(Map::new(&env));
                authors.set(number, author);
                env.storage()
                    .persistent()
                    .set(&Key::Authors(page), &authors);

                // Increment cursor for next mint
                env.storage().instance().set(&Key::Cursor, &(number + 1));

                number
            }
        };

        let picture = Picture {
            name,
            canvas,
            ledger: env.ledger().sequence(),
            timestamp: env.ledger().timestamp(),
            version: env.ledger().protocol_version(),
            network: env.ledger().network_id(),
        };

        // Store picture
        env.storage()
            .persistent()
            .set(&Key::Picture(number), &picture);

        Ok(number)
    }
    pub fn get_list(env: Env, page: u32) -> Map<u32, Address> {
        env.storage()
            .persistent()
            .get(&Key::Authors(page))
            .unwrap_or(Map::new(&env))
    }
    pub fn get_author(env: Env, number: u32) -> Result<Address, Error> {
        match env.storage().persistent().get(&Key::Author(number)) {
            Some(owner) => owner,
            None => Err(Error::NotFound),
        }
    }
    pub fn get_picture(env: Env, number: u32) -> Result<Picture, Error> {
        match env.storage().persistent().get(&Key::Picture(number)) {
            Some(picture) => picture,
            None => Err(Error::NotFound),
        }
    }
    pub fn get_picture_by(env: Env, author: Address) -> Result<Picture, Error> {
        match env.storage().persistent().get(&Key::Number(author)) {
            Some(number) => Self::get_picture(env, number),
            None => Err(Error::NotFound),
        }
    }
}
