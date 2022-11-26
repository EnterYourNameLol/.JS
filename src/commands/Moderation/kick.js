const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionsBitField } = require('discord.js');

 

module.exports = {
  data: new SlashCommandBuilder()
  .setName('kick')
  .setDescription('Ta komenda wyrzuca użytkownika z serwera')
  .addUserOption(option => option.setName('użytkownik').setDescription('Użytkownik którego chciałbyś wyrzucić').setRequired(true))
  .addStringOption(option => option.setName('powód').setDescription('Powód wyrzucania użytkownika')),
    
  async execute (interaction, client) {

    const kickUser = interaction.options.getUser('użytkownik')
    const kickMember = await interaction.guild.members.fetch(kickUser.id);
    const channel = interaction.channel;

    if(!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) return await interaction.reply({ content: "Musisz posiadać uprawnienia do wyrzucania członków aby móc to zrobić", ephemeral: true });
    if(!kickMember) return await interaction.reply({ content: "Wspomniany użytkownik nie znajduje się już na serwerze.", ephemeral: true });
    if(!kickMember.kickable) return await interaction.reply({ content: "Nie mogę wyrzucić tego użytkownika bo posiada rolę wyższą ode mnie lub od ciebie :/", ephemeral: true });


    let reason = interaction.options.getString('powód');
    if(!reason) reason = "Nie podano powodu.";

    //Opcjonalna wiadomość do użytkownika w prywatnej wiadomości
    const dmEmbed = new EmbedBuilder()
      .setColor('#91d1a2')
      .setDescription(`<:redhammer:1040977674295853076> Zostałeś wyrzucony z: \`${interaction.guild.name}\` \n <:dymek:1041029778427351061> Powód: \`${reason}\``)

      const embed = new EmbedBuilder()
      .setColor('#91d1a2')
      .setDescription(`<:redhammer:1040977674295853076> Wyrzucono: \`${kickUser.tag}\` \n <:dymek:1041029778427351061> Powód: \`${reason}\``)

      //Opcjonalnie do wysyłania wiadomości prywatnej
      await kickMember.send({ embeds: [dmEmbed] }).catch(err => {
        return;
      });

      await kickMember.kick({ reason: reason }).catch(err => {
        interaction.reply({ content: "Wystąpił błąd", ephemeral: true });
      });

      await interaction.reply({ embeds: [embed] });


    

    }

}
