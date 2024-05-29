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
module.exports = {
  name: "interactionCreate",
  once: false,

  async execute(interaction, client) {
    if (!interaction.isModalSubmit()) return;

    if (interaction.customId == "ticket.close.modal") {
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
          const des = interaction.fields.getTextInputValue(
            "ticket.close.modal.des"
          );
          interaction.message.embeds[0].data.fields.push({
            name: "Reason for closing the ticket",
            value: "```" + des + "```",
          });
          const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId("ticket.delete")
              .setLabel("Delete Ticket")
              .setEmoji("🗑️")
              .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
              .setCustomId("ticket.transcript")
              .setLabel("Transcript")
              .setEmoji("📝")
              .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
              .setCustomId("ticket.reopen")
              .setLabel("Re Open")
              .setEmoji("🔓")
              .setStyle(ButtonStyle.Secondary)
          );

          interaction.update({
            embeds: [interaction.message.embeds[0]],
            components: [row],
          });
          interaction.channel
            .setParent(veriler.ticketclosedcategory)
            .then(() => {
              try {
                interaction.channel.permissionOverwrites.set([
                  {
                    id: interaction.guild.roles.everyone.id,
                    deny: [PermissionsBitField.Flags.ViewChannel],
                  },
                  {
                    id: veriler.panelyetkili,
                    allow: [PermissionsBitField.Flags.ViewChannel],
                  },
                ]);
                interaction.channel.setName(
                  `closed-${interaction.channel.name.substring(7)}`
                );
                const kullanıcı = interaction.guild.members.cache.get(
                  db.fetch(
                    `${interaction.guild.id}.ticket-${interaction.channel.id}.ownerid`
                  )
                );
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
                    "Your Ticket Channel was closed by <@" +
                      interaction.user.id +
                      ">"
                  )
                  .addFields({
                    name: "Reason for closure",
                    value: "```" + des + "```",
                  });
                  try {
                    kullanıcı.send({ embeds: [mesajembed] });
                    console.log("Mesaj başarıyla gönderildi.");
                  } catch (error) {
                    console.error("Mesaj gönderilirken hata oluştu:", error);
                  
                  }

                  const chanelmessage = new EmbedBuilder()
                .setColor("2B2D31")
                .setTitle("Channel Closed")
                .setDescription("Channel Closed by <@"+ interaction.user.id+">");
                  interaction.channel.send({embeds: [chanelmessage]});
                const now = new Date();
                const suan = now.getTime();
                const timeoutlot = `${interaction.guild.id}.tickettimeouts.timeout-${kullanıcı.id}`;
                db.set(timeoutlot + ".userid", kullanıcı.id);
                db.set(timeoutlot + ".creationtime", suan);
                const dblot = `${interaction.guild.id}.${kullanıcı.id}-kapalıticket`;
                const dblot2 = `${interaction.guild.id}.ticket-${interaction.channel.id}`;
                db.set(dblot + ".channelid", db.fetch(dblot2 + ".channelid"));
                db.set(dblot + ".ownerid", db.fetch(dblot2 + ".ownerid"));
                db.set(dblot + ".durum", "0");
                db.set(dblot2 + ".durum", "0");
                db.set(
                  dblot + ".creationtime",
                  db.fetch(dblot2 + ".creationtime")
                );
                db.delete(
                  `${interaction.guild.id}.${kullanıcı.id}-aktifticket`
                );

                db.delete(dblot);
              } catch (err) {
                console.log(err);
              }
            });
        } catch {}
      }
    }
  },
};
