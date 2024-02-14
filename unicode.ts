const encoder = new TextEncoder()
const decoder = new TextDecoder()

let str = `┌┬┬┬┐││▀▄││█│▀││▄▀││┴┴┴┴┴`

let arr = Array.from(str).map((char) => {
    let arr = new Uint8Array(4)
    encoder.encodeInto(char, arr)

    return arr
})

console.log(arr)

// console.log(encoder.encode('⎝'))
console.log(encoder.encode('⸻'))

// ┌───────┐
// │ ┌┬┬┬┐ │
// │ ││▀▄│ │
// │ │█│▀│ │
// │ │▄▀││ │
// │ ┴┴┴┴┴ │
// └───────1

// ┌┬┬┬┐
// ││▀▄│
// │█│▀│
// │▄▀││
// ┴┴┴┴┴
// ⸻⸻⸻⸻⸻
// 00009