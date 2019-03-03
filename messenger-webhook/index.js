/* ======================================================================== */

/*
 * Reference: https://developers.facebook.com/docs/messenger-platform/getting-started/webhook-setup
 * Step 2) Create an HTTP Server
 *
 * This code creates an HTTP server that listens for requests on the default 
 * port, or port 3000 if there is no default. For this guide we are using 
 * Express, a popular, lightweight HTTP framework, but you can use any 
 * framework you love to build your webhook.
 */

'use strict';

// Imports dependencies and set up http server
const
    request = require('request'),
    express = require('express'),
    dotenv = require('dotenv'),
    /*
    apiai = require('apiai'),
    dialogflow = require('dialogflow'),
    uuid = require("uuid"),
    axios = require('axios'),
    */
    bodyParser = require('body-parser'),
    app = express().use(bodyParser.json()); // creates express http server


//Import Config file
const config = require("./config.js");

dotenv.config();

// Sets server port and logs message on success
app.listen(process.env.PORT || 3000, () => console.log('webhook is listening'));

// Dialogflow v1
/*
const dialogflowService = apiai(config.API_AI_CLIENT_ACCESS_TOKEN, {
    language: "en",
    requestSource: "fb"
});
const sessionIds = new Map();
*/

/*
 * Reference: https://developers.facebook.com/docs/messenger-platform/getting-started/webhook-setup
 * Step 3) Create an HTTP Server
 *
 * This code creates a /webhook endpoint that accepts POST requests, 
 * checks the request is a webhook event, then parses the message. 
 * This endpoint is where the Messenger Platform will send all webhook events.
 *
 * Note that the endpoint returns a 200OK response, which tells the Messenger 
 * Platform the event has been received and does not need to be resent. 
 * Normally, you will not send this response until you have completed 
 * processing the event.
 */
// Creates the endpoint for our webhook 
app.post('/webhook', (req, res) => {  

    let body = req.body;

    // Checks this is an event from a page subscription
    if (body.object === 'page') {

        // Iterates over each entry - there may be multiple if batched
        body.entry.forEach(function(entry) {
            /*
            var pageID = entry.id;
            var timeOfEvent = entry.time;

            // Iterate over each messaging event
            entry.messaging.forEach(function (messagingEvent) {
                if (messagingEvent.message) {
                    receivedMessage(messagingEvent);
                } else {
                    console.log("Webhook received unknown messagingEvent: ", messagingEvent);
                }
            });
            */

            // Gets the message. entry.messaging is an array, but 
            // will only ever contain one message, so we get index 0.
            // Gets the body of the webhook event
            let webhook_event = entry.messaging[0];
            console.log(webhook_event);

            // Get the sender PSID
            let sender_psid = webhook_event.sender.id;
            console.log('Sender PSID: ' + sender_psid);

            // Check if the event is a message or postback and
            // pass the event to the appropriate handler function
            if (webhook_event.message) {
                handleMessage(sender_psid, webhook_event.message);
            } else if (webhook_event.postback) {
                handlePostback(sender_psid, webhook_event.postback);
            }
        });

        // Returns a '200 OK' response to all requests
        res.status(200).send('EVENT_RECEIVED');
    } else {
        // Returns a '404 Not Found' if event is not from a page subscription
        res.sendStatus(404);
    }

});


/*
 * Reference: https://developers.facebook.com/docs/messenger-platform/getting-started/webhook-setup
 * Step 4) Add webhook verification
 *
 * This code adds support for the Messenger Platform's webhook verification 
 * to your webhook. This is required to ensure your webhook is authentic and working.
 *
 * The verification process looks like this:
 * 1. You create a verify token. This is a random string of your choosing, hardcoded into your webhook.
 * 2. You provide your verify token to the Messenger Platform when you subscribe your webhook to receive webhook events for an app.
 * 3. The Messenger Platform sends a GET request to your webhook with the token in the hub.verify parameter of the query string.
 * 4. You verify the token sent matches your verify token, and respond with hub.challenge parameter from the request.
 * 5. The Messenger Platform subscribes your webhook to the app.
 */

