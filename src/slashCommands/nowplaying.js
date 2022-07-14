const { SlashCommandBuilder } = require('@discordjs/builders');
const { embedNowPlaying, embedSkip } = require('../functions/embedsMusic');
const player = require('../player/player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nowplaying')
        .setDescription('mostra a música atual'),

    async execute(interaction) {
        const queue = player.getQueue(interaction.guild.id)
        if (!queue || !queue.playing) return interaction.reply({ content: 'Nada tocando no momento', ephemeral: true })

        embedNowPlaying(interaction, queue)

        let filter = i => i.user.id == interaction.user.id
        let collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000, max: 1 })

        collector.on('collect', async inter => {

            if (inter.customId == 'skip') {
                queue.skip()
                embedSkip(inter, queue.tracks[0])
            }

            if (inter.customId == 'clear') {
                queue.destroy()
                try {
                    await inter.reply({ content: 'Playlist destruída' })
                } catch (err) {
                    await inter.reply({ content: 'Playlist destruída', ephemeral: true })
                }
            }
        })
    }
}