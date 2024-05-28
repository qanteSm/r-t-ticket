const { EmbedBuilder, PermissionsBitField, PermissionFlagsBits,ActionRowBuilder,ButtonBuilder,ButtonStyle } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const db = require("croxydb");
const { usermessage, usermessagewithdes } = require("../functions/message-fuctions");
const { kontrol, verial } = require("../functions/ticket-main-functions");
const discord = db.get("rt.discord")
module.exports = {
  data: new SlashCommandBuilder()
    .setName("message-log-setup")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDescription("Set-up Message logs.")

    ,
    run: async (client, interaction) => {
        if(!interaction.member.member.permissions.has("ADMINISTRATOR")){
            usermessage("Insufficient authority!", interaction);
            return;
        }
        
    }
}