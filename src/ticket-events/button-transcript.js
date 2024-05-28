const { EmbedBuilder, PermissionFlagsBits, ChannelType, ModalBuilder, ActionRowBuilder, TextInputBuilder, ComponentType,TextInputStyle, ButtonBuilder, ButtonStyle, AttachmentBuilder, PermissionsBitField } = require('discord.js');
const db = require("croxydb");
const { kontrol, verial } = require('../functions/ticket-main-functions');
const { usermessage } = require('../functions/message-fuctions');
const discordTranscripts = require('discord-html-transcripts');
const date = new Date();
const year = date.getFullYear();
const month = String(date.getMonth() + 1).padStart(2, "0");
const day = String(date.getDate()).padStart(2, "0");
const hour = String(date.getHours()).padStart(2, "0");
const minute = String(date.getMinutes()).padStart(2, "0");

const formattedDate = `${year}/${month}/${day} ${hour}:${minute}`;
module.exports = {
    name: 'interactionCreate',
    once: false,

    async execute(interaction, client) {
        if (!interaction.isButton()) return;
    
        if(interaction.customId == "ticket.transcript" ){
            const result = await kontrol(interaction);
            if(result == 1){
                try{
                  usermessage("Please use the /ticket-setup command again.", interaction)
                  return;
                } catch {
                  usermessage("An issue occurred, please try again later!", interaction)
                  return;
                }
              } else {
                const veriler = await verial(interaction);
                const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setLabel('Kanala git!')
                    .setEmoji("<:rayn:1148665027830747287>")
                    .setURL(`https://discord.com/channels/${interaction.guild.id}/${veriler.transcriptchannel}`)
                    .setStyle(ButtonStyle.Link),
                              
                );
                const channel2 = interaction.client.channels.cache.get(veriler.transcriptchannel);
                const mesajembed2 = new EmbedBuilder()
                    .setColor("2B2D31")
                    .setTitle(`Transcript record is being created successfully...`)
                    .setDescription(`The transcript will take between 1-3 minutes**...**`);
                    await interaction.reply({embeds: [mesajembed2],ephemeral: true})
                
                const attachment = await discordTranscripts.createTranscript(interaction.channel);
                const mesajembed = new EmbedBuilder()
                    .setColor("2B2D31")
                    .setTitle(`New transcript!`)
                    .setDescription(`Transcript record of the channel named **${interaction.channel.name}**(<#${interaction.channel.id}>), dated **${formattedDate}**.`);
                    channel2.send({content: "||<@&"+veriler.panelyetkili+">||",embeds: [mesajembed],files: [attachment]}).then(() => {
                      const mesajembed = new EmbedBuilder()
                      .setColor("2B2D31")
                      .setTitle(`Transcript recording completed successfully.`)
                      .setDescription(`Transcript record of the channel was created successfully, You can view it on <#${veriler.transcriptchannel}> channel.`);
                      interaction.editReply({embeds: [mesajembed], components: [row], ephemeral: true})
                  })
              }
            }
        }
    }