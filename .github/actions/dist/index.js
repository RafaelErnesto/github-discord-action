const core = require('@actions/core')
const https = require('https')
const url = require('url')

const discordUrl = core.getInput('url')

async function send(payload){
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
          resolve("success")
        } else {
          reject("error")
        }
      })

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

function getEventData(){
    const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/')
    return {
        content: `
        Event: ${process.env.GITHUB_EVENT_NAME}\n
        User: ${owner}\n
        Repository: ${repo}\n
        Ref: ${process.env.GITHUB_REF_NAME ?? ''}
        `
    }
}

async function main(){
  try{
    await send(getEventData())
    core.setOutput("success");
  } catch(error){
    core.setFailed(error.message)
  }
}

main()
