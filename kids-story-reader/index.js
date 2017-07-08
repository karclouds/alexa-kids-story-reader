/* Name: Kids Story Reader
   Author: Karmegam Pandi
   Date: July/06/2017
   Description : A very simple kids bed time story Reader service*/

'use strict';

const Alexa = require('alexa-sdk');
const ReadFile = require('read-file');

const APP_ID = 'amzn1.ask.skill.6c763cb5-18c8-46b1-b6a7-456479e03e3e'; 

const speachOutputConstants = {
            SKILL_NAME: 'Kids Story Reader',
            HELP_MESSAGE: 'What can I help you with?',
            HELP_REPROMPT: 'What can I help you with?',
            STORY_NOT_FOUND: 'Sorry, invalid story name or story not found!',
            STOP_MESSAGE: 'Goodbye!',
};

const utilities={
		'getStoryContent':function(storyName){
			var sName=storyName.replace(/\s+/g, '_').toLowerCase();
			var storyData= ReadFile.sync('stories/'+sName+'.story','utf8');
			console.log(storyData);
			return storyData;
		}
}

const handlers = {
    'LaunchRequest': function () {
        this.emit('KidsStoryReaderIntent');
    },
    'KidsStoryReaderIntent': function () {
    	//Read story name from the input
    	var storyName=this.event.request.intent.slots.StoryName.value;
    	//validate the storyName
    	if(storyName==''){
    		this.emit(':tell', speachOutputConstants.STORY_NOT_FOUND);
    	}else{
    		//Read the story from story reader utility
    		const storyContent = utilities.getStoryContent(storyName);
    		const reprompt = speachOutputConstants.HELP_MESSAGE;
    		this.emit(':tellWithCard', storyContent, speachOutputConstants.SKILL_NAME, reprompt);
    	}
    },
    'AMAZON.HelpIntent': function () {
        const speechOutput = speachOutputConstants.HELP_MESSAGE;
        const reprompt = speachOutputConstants.HELP_MESSAGE;
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', speachOutputConstants.STOP_MESSAGE);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', speachOutputConstants.STOP_MESSAGE);
    },
};

exports.handler = function (event, context) {

//prevent others calling your service
/*if (event.session.application.applicationId !== APP_ID) {
         context.fail("Invalid Application ID");
     }
*/
    const alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};
