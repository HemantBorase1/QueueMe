// For development, we'll mock the SMS functionality
// In production, you would use Twilio or another service

const sendSMS = async (to, message) => {
  try {
    // Mock implementation for development
    console.log(`SMS to ${to}: ${message}`);
    
    // Uncomment for Twilio integration
    /*
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = require('twilio')(accountSid, authToken);
    
    await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to
    });
    */
     
    return true;
  } catch (error) {
    console.error('SMS sending failed:', error);
    return false;
  }
};

module.exports = { sendSMS };