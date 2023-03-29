import { Schema, model } from 'mongoose';
const schema = new Schema({
    guildId: String,
    welcome: {
        channelId: String,
        content: String,
        embeds: Object
    },
    chatgpt: {
        channelId: String
    },
    cron: Array
}, { id: false });
export const serverModel = model('servers', schema);