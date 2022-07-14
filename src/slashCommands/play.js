const { SlashCommandBuilder } = require('@discordjs/builders');
const { QueryType } = require('discord-player');
const { embedPlay } = require('../functions/embedsMusic');
const player = require('../player/player');
const config = require('../player/config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('toca uma música')
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

        res.playlist ? queue.addTracks(res.tracks) : queue.addTrack(res.tracks[0]);
        if (!queue.playing) await queue.play();

        embedPlay(interaction, res.tracks[0], queue.tracks.length)
    }
}