# scribe-link-grabber

This is an example consumer app of the `slackscribe` system

If you have access to this repo you probably also have access to [slackscribe repo](https://github.com/Thunderducky/slackscribe/) as well

## Getting started
1. `yarn install`
2. Make a copy of the .env.example as .env (replacing the placeholder values)
3. `yarn start`

## Making your own app
### Working With The Slack Scribe API

http://slackscribe.herokuapp.com/claim.html

Claim your account with your username and code and select a unique password
YOU WON'T BE ABLE TO RESET IT YET

This username and password will be how you can get your JWT_TOKEN
these tokens expire every 23 hours, so if you want to request new ones, you'll have to do that
with your username and password

To get your JWT token, use the following endpoint

// you will want to do this on your server
POST https://slackscribe/api/auth/login
with the body
`
{
	email: <YOUR-EMAIL-ADDRESS>
	password: <YOUR-PASSWORD>
}
`

if your credentials are incorrect or you haven't been validated by me yet, you'll recieve a 401

if your credentials are correct and you've been validated, you should recieve a 200 status code
and the following response
`
{
	success: true,
	token: "JWT <your-access-token-here"
}
`

You will use your access token for any subsequent requests, trying to use your email/password combo will not work

We currently only have one endpoint to use for retrieving recorded slack events

https://slackscribe/api/events

Optionally you may include start and end query markers that use unix time
https://slackscribe/api/events?start=1550653750273&end=1550740150274
(look for events betwen February 20th around 3AM and February 21st around 3AM)
Note: you can have one without the other

You will need to pass the following headers along with the request
`
{
	Authorization: "Bearer <your-bearer-auth-token>"
}
`

You will get back data in the following format
`
{
	ts: { type: Number },			// The timestamp in unix time of the event
	  user: { type: String },		// the coded string of the user
	  text: { type: String },		// the text associated with the event
	  links: [{						// any links associated with the event
	    url: { type:String} ,		// the raw url
	    domain: { type:String },	// the top level domain associated with it
	    label: {type: String }		// the label it may have been given
	  }],
	  channel: { type: String },	// the coded string of the channel it appeared in
	  eventType: { type: String }	// the type of event
}
`

Using this information for example, you could determine all the links that came from stack overflow that were shared during the week, or when each of the panopto videos was posted etc
