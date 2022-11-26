const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
  .setName('txt')
  .setDescription('Ukazuje kategorie texturpacków'), 
  async execute (interaction, client) {
    await interaction.reply({ content: 'Bot jest w wersji testowej oraz ma za zadanie wypróbować slash commands!'});
  }

}

