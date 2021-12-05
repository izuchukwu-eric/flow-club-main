const { randomBytes } = require('crypto')
const fs = require('fs') 

const ROOM_PATH = './src/utils/room.js'
const FIREBASE_PATH = './src/utils/firebase.js'
const UNINITIALIZED_ROOM_START = 'const ROOM_IDX = '
const UNINITIALIZED_FIREBASE_START = 'export const slug = '

function matchesStart(start, strToMatch) {
    return start === strToMatch.slice(0, start.length)
}

fs.readFile(ROOM_PATH, 'utf-8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    const lines = data.split('\n')
    if (matchesStart(UNINITIALIZED_ROOM_START, lines[0])) {
        return 
    }

    const randomIdx = Math.floor(25 * Math.random())
    lines.unshift(`const ROOM_IDX = ${randomIdx}`)
    fs.writeFile(ROOM_PATH, lines.join('\n'), (err) => {
        if (err) {
            console.error(err)
            return
        }
        return
    })
})
fs.readFile(FIREBASE_PATH, 'utf-8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    if (data.includes(UNINITIALIZED_FIREBASE_START)) {
        return
    }
    const lines = data.split('\n')
    const slug = randomBytes(10).toString('hex').slice(0, 10)
    lines.push(`export const slug = '${slug}'`)
    fs.writeFile(FIREBASE_PATH, lines.join('\n'), (err) => {
        if (err) {
            console.error(err)
            return
        }
        return
    })
})
