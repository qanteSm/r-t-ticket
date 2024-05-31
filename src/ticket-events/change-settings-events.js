const { EmbedBuilder, PermissionFlagsBits, ChannelType, ModalBuilder, StringSelectMenuOptionBuilder,StringSelectMenuBuilder,ActionRowBuilder, TextInputBuilder, ComponentType,TextInputStyle, ButtonBuilder, ButtonStyle, AttachmentBuilder, PermissionsBitField } = require('discord.js');
const db = require("croxydb");
const { kontrol, verial } = require('../functions/ticket-main-functions');
const { usermessage } = require('../functions/message-fuctions');
module.exports = {
    name: 'interactionCreate',
    once: false,

    async execute(interaction, client) {
        if (!interaction.isStringSelectMenu()) return;
    
        if(interaction.customId == "ticket.settings.change" ){
            console.log(interaction.values[0])
            
            if(interaction.values[0] == "page1"){
              const select = new StringSelectMenuBuilder()
            .setCustomId('ticket.settings.change')
            .setPlaceholder('Select page')
            .setMaxValues(1)
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel('Page 1')
                    .setValue('page1')
                    .setDescription('A selectable option')
                    .setDefault(true),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Page 2')
                    .setValue('page2')
                    .setDescription('A selectable option'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Page 3')
                    .setValue('page3')
                    .setDescription('A selectable option'),
            );
            const row1 = new ActionRowBuilder()
			        .addComponents(select);
              const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setCustomId("ticket.settings.change.tickettimeout")
                  .setLabel("Ticket Tİmeout")
                  .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                  .setCustomId("ticket.settings.change.panelcolor")
                  .setLabel("Panel Color")
                  .setStyle(ButtonStyle.Secondary),
                  new ButtonBuilder()
                  .setCustomId("ticket.settings.change.paneladdent")
                  .setLabel("Panel Addent")
                  .setStyle(ButtonStyle.Secondary),
                  new ButtonBuilder()
                  .setCustomId("ticket.settings.change.panelchannel")
                  .setLabel("Panel channel")
                  .setStyle(ButtonStyle.Secondary),
              );
              interaction.update({components: [row,row1]})
            }else if (interaction.values[0] == "page2"){
              const select = new StringSelectMenuBuilder()
            .setCustomId('ticket.settings.change')
            .setPlaceholder('Select page')
            .setMaxValues(1)
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel('Page 1')
                    .setValue('page1')
                    .setDescription('A selectable option'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Page 2')
                    .setValue('page2')
                    .setDescription('A selectable option')
                    .setDefault(true),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Page 3')
                    .setValue('page3')
                    .setDescription('A selectable option'),
            );
            const row1 = new ActionRowBuilder()
			        .addComponents(select);
              const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setCustomId("ticket.settings.change.openedcategory")
                  .setLabel("Opened Category")
                  .setStyle(ButtonStyle.Secondary),
                  new ButtonBuilder()
                  .setCustomId("ticket.settings.change.closedcategory")
                  .setLabel("Closed Category")
                  .setStyle(ButtonStyle.Secondary),
                  new ButtonBuilder()
                  .setCustomId("ticket.settings.change.buttoncolor")
                  .setLabel("Button Color")
                  .setStyle(ButtonStyle.Secondary),
                  
                  new ButtonBuilder()
                  .setCustomId("ticket.settings.change.transcriptchannel")
                  .setLabel("Transcript channel")
                  .setStyle(ButtonStyle.Secondary),
              );
              interaction.update({components: [row,row1]})
            }else if (interaction.values[0] == "page3"){
              const select = new StringSelectMenuBuilder()
            .setCustomId('ticket.settings.change')
            .setPlaceholder('Select page')
            .setMaxValues(1)
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel('Page 1')
                    .setValue('page1')
                    .setDescription('A selectable option'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Page 2')
                    .setValue('page2')
                    .setDescription('A selectable option'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Page 3')
                    .setValue('page3')
                    .setDescription('A selectable option')
                    .setDefault(true),
            );
            const row1 = new ActionRowBuilder()
			        .addComponents(select);
              const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setCustomId("ticket.settings.change.paneltitle")
                  .setLabel("Panel Title")
                  .setStyle(ButtonStyle.Secondary),
                  new ButtonBuilder()
                  .setCustomId("ticket.settings.change.paneldes")
                  .setLabel("Panel Description")
                  .setStyle(ButtonStyle.Secondary),
                  
                  new ButtonBuilder()
                  .setCustomId("ticket.settings.change.buttonlabel")
                  .setLabel("Button Label")
                  .setStyle(ButtonStyle.Secondary),
              );
              interaction.update({components: [row,row1]})
            }
        }
    }
}