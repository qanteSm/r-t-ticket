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
const { usermessage, updatemessage } = require("../functions/message-fuctions");
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

    if (interaction.customId == "ticket.delete.no") {
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
          return;
        }
        if (
          db.get(
            `${interaction.guild.id}.ticket-system.tickets.ticket-${interaction.channel.id}.durum`
          ) != 0
        ) {
          console.log(
            `${interaction.guild.id}.ticket-system.tickets.ticket-${interaction.channel.id}.durum`
          );
          updatemessage(
            "Lütfen birkez daha Delete düğmesine tıklayın.",
            interaction
          );
          return;
        }
        if (
          db.get(
            `${interaction.guild.id}.reqs.close-ticket-${interaction.message.id}.userid`
          ) != interaction.user.id
        ) {
          return;
        }
        if (!interaction.guild.channels.cache.has(interaction.channel.id)) {
          return;
        }
        try {
          interaction.message.delete().then(() => {
            db.delete(
              `${interaction.guild.id}.reqs.close-ticket-${interaction.message.id}`
            );
          });
        } catch (err) {
          return;
        }
      }
    }else if (interaction.customId == "ticket.reopen.no"){
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
          return;
        }
        if (
          db.get(
            `${interaction.guild.id}.ticket-system.tickets.ticket-${interaction.channel.id}.durum`
          ) != 0
        ) {
          console.log(
            `${interaction.guild.id}.ticket-system.tickets.ticket-${interaction.channel.id}.durum`
          );
          updatemessage(
            "Lütfen birkez daha düğmeye tıklayın.",
            interaction
          );
          return;
        }
        if (
          db.fetch(
            `${interaction.guild.id}.reqs.reopen-addusers-ticket-${interaction.message.id}.userid`
          ) != interaction.user.id
        ) {
          console.log(
            db.get(
              `${interaction.guild.id}.reqs.reopen-addusers-ticket-${interaction.message.id}`
            )
          );
          return;
        }
        if (!interaction.guild.channels.cache.has(interaction.channel.id)) {
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
        try {
          console.log("a")
          nonaddedusers(interaction,1)
        } catch (err) {
          return;
        }
        async function nonaddedusers(interaction,code) {
          console.log("a2")
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
            .then(async () => {
              const dblot2 = `${interaction.guild.id}.ticket-system.tickets.ticket-${interaction.channel.id}`;
              const embedmessage = await interaction.channel.messages.fetch(await db.get(`${dblot2}.messageid`))
              const dblot = `${interaction.guild.id}.ticket-system.tickets.${kullanıcı.id}-aktifticket`;
             
              db.set(dblot + ".channelid", db.fetch(dblot2 + ".channelid"));
              db.set(dblot + ".ownerid", db.fetch(dblot2 + ".ownerid"));
              db.set(dblot + ".durum", "1");
              db.set(
                dblot + ".creationtime",
                db.fetch(dblot2 + ".creationtime")
              );
              db.set(dblot2 + ".durum", "1");
              await console.log("mesaj: "+ embedmessage.embeds[0])
              const embed = embedmessage.embeds[0];
              
              embed.fields.splice(-1, 1);
              const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setCustomId("ticket.close")
                  .setLabel("Close Ticket")
                  .setEmoji("✖️")
                  .setStyle(ButtonStyle.Danger)
              );
              embedmessage
                .edit({ embeds: [embed], components: [row] })
                .then(() => {
                  interaction.message.delete()
                  
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
      }
    }
  },
};
