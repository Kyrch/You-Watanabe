const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js")
const ee = require('../../json/embed.json')

const embedNowPlaying = async function embedNowPlaying(interaction, queue) {

    let progressBar = queue.createProgressBar({
        timecodes: true,
        length: 7.5,
        line: '▬',
        indicator: '●'
    })
    let bar = progressBar.split('┃')
    let now = queue.nowPlaying()

    let embed = new MessageEmbed()
        .setColor(ee.color)
        .setThumbnail(`${now.thumbnail}`)
        .setDescription(`[${now.title}](${now.url})\n\n${bar[1]} (${bar[0]} / ${bar[2]})`)

    let row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId('skip')
                .setEmoji('⏩')
                .setLabel('Skip')
                .setStyle('SUCCESS'),
            new MessageButton()
                .setCustomId('clear')
                .setEmoji('🛑')
                .setLabel('Clear')
                .setStyle('DANGER')
        )

    try {
        await interaction.reply({ embeds: [embed], components: [row] })
    } catch (err) {
        await interaction.reply({ embeds: [embed], components: [row], ephemeral: true })
    }
}

const embedPlay = async function embedPlay(interaction, res, position) {
    const user = interaction.user;
    const avatarVerify = user.avatarURL({
        dynamic: true,
        format: "png",
        size: 1024
    });

    if (avatarVerify === null) {
        var avatar = "https://i.imgur.com/JdLLM92.png"
    } else {
        var avatar = avatarVerify
    }

    var requested = `${res.requestedBy.username}#${res.requestedBy.discriminator}`

    let embed = new MessageEmbed()
        .setColor(ee.color)
        .setAuthor({ name: `${requested}`, iconURL: `${avatar}` })
        .setThumbnail(`${res.thumbnail}`)
        .addFields({
            name: '🎵 Música',
            value: `[${res.title}](${res.url})`,
            inline: false
        }, {
            name: '⌛️ Duração',
            value: `${res.duration}`,
            inline: true
        }, {
            name: 'Posição na fila',
            value: `${position}`,
            inline: true
        }, {
            name: '🎥 Canal',
            value: `${res.author}`
        }, {
            name: '💽 RequestedBy',
            value: `\`${requested}\``,
            inline: true
        })

    try {
        await interaction.reply({ embeds: [embed] })
    } catch (err) {
        await interaction.reply({ embeds: [embed], ephemeral: true })
    }
}

const embedSearch = async function embedSearch(interaction, songsFind) {

    let row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId('0')
                .setEmoji('1️⃣')
                .setStyle('SECONDARY'),
            new MessageButton()
                .setCustomId('1')
                .setEmoji('2️⃣')
                .setStyle('SECONDARY'),
            new MessageButton()
                .setCustomId('2')
                .setEmoji('3️⃣')
                .setStyle('SECONDARY'),
            new MessageButton()
                .setCustomId('3')
                .setEmoji('4️⃣')
                .setStyle('SECONDARY'),
            new MessageButton()
                .setCustomId('4')
                .setEmoji('5️⃣')
                .setStyle('SECONDARY')
        )

    let embed = new MessageEmbed()
        .setColor(ee.color)
        .setDescription(`${songsFind}`)

    try {
        await interaction.reply({
            embeds: [embed],
            components: [row]
        })
    } catch (err) { }
}

const embedSkip = async function embedSkip(interaction, track) {

    var requested = `${track.requestedBy.username}#${track.requestedBy.discriminator}`

    let embed = new MessageEmbed()
        .setColor(ee.color)
        .setThumbnail(`${track.thumbnail}`)
        .addFields({
            name: '🎵 Tocando Agora',
            value: `[${track.title}](${track.url}) \`(${requested})\``
        }, {
            name: '⌛️ Duração',
            value: `${track.duration}`
        })

    try {
        await interaction.reply({ embeds: [embed] })
    } catch (err) {
        await interaction.reply({ embeds: [embed], ephemeral: true })
    }
}

module.exports = {
    embedNowPlaying,
    embedPlay,
    embedSearch,
    embedSkip
}