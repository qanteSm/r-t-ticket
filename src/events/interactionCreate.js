
const { readdirSync } = require("fs");
const { owner } = require("../../config.js");
const commandFiles = readdirSync('./src/commands').filter(file => file.endsWith('.js'));
const {
  InteractionType,
  EmbedBuilder,
  PermissionFlagsBits,
  ChannelType,
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  ComponentType,
  TextInputStyle,
  ButtonBuilder,
  ButtonStyle,
  AttachmentBuilder,
  PermissionsBitField,
} = require('discord.js')
const db = require('croxydb')
const { kontrol, verial } = require('../functions/ticket-main-functions')
const { usermessage,usermessagewithdes } = require('../functions/message-fuctions')
const discordTranscripts = require('discord-html-transcripts')
const date = new Date()
const year = date.getFullYear()
const month = String(date.getMonth() + 1).padStart(2, '0')
const day = String(date.getDate()).padStart(2, '0')
const hour = String(date.getHours()).padStart(2, '0')
const minute = String(date.getMinutes()).padStart(2, '0')

const formattedDate = `${year}/${month}/${day} ${hour}:${minute}`
 module.exports = {
	name: 'interactionCreate',
	execute: async(interaction) => {
  let client = interaction.client;
   if (interaction.type != InteractionType.ApplicationCommand) return;
   if(interaction.user.bot) return;
   try{
    const userId = interaction.user.id;
    const commandName = interaction.commandName;
    const now = Date.now();
    if (await db.get(`general.timeouts.command-use-timeout.${interaction.user.id}.date`)){
        if (now > await db.get(`general.timeouts.command-use-timeout.${interaction.user.id}.date`) + 5000){
            
            await db.set(`general.timeouts.command-use-timeout.${interaction.user.id}.date`,now)
        } else {
            const olmasıgerekntime = await db.get(`general.timeouts.command-use-timeout.${interaction.user.id}.date`) + 5000
            usermessagewithdes(
                "Usage Blocked!",
                `You use commands very fast, you can use commands every 5 seconds. Time left before you can use the commands: <t:${Math.floor(
                  olmasıgerekntime / 1000
                )}:R>`,interaction)
                return;
        }
    } else {
        console.log("c")
        await db.set(`general.timeouts.command-use-timeout.${interaction.user.id}.date`,now)
    }
    for (const file of commandFiles) {
      const command = require(`../../src/commands/${file}`);
      if(interaction.commandName.toLowerCase() === command.data.name.toLowerCase()) {
      command.run(client, interaction)
  }
}
} catch {

}
	
  }}
