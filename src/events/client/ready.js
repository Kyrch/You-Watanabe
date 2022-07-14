const activities = [
    { type: 'LISTENING', name: 'love live' },
    { type: 'PLAYING', name: 'with aqours' }
]

module.exports = (Discord, client) => {
    console.log('Bot ready!')
    client.user.setActivity({ type: 'LISTENING', name: 'love live'})
    setInterval(() => {
        const randomActivity = activities[Math.floor(Math.random() * activities.length)]
        const c = client.user.setPresence({
            afk: false,
            activities: [{
                name: randomActivity.name,
                type: randomActivity.type
            }],
            intents: [],
            partials: [],
        })
    }, 3 * 60 * 1000)
}