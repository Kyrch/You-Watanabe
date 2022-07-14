const { SlashCommandBuilder } = require('@discordjs/builders');
const { embedSkip } = require('../functions/embedsMusic');
const player = require('../player/player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('pula a música atual'),

    async execute(interaction) {
        const queue = player.getQueue(interaction.guild.id)

        if (!queue || !queue.playing) return interaction.reply({ content: 'Nada tocando no momento', ephemeral: true })
        queue.skip()

        embedSkip(interaction, queue.tracks[0])
    }
}