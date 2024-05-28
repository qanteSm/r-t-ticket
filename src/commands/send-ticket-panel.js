const {
  EmbedBuilder,
  PermissionsBitField,
  PermissionFlagsBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const db = require("croxydb");
const {
  usermessage,
  usermessagewithdes,
  usermessagewitlinkbutton,
} = require("../functions/message-fuctions");
const { kontrol, verial } = require("../functions/ticket-main-functions");
const { lstat } = require("fs");

const discord = db.get("rt.discord");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("send-ticket-panel")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDescription("It helps you send the ticket panel."),
  run: async (client, interaction) => {
    const result = await kontrol(interaction);
    if (result == 1) {
      try {
        db.delete(interaction.guild.id + "-ticket-system");
        usermessage("Please use the /ticket-setup command again.", interaction);
        return;
      } catch {
        usermessage("An issue occurred, please try again later!", interaction);
        return;
      }
    } else {
      const lastpanelid = db.get(
        interaction.guild.id + ".ticket-system.lastpanel.id"
      );
      const lastpanelchannelid = db.get(
        interaction.guild.id + ".ticket-system.lastpanel.channelid"
      );
      if (!interaction.guild.channels.cache.has(lastpanelchannelid)) {
        console.log("a");
        main();
      } else {
        const kanala = await client.channels.cache.get(lastpanelchannelid);
        kanala.messages
          .fetch(lastpanelid)
          .then((mesaj) => {
            console.log("c");
            usermessagewitlinkbutton(
              "Zaten bir ticket paneli var, lütfen önce onu silin.",
              "Ticket Paneline Git!",
              `https://discord.com/channels/${interaction.guild.id}/${lastpanelchannelid}/${lastpanelid}`,
              interaction
            );
          })
          .catch((hata) => {
            main();
          });
      }
      async function main() {
        try {
          const veriler = await verial(interaction);
          const panelcolor = veriler.panelcolor;
          console.log(veriler.panelchannel);
          const kanal = await interaction.guild.channels.cache.get(
            veriler.panelchannel
          );
          const mainserver = await client.guilds.cache.get(
            "1172413816139694130"
          );
          const mainservericon = mainserver.iconURL();
          const panelbuttonlabel = veriler.panelbuttonlabel;
          const panelbuttonstyle = veriler.panelbuttonstyle;
          console.log(panelbuttonstyle);
          const exampleEmbed = new EmbedBuilder()
            .setColor(`${veriler.panelcolor}`)
            .setURL("https://discord.gg/JphgVSgSES")
            .setTitle(`${veriler.paneltitle}`)
            .setThumbnail(interaction.guild.iconURL())
            /*.setFooter({
              text: "R-T Project • 2024",
              iconURL: mainservericon,
            })*/
            .setDescription(`${veriler.paneldescription}`);
          const cancel = new ButtonBuilder()

            .setCustomId("ticket.create")
            .setLabel(panelbuttonlabel)
            .setStyle(veriler.panelbuttonstyle);

          const row = new ActionRowBuilder().addComponents(cancel);

          kanal
            .send({ components: [row], embeds: [exampleEmbed] })
            .then((message) => {
              db.set(
                interaction.guild.id + ".ticket-system.lastpanel.id",
                message.id
              );
              db.set(
                interaction.guild.id + ".ticket-system.lastpanel.channelid",
                kanal.id
              );
              usermessagewitlinkbutton(
                "Ticket paneli başarıyla gönderildi!.",
                "Ticket Paneline Git!",
                `https://discord.com/channels/${interaction.guild.id}/${kanal.id}/${message.id}`,
                interaction
              );
            });
        } catch (err) {
          interaction.reply("Hata Oluştu.");
        }
      }
    }
  },
};
