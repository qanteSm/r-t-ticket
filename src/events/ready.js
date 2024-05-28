const { GatewayIntentBits, ActivityType } = require("discord.js")
module.exports = {
	name: 'ready',	
	once: true,
	execute(client) {
		let activities = [ `Santa Maria - V1`,`R-T Ticket - /help or rt!help`, `Currently serving ${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0).toLocaleString()} person!`,`Currently serving ${client.guilds.cache.size} servers!` ], i = 0;
    setInterval(() => client.user.setActivity({ name: `${activities[i++ % activities.length]}`, type: ActivityType.Playing }), 10000);
	
}};
