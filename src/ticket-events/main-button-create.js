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
    if (!interaction.isModalSubmit()) return;

    if (interaction.customId == "ticket.open.modal") {
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
            db.get(
              `${interaction.guild.id}.ticket-system.tickets.${interaction.user.id}-aktifticket`
            )
          ) {
            const kanal = interaction.guild.channels.cache.has(
              db.fetch(
                `${interaction.guild.id}.ticket-system.tickets.${interaction.user.id}-aktifticket.channelid`
              )
            );
            if (!kanal) {
              db.delete(
                `${interaction.guild.id}.${interaction.user.id}-ticket`
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
                      `${interaction.guild.id}.ticket-system.tickets.${interaction.user.id}-aktifticket.channelid`
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
                      `${interaction.guild.id}.ticket-system.tickets.${interaction.user.id}-aktifticket.channelid`
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
            `${interaction.guild.id}.ticket-system.tickettimeouts.timeout-${interaction.user.id}`
          );
          if (!usertimeout) {
            main();
          } else {
            const servertickettimeout = veriler.tickettimeout;
            const usertime = await db.get(
              `${interaction.guild.id}.ticket-system.tickettimeouts.timeout-${interaction.user.id}.creationtime`
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
          try {
            const des = interaction.fields.getTextInputValue(
              "ticket.open.modal.des"
            );
            const veriler = await verial(interaction);
            const kategori = veriler.ticketopenedcategory;
            const ticketgörevlisirolid = veriler.panelyetkili;
            interaction.guild.channels
              .create({
                name: "ticket-" + interaction.user.username + "",
                type: ChannelType.GuildText,
                parent: kategori,
                topic: "**" + interaction.user.username + "**'s Ticket",
                permissionOverwrites: [
                  {
                    id: "" + interaction.user.id + "",
                    allow: [
                      PermissionsBitField.Flags.ViewChannel,
                      PermissionsBitField.Flags.SendMessages,
                    ],
                  },
                  {
                    id: "" + ticketgörevlisirolid + "",
                    allow: [
                      PermissionsBitField.Flags.ViewChannel,
                      PermissionsBitField.Flags.SendMessages,
                    ],
                  },
                  {
                    id: "" + interaction.guild.roles.everyone.id + "",
                    deny: [
                      PermissionsBitField.Flags.ViewChannel,
                      PermissionsBitField.Flags.SendMessages,
                    ],
                  },
                ],
              })
              .then((channel) => {
                const row2 = new ActionRowBuilder().addComponents(
                  new ButtonBuilder()
                    .setLabel("Go To Channel!")
                    .setURL(
                      `https://discord.com/channels/${interaction.guild.id}/${channel.id}`
                    )
                    .setStyle(ButtonStyle.Link)
                );
                const mesajembed2 = new EmbedBuilder()
                  .setColor("2B2D31")
                  .setTitle("Create a Ticket Successfully!")
                  .setDescription(
                    "You have successfully created your ticket, you can go to the channel by clicking the button below, <#" +
                      channel.id +
                      ">"
                  );
                interaction.reply({
                  embeds: [mesajembed2],
                  components: [row2],
                  ephemeral: true,
                });
                const row = new ActionRowBuilder().addComponents(
                  new ButtonBuilder()
                    .setCustomId("ticket.close")
                    .setLabel("Close Ticket")
                    .setEmoji("✖️")
                    .setStyle(ButtonStyle.Danger)
                );
                const now = new Date();

                const suan = now.getTime();
                const mesajembed = new EmbedBuilder()
                  .setColor("2B2D31")
                  .setTitle("Welcome To Ticket")
                  .addFields(
                    {
                      name: "Creation Time",
                      value: `<t:${Math.floor(suan / 1000)}:R>`,
                      inline: true,
                    },
                    {
                      name: "Ticket Owner",
                      value: `<@${interaction.user.id}>`,
                      inline: true,
                    },
                    {
                      name: "Reason for closing the ticket",
                      value: "```" + des + "```",
                      inline: false,
                    }
                  )
                  .setThumbnail(interaction.guild.iconURL())
                  .setDescription(
                    "Hello **" +
                      interaction.user.username +
                      "**, Our support team will contact you shortly."
                  );
                channel
                  .send({
                    content:
                      "||<@" +
                      interaction.user.id +
                      "> & <@&" +
                      ticketgörevlisirolid +
                      ">||   ",
                    embeds: [mesajembed],
                    components: [row],
                  })
                  .then((messagemodal) => {
                    const dblot = `${interaction.guild.id}.ticket-system.tickets.${interaction.user.id}-aktifticket`;
                    db.set(dblot + ".channelid", channel.id);
                    db.set(dblot + ".ownerid", interaction.user.id);
                    db.set(dblot + ".creationtime", suan);
                    db.set(dblot + ".durum", "1");
                    db.set(dblot + ".messageid", messagemodal.id);
                    const channellot = `${interaction.guild.id}.ticket-system.tickets.ticket-${channel.id}`;
                    db.set(channellot + ".channelid", channel.id);
                    db.set(channellot + ".ownerid", interaction.user.id);
                    db.set(channellot + ".creationtime", suan);
                    db.set(channellot + ".durum", "1");
                    db.set(channellot + ".messageid", messagemodal.id);
                  });
              });
          } catch (err) {
            console.log(err);
          }
        }
      }
    }
  },
};
