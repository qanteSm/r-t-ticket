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
exports.sendchannelmessage = async function (kanal, messagecomponents) {
  try {
    kanal.send(messagecomponents);
  } catch (err) {
    console.log(err);
  }
};

exports.checkPermissions = async function (guild, channel, user) {
  try {
    const member = await guild.members.fetch(user);
    const channelPermissions = channel.permissionsFor(member);

    const canViewChannel = channelPermissions.has(
      PermissionsBitField.Flags.ViewChannel
    );
    const canSendMessages = channelPermissions.has(
      PermissionsBitField.Flags.SendMessages
    );

    return {
      canViewChannel,
      canSendMessages,
    };
  } catch (error) {
    console.error("İzin kontrolünde hata:", error);
    return {
      canViewChannel: false,
      canSendMessages: false,
    };
  }
};
