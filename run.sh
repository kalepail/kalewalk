# cargo clean
soroban contract build
contract_id=$(soroban contract deploy --wasm target/wasm32-unknown-unknown/release/kalewalk.wasm --network futurenet --source-account default)
soroban contract bindings typescript --wasm target/wasm32-unknown-unknown/release/kalewalk.wasm --output-dir kalewalk-sdk --contract-id $contract_id --network futurenet --overwrite
bun install --force
echo $contract_id