const axios = require("axios")
const dotenv = require("dotenv")
const chalk = require("chalk")
dotenv.config()

const BASE_URL = process.env.DATA_HOST_URL
const TOKEN_URL = `${BASE_URL}/api/auth/login`

const CREDENTIALS = {
    email: process.env.USERNAME,
    password: process.env.PASSWORD
}

function retrieveToken(credentials){
    return axios.post(TOKEN_URL, credentials).then(result => {
        return Promise.resolve(result.data.message.split(" ")[1])
    }).catch(err => {
        console.log(chalk.bgRed(err))
        return Promise.reject(err)
    })
}
// memoize
let token = ""
function ensureToken(){
    return new Promise((resolve, reject) => {
    // use memo
        if(token){
            resolve(token)
        }
        // Go get it from the network
        retrieveToken(CREDENTIALS).then((t) => {
            token = t
            resolve(token)
        }).catch(err => {
            console.log(chalk.bgRed(err))
            reject(err)
        })
    })
}
// warm up the token
ensureToken()

// automatically tries with new tokens
function get(url){
    return ensureToken().then(token => {
        return axios.get(
            url,
            { headers: { Authorization: "Bearer " + token }}
        )
    }).catch(err => {
    // clear out the memo and we can try again
        token = ""
        return Promise.reject(`Unable to obtain token: ${err}`)
    })
}

function post(url, body){
    return ensureToken().then(token => {
        return axios.post(
            url,
            body,
            { headers: { "Authorization": token }}
        )
    }).catch(err => {
        token = ""
        return Promise.reject(`Unable to obtain token: ${err}`)
    })
}

// These pieces can be mocked
// fairly easily
module.exports = {
    get,
    post
}
