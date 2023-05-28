
// Handler for receiving live location updates
bot.on('location', (ctx) => {
    const { latitude, longitude } = ctx.message.location;
  
    // Process the live location
    // You can perform actions or store the location data as required
    console.log('Received Live Location:', latitude, longitude);
  
    // Reply to the user
    ctx.reply('Thanks for sharing your live location!');
  });