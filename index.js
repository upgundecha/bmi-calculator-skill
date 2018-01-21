"use strict";

var Alexa = require("alexa-sdk");
var request = require("request");
var APP_ID = undefined;

var handlers = {
    "CalculateBmi": function () {
        if (this.event.request.dialogState === 'STARTED' || this.event.request.dialogState === "IN_PROGRESS") {
            let updatedIntent = this.event.request.intent;
            this.emit(':delegate', updatedIntent);
        } else if (this.event.request.dialogState !== 'COMPLETED'){
            this.emit(':delegate');
        } else {
            var height = this.event.request.intent.slots.height.value;
            var weight = this.event.request.intent.slots.weight.value
            const self = this;
            var options = {
                url: `https://356j984kve.execute-api.us-east-1.amazonaws.com/prod/bmi`,
                json: {
                    height: height,
                    weight: weight
                }
               };
              request.post(options, function(error, response, body){
                self.response.speak(`Your BMI index is ${body.bmi}. You're ${body.category}`)
                self.emit(':responseReady');
              })
        }
    },
    "LaunchRequest": function () {
        this.response.speak("Welcome to Bmi Calculator"); 
        this.emit(':responseReady');
    },
    "SessionEndedRequest": function() {
		this.emit("AMAZON.StopIntent");
	},
    'Unhandled': function () {
        this.emit(':ask', HELP_MESSAGE, WELCOME_REPROMPT);
    }
};

exports.handler = function(event, context, callback){
  var alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};