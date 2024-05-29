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

    if (interaction.customId == "ticket.reopen") {
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
        try {
          const veriler = await verial(interaction);
          if (!interaction.member.roles.cache.has(veriler.panelyetkili)) {
            usermessage("You don't have enough authority!", interaction);
            return;
          }
          if (
            
            (await db.get(
              `${interaction.guild.id}.ticket-system.tickets.ticket-${interaction.channel.id}.durum`
            )) != "0"
          ) {
            usermessage("Bu kanal kapalı değil!", interaction);
            return;
          }
          const addedusers =
            (await db.get(
              `${interaction.guild.id}.ticket-system.tickets.ticket-${interaction.channel.id}.addedusers`
            )) || [];
          const kullanıcı = interaction.guild.members.cache.get(
            db.fetch(
              `${interaction.guild.id}.ticket-system.tickets.ticket-${interaction.channel.id}.ownerid`
            )
          );
          if (
            interaction.guild.channels.cache.has(
              await db.fetch(
                `${interaction.guild.id}.ticket-system.tickets.${kullanıcı.id}-aktifticket.channelid`
              )
            )
          ) {
            const row = new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setLabel("Go To Channel!")
                .setURL(
                  `https://discord.com/channels/${
                    interaction.guild.id
                  }/${db.fetch(
                    `${interaction.guild.id}.ticket-system.tickets.${kullanıcı.id}-aktifticket.channelid`
                  )}`
                )
                .setStyle(ButtonStyle.Link)
            );
            const mesajembed = new EmbedBuilder()
              .setColor("2B2D31")
              .setTitle("Usage Blocked!")
              .setDescription(
                "User already have a ticket channel, <#" +
                  db.fetch(
                    `${interaction.guild.id}.ticket-system.tickets.${kullanıcı.id}-aktifticket.channelid`
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
          if (addedusers.length === 0) {
            nonaddedusers();
          } else {
            console.log("a")
          }
          async function nonaddedusers() {
            interaction.channel.permissionOverwrites
              .set([
                {
                  id: "" + kullanıcı.id + "",
                  allow: [
                    PermissionsBitField.Flags.ViewChannel,
                    PermissionsBitField.Flags.SendMessages,
                  ],
                },
                {
                  id: "" + veriler.panelyetkili + "",
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
              ])
              .then(() => {
                const dblot = `${interaction.guild.id}.ticket-system.tickets.${kullanıcı.id}-aktifticket`;
                const dblot2 = `${interaction.guild.id}.ticket-system.tickets.ticket-${interaction.channel.id}`;
                db.set(dblot + ".channelid", db.fetch(dblot2 + ".channelid"));
                db.set(dblot + ".ownerid", db.fetch(dblot2 + ".ownerid"));
                db.set(dblot + ".durum", "1");
                db.set(
                  dblot + ".creationtime",
                  db.fetch(dblot2 + ".creationtime")
                );
                db.set(dblot2 + ".durum", "1");
                const embed = interaction.message.embeds[0];
                embed.fields.splice(-1, 1);
                const row = new ActionRowBuilder().addComponents(
                  new ButtonBuilder()
                    .setCustomId("ticket.close")
                    .setLabel("Close Ticket")
                    .setEmoji("✖️")
                    .setStyle(ButtonStyle.Danger)
                );
                interaction
                  .update({ embeds: [embed], components: [row] })
                  .then(() => {
                    const mesajembed = new EmbedBuilder()
                      .setColor("2B2D31")
                      .setAuthor({
                        name: "" + kullanıcı.user.globalName,
                        iconURL: `${kullanıcı.displayAvatarURL({
                          dynamic: true,
                          size: 1024,
                        })}`,
                      })
                      .setDescription(
                        "Your Ticket Channel was reopened by <@" +
                          interaction.user.id +
                          ">"
                      );
                    const row = new ActionRowBuilder().addComponents(
                      new ButtonBuilder()
                        .setLabel("Go To Channel!")
                        .setURL(
                          `https://discord.com/channels/${
                            interaction.guild.id
                          }/${db.fetch(
                            `${interaction.guild.id}.ticket-system.tickets.${kullanıcı.id}-aktifticket.channelid`
                          )}`
                        )
                        .setStyle(ButtonStyle.Link)
                    );
                    const chanelmessage = new EmbedBuilder()
                      .setColor("2B2D31")
                      .setTitle("Channel Re-opened")
                      .setDescription(
                        "Channel Re-opened by <@" + interaction.user.id + ">"
                      );
                    interaction.channel.send({ embeds: [chanelmessage] });
                    try {
                      kullanıcı.send({
                        embeds: [mesajembed],
                        components: [row],
                      });
                      console.log("Mesaj başarıyla gönderildi.");
                    } catch (error) {
                      console.error("Mesaj gönderilirken hata oluştu:", error);
                    }
                  });
              });
          }
        } catch (err) {
          console.log(err);
          usermessage("Bir sorun oluştu!", interaction);
        }
      }
    }
  },
};
