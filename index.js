const { Client, Collection, GatewayIntentBits, Partials,ActivityType } = require("discord.js");
const { EmbedBuilder, PermissionsBitField, PermissionFlagsBits,ActionRowBuilder,ButtonBuilder,ButtonStyle } = require("discord.js");
const client = new Client({intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildEmojisAndStickers, GatewayIntentBits.GuildIntegrations, GatewayIntentBits.GuildWebhooks, GatewayIntentBits.GuildInvites, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMessageTyping, GatewayIntentBits.DirectMessages, GatewayIntentBits.DirectMessageReactions, GatewayIntentBits.DirectMessageTyping, GatewayIntentBits.MessageContent], shards: "auto", partials: [Partials.Message, Partials.Channel, Partials.GuildMember, Partials.Reaction, Partials.GuildScheduledEvent, Partials.User, Partials.ThreadMember]});
const { prefix, owner, token } = require("./config.js");
const { readdirSync } = require("fs")
const moment = require("moment");
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const db = require("croxydb")
client.commands = new Collection()

const rest = new REST({ version: '10' }).setToken(token);

const log = l => { console.log(`[${moment().format("DD-MM-YYYY HH:mm:ss")}] ${l}`) };

//command-handler
const commands = [];
const commandFiles = readdirSync('./src/commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./src/commands/${file}`);
  commands.push(command.data.toJSON());
  client.commands.set(command.data.name, command);
}
let activities = [ `R-T Ticket - /help, rt!help`, `${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0).toLocaleString()} Kişiye Hizmet Veriyorum!`,`${client.guilds.cache.size} Sunucuya Hizmet Veriyorum!` ], i = 0;

client.on("ready", async () => {
        try {
            await rest.put(
                Routes.applicationCommands(client.user.id),
                { body: commands },
            );
        } catch (error) {
            console.error(error);
        }
    log(`${client.user.username} Aktif Edildi!`);
    
        /*client.user.setPresence({
            status: 'idle',
        })*/
})
client.on('messageCreate', async message => {
  

    if (message.content.startsWith(prefix)) {
        const args = message.content.split(' ');
        const command = args[1];
        if(command == "setdc"||command == "setdiscord"){
            if(message.author.id == owner){
                const invite = args[2];
                db.set("rt.discord", invite)
            }
        }
    }
})
//event-handler
const eventFiles = readdirSync('./src/events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const event = require(`./src/events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

const eventFiles2 = readdirSync('./src/ticket-events').filter(file => file.endsWith('.js'));

for (const file of eventFiles2) {
	const event = require(`./src/ticket-events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}
//
process.on('uncaughtException', (error) => {
    console.error('Yakalanmamış Hata:', error);
  });
//------------------------------------ LOGS ---------------------------------------------- //

  
client.login(token)