// Adds support for GET requests to our webhook
app.get('/webhook', (req, res) => {

    // Your verify token. Should be a random string.
    // let VERIFY_TOKEN = "<YOUR_VERIFY_TOKEN>"
    let VERIFY_TOKEN = "WEWANTWEGMANS";

    // Parse the query params
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];

    // Checks if a token and mode is in the query string of the request
    if (mode && token) {

        // Checks the mode and token sent is correct
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {

            // Responds with the challenge token from the request
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);

        } else {
            // Responds with '403 Forbidden' if verify tokens do not match
            res.sendStatus(403);
        }
    }
});


/* ======================================================================== */
// Reference: https://www.yudiz.com/chatbot-for-facebook-messenger-using-dialogflow-and-node-js-part1/

/*
function receivedMessage(event) {
    var senderID = event.sender.id;
    var recipientID = event.recipient.id;
    var timeOfMessage = event.timestamp;
    var message = event.message;

    if (!sessionIds.has(senderID)) {
        sessionIds.set(senderID, uuid.v1());
    }

    var messageId = message.mid;
    var appId = message.app_id;
    var metadata = message.metadata;

    // You may get a text or attachment but not both
    var messageText = message.text;
    var messageAttachments = message.attachments;

    if (messageText) {
        //send message to Dialogflow
        sendToDialogflow(senderID, messageText);
    } else if (messageAttachments) {
        handleMessageAttachments(messageAttachments, senderID);
    }
}


function sendToDialogflow(sender, text) {
    sendTypingOn(sender); // Show that bot is typing on Messenger
    let dialogflowRequest = dialogflowService.textRequest(text, {
        sessionId: sessionIds.get(sender)
    });

    dialogflowRequest.on("response", response => {
        if (isDefined(response.result)) {
            handleDialogflowResponse(sender, response);
        }
    });

    dialogflowRequest.on("error", error => console.error(error));
    dialogflowRequest.end();
}
*/

/*
// Make sure we are receiving the proper response
const isDefined = (obj) => {
    if (typeof obj == "undefined") {
        return false;
    }
    if (!obj) {
        return false;
    }
    return obj != null;
}
*/

/*
// Turn on typing indicator
const sendTypingOn = (recipientId) => {
    var messageData = {
        recipient: {
            id: recipientId
        },
        sender_action: "typing_on"
    };
    callSendAPI(messageData);
}

// Turn off typing indicator
const sendTypingOff = (recipientId) => {
    var messageData = {
        recipient: {
            id: recipientId
        },
        sender_action: "typing_off"
    };

    callSendAPI(messageData);
}
*/

/*
// Handle Dialogflow Response
function handleDialogflowResponse(sender, response) {
    let responseText = response.result.fulfillment.speech;
    let responseData = response.result.fulfillment.data;
    let messages = response.result.fulfillment.messages;
    let action = response.result.action;
    let contexts = response.result.contexts;
    let parameters = response.result.parameters;

    sendTypingOff(sender);

    if (responseText == "" && !isDefined(action)) {
        // Dialogflow could not evaluate input.
        console.log("Unknown query" + response.result.resolvedQuery);
        sendTextMessage(
            sender,
            "I'm not sure what you want. Can you be more specific?"
        );
    } else if (isDefined(action)) {
        handleDialogflowAction(sender, action, responseText, contexts, parameters);
    } else if (isDefined(responseData) && isDefined(responseData.facebook)) {
        try {
            console.log("Response as formatted message" + responseData.facebook);
            sendTextMessage(sender, responseData.facebook);
        } catch (err) {
            sendTextMessage(sender, err.message);
        }
    } else if (isDefined(responseText)) {
        sendTextMessage(sender, responseText);
    }
}
*/

/*
// callSendAPI
const callSendAPI = async (messageData) => {
 
const url = "https://graph.facebook.com/v3.0/me/messages?access_token=" + process.env.PAGE_ACCESS_TOKEN;
  await axios.post(url, messageData)
    .then(function (response) {
      if (response.status == 200) {
        var recipientId = response.data.recipient_id;
        var messageId = response.data.message_id;
        if (messageId) {
          console.log(
            "Successfully sent message with id %s to recipient %s",
            messageId,
            recipientId
          );
        } else {
          console.log(
            "Successfully called Send API for recipient %s",
            recipientId
          );
        }
      }
    })
    .catch(function (error) {
      console.log(error.response.headers);
    });
}

// Send text
const sendTextMessage = async (recipientId, text) => {
    sendTypingOff(sender_psid); // Show that bot is typing on Messenger
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            text: text
        }
    };
    await callSendAPI(messageData);
}
*/

