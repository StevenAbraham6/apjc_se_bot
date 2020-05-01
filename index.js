const axios = require('axios')
const Airtable = require('airtable')
const util = require('util')
var Promise = require('bluebird')
const Webex = require(`webex`);
var moment = require('moment-timezone');


const webex = Webex.init({
  credentials: {
    access_token: "NDNmZjcwZWYtZDZkMi00OGJjLWIzY2QtYjNiYjc5YjdlMjcxMjE2ZTNlNDEtMDU2_PF84_1eb65fdf-9643-417f-9974-ad72cae0e10f"
  }
});

Airtable.configure({
  apiKey: "keyoPw1vi0AN2TbIP"
})
 
axios.defaults.baseURL = 'https://api.ciscospark.com/v1';
axios.defaults.headers.common['Authorization'] = 'Bearer NDNmZjcwZWYtZDZkMi00OGJjLWIzY2QtYjNiYjc5YjdlMjcxMjE2ZTNlNDEtMDU2_PF84_1eb65fdf-9643-417f-9974-ad72cae0e10f';
axios.defaults.headers.post['Content-Type'] = 'application/json';

const base = Airtable.base("appg6ovHFMJF0lH6O")
const table = base("PRE")

// A function that returns a promise to resolve into the data //fetched from the API or an error
const { promisify } = require("util");
const updateTable = promisify(table.update);


