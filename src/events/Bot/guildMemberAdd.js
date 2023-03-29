import dotenv from "dotenv";
dotenv.config();

import { serverModel } from "../../databases/server-model.js";

export async function execute(member) {
    if (this.dev) return;
    const db = await serverModel.findOne({ guildId: member.guild.id });
    if (!db) return;
    member.guild.channels.cache.get(db?.welcome?.channelId)?.send(this.utils.get_welcome_format(db.welcome, member));
}