/*
function handleDialogflowAction(sender, action, responseText, contexts, parameters) {
    switch (action) {
        case "send-text":
            var responseText = "This is example of Text message.";
            sendTextMessage(sender, responseText);
            break;
        case "find_store":
            var responseText = "here is some stuff for you.";
            sendTextMessage(sender, responseText);
            break;
        default:
            //unhandled action, just send back the text
            var responseText = "Sorry, I don't understand what you said.";
            sendTextMessage(sender, responseText);
    }
}
*/

/* ======================================================================== */

/*
 * https://developers.facebook.com/docs/messenger-platform/getting-started/quick-start#starter
 * 1) Stub out handler functions
 * 2) Get the sender's page-scoped ID
 * 3) Parse the webhook event type
 * 4) Handle text messages
 * 5) Send a message with the Send API
 * 6) Handle attachments
 * 7) Send a structured message
 * 8) Handle postbacks
 */

// Handles messages events
function handleMessage(sender_psid, received_message) {
    // sendTypingOn(sender_psid); // Show that bot is typing on Messenger
    let response;

    // Check if the message contains text
    if (received_message.text) {    
        if (received_message.text === "Find a store"){
            response = {
                "text": `Please send your location.`,
                "quick_replies":[
                    {"content_type":"location","payload":"SENT_LOCATION","title":"Send Location"},
                ]
            }
        } else {
            // Create the payload for a basic text message
            response = {
                "text": `You sent the message: "${received_message.text}". Now send me an image!`
            }
        }

    // Check if the message contains an attachment
    } else if (received_message.attachments) {
        // Gets the URL of the message attachment
        let attachment_url = received_message.attachments[0].payload.url;
        if (received_message.attachments[0].payload.coordinates){
            // response = { "text": `Location coordinates = ${received_message.attachments[0].payload.coordinates}` };
            response = { "text": "The closest store to you is Wegmans Store #22 at Calkins Road." };
        } else {
            response = {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "generic",
                        "elements": [{
                            "title": "Is this the right picture?",
                            "subtitle": "Tap a button to answer.",
                            "image_url": attachment_url,
                            "buttons": [
                                {
                                    "type": "postback",
                                    "title": "Yes!",
                                    "payload": "yes",
                                },
                                {
                                    "type": "postback",
                                    "title": "No!",
                                    "payload": "no",
                                }
                            ],
                        }]
                    }
                }
            }
        }
    } 

    // Sends the response message
    callSendAPI(sender_psid, response);    
    // sendTextMessage(response);
}

// Handles messaging_postbacks events
function handlePostback(sender_psid, received_postback) {
    let response;

    // Get the payload for the postback
    let payload = received_postback.payload;

    // Set the response based on the postback payload
    if (payload === 'yes') {
        response = { "text": "Thanks!" };
    } else if (payload === 'no') {
        response = { "text": "Oops, try sending another image." };
    } else if (payload === 'SENT_LOCATION') {
        // response = { "text": `Location coordinates = ${payload.coorindates}` };
        response = { "text": "The closest store to you is Wegmans Store #22 at Calkins Road." };
    }
    // sendTextMessage(response);
    // Send the message to acknowledge the postback
    callSendAPI(sender_psid, response);
}

// Sends response messages via the Send API
function callSendAPI(sender_psid, response) {
    // sendTypingOff(sender_psid);
    // Construct the message body
    let request_body = {
        "recipient": {
            "id": sender_psid
        },
        "message": response
    }

    // Send the HTTP request to the Messenger Platform
    request({
        "uri": "https://graph.facebook.com/v2.6/me/messages",
        "qs": { "access_token": process.env.PAGE_ACCESS_TOKEN },
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        if (!err) {
            console.log('message sent!')
        } else {
            console.error("Unable to send message:" + err);
        }
    });
}
