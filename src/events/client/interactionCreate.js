module.exports = {
    name: "interactionCreate",
    async execute(interaction, client) {
        if (interaction.isChatInputCommand()) {
            const { commands } = client;
            const { commandName } = interaction;
            const command = commands.get(commandName);
            if (!command) return;

            try{
                await command.execute(interaction, client);
            } catch (error) {
                console.error(error);
                await interaction.reply({
                    content: 'Coś poszło nie tak podczas wykonywania tego polecenia!', 
                    ephemeral: true
                });
        
            }

            if (!interaction.guild.members.me.permissions.has(command.botperm || [] )) {
                return interaction.reply({content: `Nie mam permisji \` ${cmd.botperm} \`!`, ephemeral: true})
            }
            if (!interaction.member.permissions.has(command.userperm || [] )) {
                return interaction.reply({content: `Nie masz permisji \` ${cmd.userperm} \`!`, ephemeral: true})
            }
        }

      

    },
};