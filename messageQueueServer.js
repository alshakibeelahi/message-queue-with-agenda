// agendaServer.js
require('dotenv').config();
const mongoose = require('mongoose');
const Agenda = require('agenda');
const emailWithNodemailer = require('./helpers/email'); //SMTP configuration using Nodemailer
const { getAllEmails, deleteEmail } = require('./modules/Email/email.service'); //Import the email service functions for email related information

const mongoConnectionString = process.env.MONGODB_CONNECTION; //Get the MongoDB connection string from the environment variables

// Create a new instance of Agenda
const agenda = new Agenda({
  db: {
    address: mongoConnectionString,
    collection: 'agendaJobs'
  }
});

// Define the job to send emails
agenda.define('send emails', async job => {
  const unsentEmails = await getAllEmails(); // Find all emails (add filtering criteria as needed)
  if (unsentEmails.length === 0) {
    console.log('No emails to send');
    return;
  }

  for (const email of unsentEmails) {
    try {
      const emailData = {
        email: email.receiver,
        subject: email.subject,
        html: email.message
      }
      await emailWithNodemailer(emailData); // Send email using Nodemailer
      await deleteEmail(email._id); // Delete the email from the database after sending
      console.log(`Email sent to ${email.receiver}`);
    } catch (error) {
      console.error(`Error sending email to ${email.receiver}:`, error);
    }
  }
});

(async function() {
  try {
    await mongoose.connect(mongoConnectionString);
    console.log('Connected to MongoDB');
    
    await agenda.start();
    console.log('Agenda started');

    // Schedule the job to run every minute
    await agenda.every('60 minute', 'send emails');
  } catch (error) {
    console.error('Error starting Agenda:', error);
    process.exit(1);
  }
})();

async function graceful(){
  await agenda.stop();
  console.log('Agenda stopped. Exiting process..');
  process.exit(0);
}

// Gracefully stop the process on SIGINT and SIGTERM signals
process.on('SIGINT', graceful);
process.on('SIGTERM', graceful);
