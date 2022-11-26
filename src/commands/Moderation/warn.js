const { EmbedBuilder, SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const { set } = require('mongoose');
const warningSchema = require("../../Schemas/Warning");

module.exports = {

    data: new SlashCommandBuilder()
    .setName('warnings')
    .setDescription('Fully complete warning system.')
    .addSubcommand(subcommand =>
        //dodawanie warna
        subcommand.setName('add')
        .setDescription('Nadaj użytkownikowi ostrzeżenie')
        .addUserOption(option => option.setName("użytkownik")
        .setDescription("Wybierz użytkownika")
        .setRequired(true)
        )
        .addStringOption(option => option.setName("powód")
        .setDescription("Podaj powód ostrzeżenia")
        .setRequired(false)
        )
    )

    .addSubcommand(subcommand =>
        //sprawdzanie warnów
        subcommand.setName('check')
        .setDescription('Sprawdź warny użytkownika')
        .addUserOption(option => option.setName("użytkownik")
        .setDescription("Wybierz użytkownika")
        .setRequired(true)
        )
    )

    .addSubcommand(subcommand =>
        //usuwanie warnów
        subcommand.setName('remove')
        .setDescription('Usuń konkretne ostrzeżenie użytkownikowi')
        .addUserOption(option => option.setName("użytkownik")
        .setDescription("Wybierz użytkownika")
        .setRequired(true)
        )
        .addIntegerOption(option => option.setName("id")
        .setDescription("Wpisz id warna")
        .setRequired(true)
        )
    )

    .addSubcommand(subcommand =>
        //czyszczenie all ostrzeżeń
        subcommand.setName('clear')
        .setDescription('Wyczyść wszystkie ostrzeżenia użytkownika')
        .addUserOption(option => option.setName("użytkownik")
        .setDescription("Wybierz użytkownika")
        .setRequired(true)
        )
    ),    

            async execute(interaction) {
        const { options, guildId, user, member } = interaction;
    
        const sub = options.getSubcommand(["add", "check", "remove", "clear"]);
        const target = options.getUser("użytkownik");
        const reason = options.getString("powód") || "Nie podano powodu";
        const warnId = options.getInteger("id") - 1;
        const warnDate = new Date(interaction.createdTimestamp).toLocaleDateString();

        const userTag = `${member.user.tag}`;

        const embed = new EmbedBuilder();

        switch (sub) {
//            
            case "add":
            warningSchema.findOne({ GuildID: guildId, UserID: target.id, UserTag: userTag}, async (err, data) => {
                if (err) throw err;

                if(!data) {
                    data = new warningSchema({
                        GuildID: guildId,
                        UserID: target.id,
                        UserTag: userTag,
                        Content: [
                            {
                                ExecuterId: user.id,
                                ExecuterTag: user.tag,
                                Reason: reason,
                                Date: warnDate
                            }
                        ],
                    })
                } else {
                    const warnContent = {
                                ExecuterId: user.id,
                                ExecuterTag: user.tag,
                                Reason: reason,
                                Date: warnDate
                    }
                    data.Content.push(warnContent);
                }
                data.save();
            });

            embed.setColor('Green')
            .setDescription(`
            <:warn:1042084566028013631> Ostrzeżenie dla: ${target.tag}
            <:bughunter:1042137681586569236> **Moderator**: ${userTag}\n
            **Powód**: \`\`\`${reason}\`\`\`
            `)
            .setFooter({text: member.user.tag, iconURL: member.user.displayAvatarURL({ dynamic: true })})
            .setTimestamp();

            interaction.reply({ embeds: [embed] }).catch((err) => {
                console.log(err)
                });

            break;
//
            case "check":
                warningSchema.findOne({ GuildID: guildId, UserID: target.id, UserTag: userTag}, async (err, data) => {
                    if (err) throw err;

                    if (data) {
                        embed.setColor('#292b2f')
                        .setDescription(`<:warn:1042084566028013631> Ostrzeżenia użytkownika ${target.tag}\n ${data.Content.map(
                            (w, i) =>
                            `
                            <:circle:1042081673833099294> **ID**: ${i + 1}
                            <:circle:1042081673833099294> **Moderator**: ${w.ExecuterTag}
                            <:circle:1042081673833099294> **Data**: ${w.Date}
                            <:circle:1042081673833099294> **Powód**: ${w.Reason}\n\n
                            `
                        ).join(" ")}`)
                        .setFooter({text: member.user.tag, iconURL: member.user.displayAvatarURL({ dynamic: true })})
                        .setTimestamp();
                
                        interaction.reply({ embeds: [embed] }).catch(err =>{});
                        } else {
                            embed.setColor('Red')
                            .setDescription(`${userTag} | ${target.id} nie posiada warnów`)
                            .setFooter({ text: member.user.tag, iconURL: member.user.displayAvatarURL({ dynamic: true})})
                            .setTimestamp()

                            interaction.reply({ embeds: [embed] }).catch((err) => {
                                console.log(err)
                                });
                    }

            });

            break;
//
            case "remove":
                warningSchema.findOne({ GuildID: guildId, UserID: target.id, UserTag: userTag}, async (err, data) => {
                    if (err) throw err;

                    if (data) {
                        
                        data.Content.splice(warnId, 1);
                        data.save();
                        
                        embed.setColor('Green')
                            .setDescription(`Warn ${userTag} o id ${warnId} został usunięty.`)
                            .setFooter({ text: member.user.tag, iconURL: member.user.displayAvatarURL({ dynamic: true})})
                            .setTimestamp()

                            interaction.reply({ embeds: [embed] }).catch((err) => {
                                console.log(err)
                                });
                
                        } else {
                            embed.setColor('Red')
                            .setDescription(`${userTag} | ${target.id} nie posiada warnów`)
                            .setFooter({ text: member.user.tag, iconURL: member.user.displayAvatarURL({ dynamic: true})})
                            .setTimestamp()

                            interaction.reply({ embeds: [embed] }).catch((err) => {
                                console.log(err)
                                });
                    }

            });

            break;
//
            case "clear":
                warningSchema.findOne({ GuildID: guildId, UserID: target.id, UserTag: userTag }, async (err, data) => {
                    if (err) throw err;

                    if (data) {
                        
                       await warningSchema.findOneAndDelete({ GuildID: guildId.id, UserID: target.id, UserTag: userTag });
                        
                        embed.setColor('Green')
                            .setDescription(`Warny ${userTag} zostały wyzerowane. | ${target.id}`)
                            .setFooter({ text: member.user.tag, iconURL: member.user.displayAvatarURL({ dynamic: true})})
                            .setTimestamp()

                            interaction.reply({ embeds: [embed] }).catch((err) => {
                                console.log(err)
                                });
                
                        } else {
                            embed.setColor('Red')
                            .setDescription(`${userTag} | ${target.id} nie posiada warnów`)
                            .setFooter({ text: member.user.tag, iconURL: member.user.displayAvatarURL({ dynamic: true})})
                            .setTimestamp()

                            interaction.reply({ embeds: [embed] }).catch((err) => {
                                console.log(err)
                                });
                    }

            });

            break;
            
        }
    }

}

