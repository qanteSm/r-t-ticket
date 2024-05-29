const {
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
} = require("discord.js");
const db = require("croxydb");
const { kontrol, verial } = require("../functions/ticket-main-functions");
const { usermessage } = require("../functions/message-fuctions");
const discordTranscripts = require("discord-html-transcripts");
const date = new Date();
const year = date.getFullYear();
const month = String(date.getMonth() + 1).padStart(2, "0");
const day = String(date.getDate()).padStart(2, "0");
const hour = String(date.getHours()).padStart(2, "0");
const minute = String(date.getMinutes()).padStart(2, "0");

const formattedDate = `${year}/${month}/${day} ${hour}:${minute}`;
module.exports = {
  name: "interactionCreate",
  once: false,

  async execute(interaction, client) {
    if (!interaction.isButton()) return;

    if (interaction.customId == "ticket.delete") {
      const result = await kontrol(interaction);
      if (result == 1) {
        try {
          usermessage(
            "Please use the /ticket-setup command again.",
            interaction
          );
          return;
        } catch {
          usermessage(
            "An issue occurred, please try again later!",
            interaction
          );
          return;
        }
      } else {
        const veriler = await verial(interaction);
        if (!interaction.member.roles.cache.has(veriler.panelyetkili)) {
          usermessage("You don't have enough authority!", interaction);
          return;
        }
        const yes = new ButtonBuilder()
          .setCustomId("ticket.delete.yes")
          .setLabel("Evet")
          .setStyle(ButtonStyle.Success);
        const no = new ButtonBuilder()
          .setCustomId("ticket.delete.no")
          .setLabel("Hayır")
          .setStyle(ButtonStyle.Danger);
        const row = new ActionRowBuilder().addComponents(yes,no);
        const mesajembed = new EmbedBuilder()
          .setColor("2B2D31")
          .setTitle("Ticketi gerçekten silmek istiyor musunuz?");
        interaction.channel.send({
          content: "<@"+interaction.user.id+">",
          embeds: [mesajembed],
          components: [row],
        }).then((message) => {
          console.log(message)
          console.log(message.id)
          db.set(`${interaction.guild.id}.reqs.close-ticket-${message.id}.userid`,interaction.user.id)
          db.set(`${interaction.guild.id}.reqs.close-ticket-${message.id}.date`,date)
          db.set(`${interaction.guild.id}.reqs.close-ticket-${message.id}.messageid`,message.id)
          usermessage("Please click the yes or no button, the message will be deleted within 10 seconds",interaction)
          setTimeout(async () => {
            message.delete();
          }, 10000);
        })
      }
    }
  },
};
