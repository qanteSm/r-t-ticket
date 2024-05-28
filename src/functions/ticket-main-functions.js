const {
  EmbedBuilder,
  PermissionFlagsBits,
  ChannelType,
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
  ButtonBuilder,
  ButtonStyle,
  AttachmentBuilder,
  PermissionsBitField,
} = require("discord.js");
const db = require("croxydb");
exports.kontrol = async function (interaction) {
  const panelowner = db.fetch(
    interaction.guild.id + ".ticket-system.panelowner"
  );
  const panelcolor = db.fetch(
    interaction.guild.id + ".ticket-system.panelcolor"
  );
  const paneltitle = db.fetch(
    interaction.guild.id + ".ticket-system.paneltitle"
  );
  const paneldescription = db.fetch(
    interaction.guild.id + ".ticket-system.paneldescription"
  );
  const ticketopenedcategory = db.fetch(
    interaction.guild.id + ".ticket-system.category.opened"
  );
  const ticketclosedcategory = db.fetch(
    interaction.guild.id + ".ticket-system.category.closed"
  );
  const transcript = db.fetch(
    interaction.guild.id + ".ticket-system.transcriptchannel"
  );
  const transcriptkanal = interaction.guild.channels.cache.has(transcript);
  const panelyetkili = db.fetch(
    interaction.guild.id + ".ticket-system.panelattendant"
  );
  const panelchannel = db.fetch(
    interaction.guild.id + ".ticket-system.panelchannel"
  );
  const yetkili = interaction.guild.roles.cache.has(panelyetkili);
  const kanal = interaction.guild.channels.cache.has(panelchannel);
  const opened = interaction.guild.channels.cache.has(ticketopenedcategory);
  const closed = interaction.guild.channels.cache.has(ticketclosedcategory);
  const panelbuttonstyle = db.fetch(
    interaction.guild.id + ".ticket-system.panelbutton.style"
  );
  const panelbuttonlabel = db.fetch(
    interaction.guild.id + ".ticket-system.panelbutton.label"
  );
  if (
    !panelowner ||
    !panelcolor ||
    !panelchannel ||
    !panelbuttonstyle ||
    !panelbuttonlabel ||
    !panelyetkili ||
    !yetkili ||
    !kanal ||
    !ticketclosedcategory ||
    !ticketopenedcategory ||
    !opened ||
    !closed ||
    !paneltitle ||
    !paneldescription ||
    !transcript ||
    !transcriptkanal
  ) {
    console.log(
      panelbuttonlabel,
      panelbuttonstyle,
      panelchannel,
      panelcolor,
      panelowner,
      panelyetkili,
      ticketclosedcategory,
      ticketopenedcategory,
      yetkili,
      kanal,
      opened,
      closed
    );
    return 1;
  } else {
    return 2;
  }
};
exports.verial = async function (interaction) {
  const panelowner = db.fetch(
    interaction.guild.id + ".ticket-system.panelowner"
  );
  const panelcolor = db.fetch(
    interaction.guild.id + ".ticket-system.panelcolor"
  );
  const paneltitle = db.fetch(
    interaction.guild.id + ".ticket-system.paneltitle"
  );
  const paneldescription = db.fetch(
    interaction.guild.id + ".ticket-system.paneldescription"
  );
  const ticketopenedcategory = db.fetch(
    interaction.guild.id + ".ticket-system.category.opened"
  );
  const ticketclosedcategory = db.fetch(
    interaction.guild.id + ".ticket-system.category.closed"
  );
  const panelyetkili = db.fetch(
    interaction.guild.id + ".ticket-system.panelattendant"
  );
  const panelchannel = db.fetch(
    interaction.guild.id + ".ticket-system.panelchannel"
  );
  const transcriptchannel = db.fetch(
    interaction.guild.id + ".ticket-system.transcriptchannel"
  );
  const yetkili = interaction.guild.roles.cache.has(panelyetkili);
  const kanal = interaction.guild.channels.cache.has(panelchannel);
  const opened = interaction.guild.channels.cache.has(ticketopenedcategory);
  const closed = interaction.guild.channels.cache.has(ticketclosedcategory);
  const panelbuttonstyle = db.fetch(
    interaction.guild.id + ".ticket-system.panelbutton.style"
  );
  const panelbuttonlabel = db.fetch(
    interaction.guild.id + ".ticket-system.panelbutton.label"
  );
  return {
    panelbuttonlabel,
    panelbuttonstyle,
    panelchannel,
    panelcolor,
    panelowner,
    panelyetkili,
    ticketclosedcategory,
    ticketopenedcategory,
    yetkili,
    kanal,
    opened,
    closed,
    paneltitle,
    paneldescription,
    transcriptchannel,
  };
};
