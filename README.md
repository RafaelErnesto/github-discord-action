# Discord notification action
A Github action that sends Github information to a Discord channel.

In order to work, this action requires that an input named  `url` exists in the workflow that is using the action, the content of this input is your Discord webhook url.
It's recommended that you put the url in a secret.
