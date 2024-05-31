const {
    EmbedBuilder,
    PermissionsBitField,
    PermissionFlagsBits,
    ActionRowBuilder,
    ButtonBuilder,
    StringSelectMenuOptionBuilder,
    StringSelectMenuBuilder,
    ButtonStyle,
  } = require('discord.js')
  const { SlashCommandBuilder } = require('@discordjs/builders')
  const db = require('croxydb')
  const {
    usermessage,
    usermessagewithdes,
    usermessagewitlinkbutton,
  } = require('../functions/message-fuctions')
  const { kontrol, verial } = require('../functions/ticket-main-functions')
  const { lstat } = require('fs')
  const { checkPermissions } = require('../functions/general-functions')
  
  const discord = db.get('rt.disco rd')
  module.exports = {
    data: new SlashCommandBuilder()
      .setName('change-ticket-settings')
      .setDMPermission(false)
      .setDescription('Allows you to add users to the ticket'),
    run: async (client, interaction) => {
      const result = await kontrol(interaction)
      if (result == 1) {
        try {
          db.delete(interaction.guild.id + '-ticket-system')
          usermessage('Please use the /ticket-setup command again.', interaction)
          return
        } catch {
          usermessage('An issue occurred, please try again later!', interaction)
          return
        }
      } else {
        try {
          const veriler = await verial(interaction)
          if (!interaction.member.roles.cache.has(veriler.panelyetkili)) {
            return
          }
          const mesajembed = new EmbedBuilder()
            .setColor("2B2D31")
            .setTitle("Change Ticket Settings")
            .setDescription("Please click on the button of the setting you want to change, the current ticket settings are as follows:")
            .addFields({name:"Ticket Time Out", value: `${(veriler.tickettimeout/1000)/60} Min.`, inline: true},
                        {name: "Panel Color", value: veriler.panelcolor === "ff0000" ? "Red" : veriler.panelcolor === "0000ff" ? "Blue" : veriler.panelcolor === "008000" ? "Green" : veriler.panelcolor === "808080" ? "Grey" : veriler.panelcolor === "2B2D31" ? "Colorless" : "Colorless" , inline: true},
                        {name: "Panel Addent", value: `<@&${veriler.panelyetkili}>`, inline: true},
                        {name: "Panel Channel", value: `<#${veriler.panelchannel}>`, inline: true},
                        {name: "Transcript Channel", value: `<#${veriler.transcriptchannel}>`, inline: true},
                        {name: "Opened Category", value: `<#${veriler.ticketopenedcategory}>`, inline: true},
                        {name: "Closed Category", value: "```"+`${interaction.guild.channels.cache.get(veriler.ticketclosedcategory).name}`+ "```", inline: true},
                        {name: "Button Color", value: "```"+(veriler.panelbuttonstyle === "1" ? "Blue" : veriler.panelbuttonstyle === "2" ? "Grey" : veriler.panelbuttonstyle === "3" ? "Green" : veriler.panelbuttonstyle === "4" ? "Red" : "Blue") + "```", inline: true},
                        {name: "Button Label", value: "```"+veriler.panelbuttonlabel+"```", inline: false},
                        {name: "Panel Title", value: "```"+veriler.paneltitle+"```", inline: false},
                        {name: "Panel Description", value: "```"+veriler.paneldescription+"```",inline: false},);
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
          interaction.reply({embeds: [mesajembed], ephemeral: true,components: [row,row1]})

        } catch (err) {
          console.log(err)
          usermessage('An error occurred', interaction)
        }
      }
    },
  }
  