const { SlashCommandBuilder } = require('@discordjs/builders');
//......
const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {

    data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Usuń określoną ilość wiadomości w tym kanale')
    .addIntegerOption(option => option.setName('ilość').setDescription('Ilość wiadomości do usunięcia.').setMinValue(1).setMaxValue(100).setRequired(true)),
    async execute (interaction, client) {

      const amount = interaction.options.getInteger('ilość')
      const channel = interaction.channel;

      //wiadomości zwrotne w przypadku..
      if (!interaction.member.permissions.has(PermissionsBitField.ManageMessages)) return await interaction.reply({ content: "Nie posiadasz permisji aby użyć tej komendy", ephemeral: true });
      if (!amount) return await interaction.reply({ content: "Proszę napisz ilość wiadomości jakie chcesz usunąć.", ephemeral: true});
      if (amount > 100 || amount < 1 ) return await interaction.reply({ content: "Proszę wybierz liczbę pomiędzy 1 a 100!", ephemeral: true })

      await interaction.channel.bulkDelete(amount).catch(err =>{
        return;
      });

      const embed = new EmbedBuilder()
      .setColor('#896bce')
      .setDescription(`<:message:1040967511283355669> Usunięto **${amount}** wiadomości`)
      .setTimestamp()
      .setFooter({
        iconURL: interaction.user.displayAvatarURL(),
        text: `Wykonano dla ${interaction.user.tag}`
      })

      await interaction.reply({ embeds: [embed]}).catch(err =>{

      })


    }

}