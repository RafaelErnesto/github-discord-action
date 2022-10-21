const core = require('@actions/core')
const https = require('https')
const url = require('url')

const discordUrl = core.getInput('url')

async function run(){
  return new Promise((resolve, reject) => {
      const url = new URL(discordUrl)
      const options = {
        hostname: url.hostname,
        path: url.pathname,
        method: 'POST',
        post: 433,
        headers: {
          'Content-Type': 'application/json'
        },
      }

      const req = https.request(options, (res) => {
        if(res.statusCode >= 200 || res.statusCode <= 299){
          resolve()
        } else {
          reject()
        }

        const body = []
        res.on('data', (chunk) => body.push(chunk))
        res.on('end', () => {
          const resString = Buffer.concat(body).toString()
          resolve(resString)
        })
      })

      const payload = {
        content: "hi"
      }

      req.on('error', (err) => {
        reject(err)
      })

      req.on('timeout', () => {
        req.destroy()
        reject(new Error('Request time out'))
      })

      req.write(JSON.stringify(payload))
      req.end()
  })
}

async function main(){
  try{
    await run()
    console.log('success')
    core.setOutput();
  } catch(error){
    console.log(error.message)
    core.setFailed(error.message)
  }
}

main().await
