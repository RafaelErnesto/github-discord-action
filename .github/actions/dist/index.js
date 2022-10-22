const core = require('@actions/core')
const github = require('@actions/github');
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
    return {
        content: `Event: ${github.context.eventName}\n User: ${github.context.repo.owner}\n Repository: ${github.context.repo.repo}\n Ref: ${github.context.ref}`
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
