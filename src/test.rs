use std::println;

use soroban_sdk::{testutils::Address as _, Address, BytesN, Env, String};

use crate::{Contract, ContractClient};

extern crate std;

#[test]
fn test() {
    let env = Env::default();
    let contract_id = env.register_contract(None, Contract);
    let client = ContractClient::new(&env, &contract_id);

    env.mock_all_auths();

    let name = String::from_str(&env, "kalepail");
    let author = Address::generate(&env);
    let canvas = BytesN::from_array(
        &env,
        &[
            226, 148, 140, 0, 226, 148, 172, 0, 226, 148, 172, 0, 226, 148, 172, 0, 226, 148, 144,
            0, 226, 148, 130, 0, 226, 148, 130, 0, 226, 150, 128, 0, 226, 150, 132, 0, 226, 148,
            130, 0, 226, 148, 130, 0, 226, 150, 136, 0, 226, 148, 130, 0, 226, 150, 128, 0, 226,
            148, 130, 0, 226, 148, 130, 0, 226, 150, 132, 0, 226, 150, 128, 0, 226, 148, 130, 0,
            226, 148, 130, 0, 226, 148, 180, 0, 226, 148, 180, 0, 226, 148, 180, 0, 226, 148, 180,
            0, 226, 148, 180, 0,
        ],
    );

    let number = client.mint(&name, &author, &canvas);

    println!("{:?}", number);

    let number = client.mint(&name, &author, &canvas);

    println!("{:?}", number);
}
