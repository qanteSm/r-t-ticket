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

exports.usermessage = async function (message, interaction) {
  const mesajembed = new EmbedBuilder().setColor("2B2D31").setTitle(message);
  interaction.reply({ embeds: [mesajembed], ephemeral: true });
};

exports.updatemessage = async function (message, interaction) {
    const mesajembed = new EmbedBuilder().setColor("2B2D31").setTitle(message);
    interaction.update({ embeds: [mesajembed] });
  };

exports.usermessagewithdes = async function (
  message,
  description,
  interaction
) {
  const mesajembed = new EmbedBuilder()
    .setColor("2B2D31")
    .setTitle(message)
    .setDescription(description);
  interaction.reply({ embeds: [mesajembed], ephemeral: true });
};

exports.usermessagewitlinkbutton = async function (
  message,
  buttonlabel,
  linkMESSAGE,
  interaction
) {
  const cancel = new ButtonBuilder()

    .setLabel(buttonlabel)
    .setURL(linkMESSAGE)
    .setStyle(ButtonStyle.Link);

  const row = new ActionRowBuilder().addComponents(cancel);
  const mesajembed = new EmbedBuilder().setColor("2B2D31").setTitle(message);
  interaction.reply({
    embeds: [mesajembed],
    ephemeral: true,
    components: [row],
  });
};
