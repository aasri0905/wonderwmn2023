const { Telegraf ,session,  Markup } = require('telegraf');
const axios = require('axios');
require('dotenv').config();
const token = process.env.TOKEN;
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;


const bot = new Telegraf(token);

const data = {};

bot.start((ctx) => {
  data[ctx.chat.id] = {};
  ctx.reply('Welcome to the bot! Please enter the destination address:');
});

bot.on('text', async (ctx) => {
  const destination = ctx.message.text;

  if (!data[ctx.chat.id].destination) {
    data[ctx.chat.id].destination = destination;
    ctx.reply('Please share your live location:');
  }
});

bot.on('location', (ctx) => {
    const { latitude, longitude } = ctx.message.location;
  
    console.log('Received Live Location:', latitude, longitude);
  
    data[ctx.chat.id].liveLocation = {
      latitude: latitude,
      longitude: longitude,
    };
  
    if (data[ctx.chat.id].destination && data[ctx.chat.id].liveLocation) {
      const destination = data[ctx.chat.id].destination;
      const liveLocation = data[ctx.chat.id].liveLocation;
  
      // Start checking for real-time updates every 1 second
      setInterval(() => {
        calculateDistance(ctx, destination, liveLocation);
      }, 10000);
    }
  });
  

async function calculateDistance(ctx, destination, liveLocation) {
    // Download the helper library from https://www.twilio.com/docs/node/install
// Set environment variables for your credentials
// Read more at http://twil.io/secure


  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/directions/json?origin=${liveLocation.latitude},${liveLocation.longitude}&destination=${encodeURIComponent(
        destination
      )}&key=${process.env.MAP}`

    );

    if (response.data.routes.length > 0) {
      const distance = response.data.routes[0].legs[0].distance.text;
      const textResponse = `Distance from your live location to ${destination}: ${distance}`;
      ctx.reply(textResponse);
    } else {
      ctx.reply('No route found for the destination.');
    }
  } catch (error) {
    console.error('Error retrieving route:', error);
    ctx.reply('Sorry, there was an error retrieving the route. Please try again.');
  }
}

bot.launch();
console.log('Bot is running...');
