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
const {
  usermessage,
  usermessagewithdes,
} = require("../functions/message-fuctions");
module.exports = {
  name: "interactionCreate",
  once: false,

  async execute(interaction, client) {
    if (!interaction.isButton()) return;

    if (interaction.customId == "ticket.create") {
      const result = await kontrol(interaction);
      if (result == 1) {
        try {
          db.delete(interaction.guild.id + "-ticket-system");
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
        try {
          if (
            db.get(`${interaction.guild.id}.${interaction.user.id}-aktifticket`)
          ) {
            const kanal = interaction.guild.channels.cache.has(
              db.fetch(
                `${interaction.guild.id}.${interaction.user.id}-aktifticket.channelid`
              )
            );
            if (!kanal) {
              db.delete(
                `${interaction.guild.id}.${interaction.user.id}-aktifticket`
              );
              controltimeout();
              return;
            } else {
              const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setLabel("Go To Channel!")
                  .setURL(
                    `https://discord.com/channels/${
                      interaction.guild.id
                    }/${db.fetch(
                      `${interaction.guild.id}.${interaction.user.id}-aktifticket.channelid`
                    )}`
                  )
                  .setStyle(ButtonStyle.Link)
              );
              const mesajembed = new EmbedBuilder()
                .setColor("2B2D31")
                .setTitle("Usage Blocked!")
                .setDescription(
                  "You already have a ticket channel, <#" +
                    db.fetch(
                      `${interaction.guild.id}.${interaction.user.id}-aktifticket.channelid`
                    ) +
                    ">"
                );
              interaction.reply({
                embeds: [mesajembed],
                components: [row],
                ephemeral: true,
              });
              return;
            }
          } else {
            controltimeout();
            return;
          }
        } catch {}
        async function controltimeout() {
          const veriler = await verial(interaction);
          const usertimeout = await db.get(
            `${interaction.guild.id}.tickettimeouts.timeout-${interaction.user.id}`
          );
          if (!usertimeout) {
            main();
          } else {
            const servertickettimeout = veriler.tickettimeout;
            const usertime = await db.get(
              `${interaction.guild.id}.tickettimeouts.timeout-${interaction.user.id}.creationtime`
            );
            const now = new Date();
            const suan = now.getTime();
            if (suan > usertime + servertickettimeout) {
              main();
            } else {
              const olmasıgerekntime = usertime + servertickettimeout;
              usermessagewithdes(
                "Usage Blocked!",
                `You cannot open a new ticket at this time because you have recently opened a ticket. Time remaining until you can open a ticket: <t:${Math.floor(
                  olmasıgerekntime / 1000
                )}:R>`,
                interaction
              );
              return;
            }
          }
        }
        async function main() {
          const modal = new ModalBuilder()
            .setCustomId("ticket.open.modal")
            .setTitle("R-T Ticket");
          const des = new TextInputBuilder()
            .setCustomId("ticket.open.modal.des")
            .setLabel("Why are you opening the ticket?")
            .setRequired(true)
            .setMaxLength(1024)
            .setStyle(TextInputStyle.Paragraph);
          const ard = new ActionRowBuilder().addComponents(des);
          modal.addComponents(ard);
          await interaction.showModal(modal);
        }
      }
    }
  },
};
