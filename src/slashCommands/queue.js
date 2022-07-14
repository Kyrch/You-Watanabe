const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const player = require('../player/player');
const ee = require('../../json/embed.json')
const list = new Set()

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('mostra a playlist'),

    async execute(interaction) {

        const queue = player.getQueue(interaction.guild.id)
        if (!queue || !queue.playing) return interaction.reply({ content: 'Nada tocando no momento', ephemeral: true })
        const tracks = queue.tracks

    //    let array = []
        for (let m = 0; m < tracks.length; m++) {
            list.add({
                title: tracks[m].title,
                url: tracks[m].url,
                requestedBy: `${tracks[m].requestedBy.username}#${tracks[m].requestedBy.discriminator}`,
                duration: tracks[m].duration
            })
        }

        await interaction.reply({ content: '...', fetchReply: true })
        let pe = Object.entries(Object(list))

        list.clear()
        const listMsg = await interaction.fetchReply()
        await sleep(500)
        pageQueue(listMsg, pe, 1, listMsg.id, interaction, 0)
    }
}

pageQueue = async (listMsg, pe, page, ID, interaction, number) => {
    console.log(pe)
    console.log(typeof pe)

    let k = number
    let string = "";
    for (let i = k; i < k + 5; i++) {
        if (pe[i] == undefined || pe[i] == null) return
        string += `[${pe[i].title}](${pe[i].url}) \`(${pe[i].duration})\` \`(${pe[i].requestedBy})\``
    }

    let totalPages = Math.ceil(pe.length / 5)

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

    let embed = new MessageEmbed()
        .setColor(ee.color)
        .setAuthor({ name: `${user.tag}`, iconURL: `${avatar}` })
        .setTitle(`Playlist - Página ${page}/${totalPages}`)
        .setDescription(`${string}`)


    const row = new MessageActionRow().addComponents(
        new MessageButton()
            .setCustomId(`${ID}fback`)
            .setEmoji('⏪')
            .setStyle('SECONDARY')
            .setDisabled(page == 1),
        new MessageButton()
            .setCustomId(`${ID}back`)
            .setEmoji('◀️')
            .setStyle('SECONDARY')
            .setDisabled(page == 1),
        new MessageButton()
            .setCustomId(`${ID}next`)
            .setEmoji('▶️')
            .setStyle('SECONDARY')
            .setDisabled(page == totalPages),
        new MessageButton()
            .setCustomId(`${ID}fnext`)
            .setEmoji('⏩')
            .setStyle('SECONDARY')
            .setDisabled(page == totalPages)
    )

    if (listMsg) await interaction.editReply({
        embeds: [embed],
        components: [row]
    })
    else listMsg = await interaction.followUp({
        embeds: [embed],
        components: [row]
    });

    const filter = i => i.user.id === interaction.user.id
    const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000, max: 1 })

    collector.on('collect', async inter => {
        try {
            await inter.deferUpdate()
        } catch (err) { }

        if (inter.customId == `${ID}back`) {
            number -= 5
            pageQueue(listMsg, pe, page - 1, ID, inter, number)
            page--
        }

        if (inter.customId == `${ID}next`) {
            number += 5
            pageQueue(listMsg, pe, page + 1, ID, inter, number)
            page++
        }

        if (inter.customId == `${ID}fback`) {
            number = 0
            pageQueue(listMsg, pe, 1, ID, inter, number)
            page = 1
        }

        if (inter.customId == `${ID}fnext`) {
            number = Math.ceil(pe.length / 5) * 5 - 5
            pageQueue(listMsg, pe, totalPages, ID, inter, number)
            page = totalPages
        }
    });
}

sleep = async msec => {
    return new Promise(resolve => setTimeout(resolve, msec));
}