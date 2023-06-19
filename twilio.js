import twilio from 'twilio';
import * as dotenv from 'dotenv';
dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

function callClient(sendMessage) {
  if (sendMessage == true) {
    twilio(accountSid, authToken)
      .messages.create({
        body: 'Your item is back in stock!', // Text you want to send to inform
        from: 'whatsapp:+14155238886', // From a valid Twilio number
        to: `whatsapp:${process.env.MY_PHONE_NUMBER}`, // Your number
      })
      .then(message => console.log(message.sid));

    return 'Message sent!';
  }

  return null;
}

export { callClient as default };
