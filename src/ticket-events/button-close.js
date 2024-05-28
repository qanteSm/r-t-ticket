const { EmbedBuilder, PermissionFlagsBits, ChannelType, ModalBuilder, ActionRowBuilder, TextInputBuilder, ComponentType,TextInputStyle, ButtonBuilder, ButtonStyle, AttachmentBuilder, PermissionsBitField } = require('discord.js');
const db = require("croxydb");
const { kontrol, verial } = require('../functions/ticket-main-functions');
const { usermessage } = require('../functions/message-fuctions');
module.exports = {
    name: 'interactionCreate',
    once: false,

    async execute(interaction, client) {
        if (!interaction.isButton()) return;
    
        if(interaction.customId == "ticket.close" ){
            const result = await kontrol(interaction);
            if(result == 1){
                try{
                  usermessage("Please use the /ticket-setup command again.", interaction)
                  return;
                } catch {
                  usermessage("An issue occurred, please try again later!", interaction)
                  return;
                }
              } else {
                const veriler = await verial(interaction);
                if(!interaction.member.roles.cache.has(veriler.panelyetkili)){
                    usermessage("You don't have enough authority!",interaction)
                    return;
                }
                const modal = new ModalBuilder()
                    .setCustomId('ticket.close.modal')
                    .setTitle('R-T Ticket');
                const des = new TextInputBuilder()
                    .setCustomId('ticket.close.modal.des')
                    .setLabel("Why are you closing the ticket?")
                    .setRequired(true)
                    .setMaxLength(1024)
                    .setStyle(TextInputStyle.Paragraph);
                    const ard = new ActionRowBuilder().addComponents(des);
                    modal.addComponents(ard);
		            await interaction.showModal(modal);    
              }
            
        }
    }
}