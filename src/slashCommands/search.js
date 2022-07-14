const { SlashCommandBuilder } = require('@discordjs/builders');
const { QueryType } = require('discord-player');
const { embedSearch, embedPlay } = require('../functions/embedsMusic');
const player = require('../player/player');
const config = require('../player/config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('search')
        .setDescription('procura as músicas')
        .addStringOption(option => option
            .setName('musica')
            .setDescription('digite a musica')
            .setRequired(true)),

    async execute(interaction) {

        const name = interaction.options.getString('musica')

        const res = await player.search(name, {
            requestedBy: interaction.member,
            searchEngine: QueryType.AUTO
        })

        let index = 1
        let songsFind = "";
        songsFind += `${res.tracks.slice(0, 5).map(x => `**${index++}** - [${x.title}](${x.url}) \`(${x.duration})\``).join('\n')}`

        embedSearch(interaction, songsFind, res.tracks[0])

        let filter = i => i.user.id == interaction.user.id
        let collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000, max: 1 })

        collector.on('collect', async inter => {
            if (!inter.isButton()) return

            var queue = await player.createQueue(interaction.guild, {
                leaveOnEnd: config.voiceConfig.leaveOnEnd,
                autoSelfDeaf: config.voiceConfig.autoSelfDeaf,
                metadata: interaction.channel
            })

            try {
                if (!queue.connection) {
                    await queue.connect(interaction.member.voice.channel)
                }
            } catch (err) {
                await player.deleteQueue(interaction.guildId)
                return
            }

            res.playlist ? queue.addTracks(res.tracks) : queue.addTrack(res.tracks[parseInt(inter.customId)]);
            if (!queue.playing) await queue.play();

            embedPlay(inter, res.tracks[parseInt(inter.customId)], queue.tracks.length)
        })
    }
}