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
const { checkPermissions } = require("../functions/general-functions");

const discord = db.get("rt.disco rd");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("add-user-to-ticket")
    .setDMPermission(false)
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("The member to add to ticket")
        .setRequired(true)
    )
    .setDescription("Allows you to add users to the ticket"),
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
      try {
        const usertarget = interaction.options.getMember("target");
        const usera = interaction.guild.members.cache.get(usertarget.id);
        const targetMember = interaction.options.getMember("target");
        const veriler = await verial(interaction);
        if (!interaction.member.roles.cache.has(veriler.panelyetkili)) {
          return;
        }
        if (targetMember.roles.cache.has(veriler.panelyetkili)) {
          console.log(usera);
          usermessage(
            "This user can already see this channel and send messages!",
            interaction
          );
          return;
        }
        if (
          !db.get(
            `${interaction.guild.id}.ticket-system.tickets.ticket-${interaction.channel.id}`
          )
        ) {
          usermessage(
            "This channel is not a ticket channel or something went wrong!"
          );
          return;
        }
        const olanveri =
          db.get(
            `${interaction.guild.id}.ticket-system.tickets.ticket-${interaction.channel.id}.addedusers`
          ) || [];
        if (olanveri.includes(`${targetMember.id}`)) {
          usermessage("This user is already added to the ticket.", interaction);
          return;
        }
        const permissions = await checkPermissions(
          interaction.guild,
          interaction.channel,
          targetMember
        );
        if (permissions.canViewChannel && permissions.canSendMessages) {
          console.log("kante");

          usermessage(
            "This user can already see this channel and send messages!",
            interaction
          );
          return;
        }
        await interaction.channel.permissionOverwrites
          .edit(targetMember.id, {
            ViewChannel: true,
            SendMessages: true,
          })
          .then(() => {
            olanveri.push(`${targetMember.id}`);
            db.set(
              `${interaction.guild.id}.ticket-system.tickets.ticket-${interaction.channel.id}.addedusers`,
              olanveri
            );
            usermessage("User successfully added to the ticket!", interaction);
          });
      } catch (err) {
        console.log(err);
        usermessage("An error occurred", interaction);
      }
    }
  },
};
