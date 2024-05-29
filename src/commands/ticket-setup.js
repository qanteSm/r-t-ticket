const {
  EmbedBuilder,
  PermissionsBitField,
  PermissionFlagsBits,
  ChannelType,
} = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const db = require("croxydb");
const { usermessage } = require("../functions/message-fuctions");
const { kontrol } = require("../functions/ticket-main-functions");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("setup-ticket")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDescription("Helps you set up a ticket system!")
    //-------------------------------------
    .addRoleOption((option) =>
      option
        .setName("ticket-attendant")
        .setDescription("Ticket Attendant Role.")
        .setRequired(true)
    )
    //-------------------------------------
    .addChannelOption((option) =>
      option
        .setName("ticket-channel")
        .addChannelTypes(ChannelType.GuildText)
        .setDescription("Ticket Message Channel.")
        .setRequired(true)
    )
    //-------------------------------------
    .addChannelOption((option) =>
      option
        .setName("transcript-channel")
        .addChannelTypes(ChannelType.GuildText)
        .setDescription("The channel where ticket messages will be saved.")
        .setRequired(true)
    )
    //-------------------------------------
    .addStringOption((option) =>
      option
        .setName("ticket-button-color")
        .setDescription("Color of the Ticket Button.")
        .setRequired(true)
        .addChoices(
          { name: "Red", value: "4" },
          { name: "Blue", value: "1" },
          { name: "Green", value: "3" },
          { name: "Grey", value: "2" }
        )
    )
    //-------------------------------------
    .addStringOption((option) =>
      option
        .setName("ticket-button-label")
        .setDescription("Ticket Button Label.")
        .setMaxLength(100)
        .setRequired(true)
    )
    //-------------------------------------
    .addStringOption((option) =>
      option
        .setName("ticket-embed-color")
        .setDescription("Color of the Ticket Embed.")
        .setRequired(true)
        .addChoices(
          { name: "Red", value: "embedcolor-red" },
          { name: "Blue", value: "embedcolor-blue" },
          { name: "Green", value: "embedcolor-green" },
          { name: "Grey", value: "embedcolor-grey" },
          { name: "Colorless", value: "embedcolor-colorless" }
        )
    )

    //-------------------------------------
    .addStringOption((option) =>
      option
        .setName("ticket-timeout")
        .setDescription("Timeout for users to open tickets again.")
        .setRequired(true)
        .addChoices(
          { name: "No Timeout", value: "0" },
          { name: "10 Min", value: "600000" },
          { name: "30 Min", value: "1800000" },
          { name: "1 Hour", value: "3600000" },
          { name: "12 Hour", value: "43200000" }
        )
    )
    //-------------------------------------
    .addChannelOption((option) =>
      option
        .setName("closed-ticket-category")
        .addChannelTypes(ChannelType.GuildCategory)
        .setDescription("Category where Ticket Channels will go when cloesed.")
        .setRequired(true)
    )
    //-------------------------------------
    .addChannelOption((option) =>
      option
        .setName("opened-ticket-category")
        .addChannelTypes(ChannelType.GuildCategory)
        .setDescription("Category where Ticket Channels will go when opened.")
        .setRequired(true)
    )
    //-------------------------------------
    .addStringOption((option) =>
      option
        .setName("embed-title")
        .setDescription("Embed Title.")
        .setMaxLength(255)
        .setRequired(true)
    )
    //-------------------------------------
    .addStringOption((option) =>
      option
        .setName("embed-description")
        .setDescription("Embed description.")
        .setMaxLength(1024)
        .setRequired(true)
    ),
  run: async (client, interaction) => {
    const sonuc = await kontrol(interaction);
    console.log(sonuc);
    if (sonuc == 1) {
      try {
        const ticketgörevlisi = interaction.options.getRole("ticket-attendant");
        const ticketkanal = interaction.options.getChannel("ticket-channel");
        const tickettimeout = interaction.options.getString("ticket-timeout");
        const buttoncolor = interaction.options.getString(
          "ticket-button-color"
        );
        const embedcolor = interaction.options.getString("ticket-embed-color");
        const buttonlabel = interaction.options.getString(
          "ticket-button-label"
        );
        const closedkanal = interaction.options.getChannel(
          "closed-ticket-category"
        );
        const openedkanal = interaction.options.getChannel(
          "opened-ticket-category"
        );
        const transcriptkanal =
          interaction.options.getChannel("transcript-channel");
        const embedtitle = interaction.options.getString("embed-title");
        const embeddescription =
          interaction.options.getString("embed-description");
        let embedcolorwrite;
        if (embedcolor == "embedcolor-red") {
          embedcolorwrite = "ff0000";
        } else if (embedcolor == "embedcolor-blue") {
          embedcolorwrite = "0000ff";
        } else if (embedcolor == "embedcolor-green") {
          embedcolorwrite = "008000";
        } else if (embedcolor == "embedcolor-grey") {
          embedcolorwrite = "808080";
        } else if (embedcolor == "embedcolor-colorless") {
          embedcolorwrite = "2B2D31";
        } else {
          embedcolorwrite = "2B2D31";
        }
        db.set(
          interaction.guild.id + ".ticket-system.tickettimeout",
          tickettimeout
        );
        db.set(
          interaction.guild.id + ".ticket-system.panelowner",
          interaction.user.id
        );
        db.set(
          interaction.guild.id + ".ticket-system.panelcolor",
          embedcolorwrite ?? "2B2D31"
        );
        db.set(interaction.guild.id + ".ticket-system.paneltitle", embedtitle);
        db.set(
          interaction.guild.id + ".ticket-system.paneldescription",
          embeddescription
        );
        db.set(
          interaction.guild.id + ".ticket-system.panelattendant",
          ticketgörevlisi.id
        );
        db.set(
          interaction.guild.id + ".ticket-system.panelbutton.style",
          buttoncolor
        );
        db.set(
          interaction.guild.id + ".ticket-system.panelchannel",
          ticketkanal.id
        );
        db.set(
          interaction.guild.id + ".ticket-system.transcriptchannel",
          transcriptkanal.id
        );
        db.set(
          interaction.guild.id + ".ticket-system.panelbutton.label",
          buttonlabel
        );
        db.set(
          interaction.guild.id + ".ticket-system.category.closed",
          closedkanal.id
        );
        db.set(
          interaction.guild.id + ".ticket-system.category.opened",
          openedkanal.id
        );
        usermessage(
          "Ticket system installation successful. To send the ticket message, use the /send-ticket-panel command.",
          interaction
        );
      } catch (err) {
        console.log(err);
        usermessage("An issue occurred, please try again later!", interaction);
      }
    } else {
      usermessage(
        "The Ticket system is already set up. If you want to delete the ticket system or change its settings, use the /help command.",
        interaction
      );
      return;
    }
  },
};