/* Handler function starts here */
exports.handler = function(event, context, callback){
 var id=event.data.id;

 //change the message id here depending on details from aws function call
 axios.get('/attachment/actions/'+id)
  .then(function (response) {
    console.log(response.data.messageId)
    //return Promise.all([webex.people.get(response.data.personId),response.data.inputs.vmlist, response.data.inputs.feedback, response.data.messageId, webex.messages.remove(response.data.messageId)])
    //return Promise.all([webex.people.get(response.data.personId),response.data.inputs.vmlist, response.data.messageId, webex.messages.remove(response.data.messageId)])
    return Promise.all([webex.people.get(response.data.personId),response.data.inputs.vmlist, response.data.messageId, webex.messages.remove(response.data.messageId)])
  })
  .then(function(response){
  table.select({
    view: "Grid view",
    filterByFormula: '{SE_EMAIL} = "'+response[0].emails[0]+'"'
  }).firstPage((err, records) => {
    if (err) {
      console.error(err)
      return
    }

    var question=0
    var sendText=""
    console.log(moment.utc().format('MMMM Do YYYY, h:mm:ss a'))
    console.log(response[1])
    if(records[0].get("Q1_MESSAGE_ID")==response[2]){
      if(records[0].get("Q1_CORRECT_OPTION")==response[1])
        sendText=records[0].get("Q1_CORRECT_RESPONSE_TEXT")
      else
        sendText= records[0].get("Q1_WRONG_RESPONSE_TEXT")
      question=1
    }
    else if(records[0].get("Q2_MESSAGE_ID")==response[2]){
      if(records[0].get("Q2_CORRECT_OPTION")==response[1])
        sendText=records[0].get("Q2_CORRECT_RESPONSE_TEXT")
      else
        sendText= records[0].get("Q2_WRONG_RESPONSE_TEXT")
      question=2
    }
    else if(records[0].get("Q3_MESSAGE_ID")==response[2]){
      if(records[0].get("Q3_CORRECT_OPTION")==response[1])
        sendText=records[0].get("Q3_CORRECT_RESPONSE_TEXT")
      else
        sendText= records[0].get("Q3_WRONG_RESPONSE_TEXT")
      question=3
    }
    else if(records[0].get("Q4_MESSAGE_ID")==response[2]){
      if(records[0].get("Q4_CORRECT_OPTION")==response[1])
        sendText=records[0].get("Q4_CORRECT_RESPONSE_TEXT")
      else
        sendText= records[0].get("Q4_WRONG_RESPONSE_TEXT")
      question=4
    }
    else if(records[0].get("Q5_MESSAGE_ID")==response[2]){
      if(records[0].get("Q5_CORRECT_OPTION")==response[1])
        sendText=records[0].get("Q5_CORRECT_RESPONSE_TEXT")
      else
        sendText= records[0].get("Q5_WRONG_RESPONSE_TEXT")
      question=5
    }
    else if(records[0].get("Q6_MESSAGE_ID")==response[2]){
      if(records[0].get("Q6_CORRECT_OPTION")==response[1])
        sendText=records[0].get("Q6_CORRECT_RESPONSE_TEXT")
      else
        sendText= records[0].get("Q6_WRONG_RESPONSE_TEXT")
      question=6
    }
    else if(records[0].get("Q7_MESSAGE_ID")==response[2]){
      if(records[0].get("Q7_CORRECT_OPTION")==response[1])
        sendText=records[0].get("Q7_CORRECT_RESPONSE_TEXT")
      else
        sendText= records[0].get("Q7_WRONG_RESPONSE_TEXT")
      question=7
    }
    else if(records[0].get("Q8_MESSAGE_ID")==response[2]){
      if(records[0].get("Q8_CORRECT_OPTION")==response[1])
        sendText=records[0].get("Q8_CORRECT_RESPONSE_TEXT")
      else
        sendText= records[0].get("Q8_WRONG_RESPONSE_TEXT")
      question=8
    }
    else if(records[0].get("Q9_MESSAGE_ID")==response[2]){
      if(records[0].get("Q9_CORRECT_OPTION")==response[1])
        sendText=records[0].get("Q9_CORRECT_RESPONSE_TEXT")
      else
        sendText= records[0].get("Q9_WRONG_RESPONSE_TEXT")
      question=9
    }
    else if(records[0].get("Q10_MESSAGE_ID")==response[2]){
      if(records[0].get("Q10_CORRECT_OPTION")==response[1])
        sendText=records[0].get("Q10_CORRECT_RESPONSE_TEXT")
      else
        sendText= records[0].get("Q10_WRONG_RESPONSE_TEXT")
      question=10
    }

    //return Promise.all([response[2], updateTable(records[0].getId(), { "RATING" : response[1], "FEEDBACK": response[2], "Q10_STATUS": "ANSWERED", "Q10_ANSWER_DATE": moment.utc().format('MMMM Do YYYY, h:mm:ss a')})])           

        
    switch(question){
      case 1:
        return Promise.all([webex.messages.create({text: "", toPersonEmail: response[0].emails[0], attachments: [{"contentType": "application/vnd.microsoft.card.adaptive","content": JSON.parse(sendText)}]}), response[2], updateTable(records[0].getId(), { "Q1_ANSWER" : response[1], "Q1_STATUS": "ANSWERED", "Q1_ANSWER_DATE": moment().tz(records[0].get("TIMEZONE")).format("MMMM Do YYYY, h:mm:ss a")})])
      case 2:
        return Promise.all([webex.messages.create({text: "", toPersonEmail: response[0].emails[0], attachments: [{"contentType": "application/vnd.microsoft.card.adaptive","content": JSON.parse(sendText)}]}), response[2], updateTable(records[0].getId(), { "Q2_ANSWER" : response[1], "Q2_STATUS": "ANSWERED", "Q2_ANSWER_DATE": moment().tz(records[0].get("TIMEZONE")).format("MMMM Do YYYY, h:mm:ss a")})])
      case 3:
        return Promise.all([webex.messages.create({text: "", toPersonEmail: response[0].emails[0], attachments: [{"contentType": "application/vnd.microsoft.card.adaptive","content": JSON.parse(sendText)}]}), response[2], updateTable(records[0].getId(), { "Q3_ANSWER" : response[1], "Q3_STATUS": "ANSWERED", "Q3_ANSWER_DATE": moment().tz(records[0].get("TIMEZONE")).format("MMMM Do YYYY, h:mm:ss a")})])
      case 4:
        return Promise.all([webex.messages.create({text: "", toPersonEmail: response[0].emails[0], attachments: [{"contentType": "application/vnd.microsoft.card.adaptive","content": JSON.parse(sendText)}]}), response[2], updateTable(records[0].getId(), { "Q4_ANSWER" : response[1], "Q4_STATUS": "ANSWERED", "Q4_ANSWER_DATE": moment().tz(records[0].get("TIMEZONE")).format("MMMM Do YYYY, h:mm:ss a")})])
      case 5:
        return Promise.all([webex.messages.create({text: "", toPersonEmail: response[0].emails[0], attachments: [{"contentType": "application/vnd.microsoft.card.adaptive","content": JSON.parse(sendText)}]}), response[2], updateTable(records[0].getId(), { "Q5_ANSWER" : response[1], "Q5_STATUS": "ANSWERED", "Q5_ANSWER_DATE": moment().tz(records[0].get("TIMEZONE")).format("MMMM Do YYYY, h:mm:ss a")})])
      case 6:
        return Promise.all([webex.messages.create({text: "", toPersonEmail: response[0].emails[0], attachments: [{"contentType": "application/vnd.microsoft.card.adaptive","content": JSON.parse(sendText)}]}), response[2], updateTable(records[0].getId(), { "Q6_ANSWER" : response[1], "Q6_STATUS": "ANSWERED", "Q6_ANSWER_DATE": moment().tz(records[0].get("TIMEZONE")).format("MMMM Do YYYY, h:mm:ss a")})])
      case 7:
        return Promise.all([webex.messages.create({text: "", toPersonEmail: response[0].emails[0], attachments: [{"contentType": "application/vnd.microsoft.card.adaptive","content": JSON.parse(sendText)}]}), response[2], updateTable(records[0].getId(), { "Q7_ANSWER" : response[1], "Q7_STATUS": "ANSWERED", "Q7_ANSWER_DATE": moment().tz(records[0].get("TIMEZONE")).format("MMMM Do YYYY, h:mm:ss a")})])
      case 8:
        return Promise.all([webex.messages.create({text: "", toPersonEmail: response[0].emails[0], attachments: [{"contentType": "application/vnd.microsoft.card.adaptive","content": JSON.parse(sendText)}]}), response[2], updateTable(records[0].getId(), { "Q8_ANSWER" : response[1], "Q8_STATUS": "ANSWERED", "Q8_ANSWER_DATE": moment().tz(records[0].get("TIMEZONE")).format("MMMM Do YYYY, h:mm:ss a")})])
      case 9:
        return Promise.all([webex.messages.create({text: "", toPersonEmail: response[0].emails[0], attachments: [{"contentType": "application/vnd.microsoft.card.adaptive","content": JSON.parse(sendText)}]}), response[2], updateTable(records[0].getId(), { "Q9_ANSWER" : response[1], "Q9_STATUS": "ANSWERED", "Q9_ANSWER_DATE": moment().tz(records[0].get("TIMEZONE")).format("MMMM Do YYYY, h:mm:ss a")})])
      case 10:
        //return Promise.all([response[2], updateTable(records[0].getId(), { "RATING" : response[1], "FEEDBACK": response[2], "Q10_STATUS": "ANSWERED", "Q10_ANSWER_DATE": moment.utc().format('MMMM Do YYYY, h:mm:ss a')})])          
        return Promise.all([webex.messages.create({text: "", toPersonEmail: response[0].emails[0], attachments: [{"contentType": "application/vnd.microsoft.card.adaptive","content": JSON.parse(sendText)}]}), response[2], updateTable(records[0].getId(), { "Q10_ANSWER" : response[1], "Q10_STATUS": "ANSWERED", "Q10_ANSWER_DATE": moment().tz(records[0].get("TIMEZONE")).format("MMMM Do YYYY, h:mm:ss a")})])
    }
    
  })
})
.then(function(response){
  console.log(response)
})
.catch(function (error) {
  console.log(error);
});

 callback(null,event)
}


