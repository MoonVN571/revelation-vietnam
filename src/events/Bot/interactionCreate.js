import dotenv from "dotenv";
dotenv.config();

import { Colors } from "discord.js";
import { Cooldown } from "../../handle/commandHandler.js";
import axios from 'axios';

export async function execute(interaction) {
  if (interaction.isChatInputCommand()) {
    const cmd = this.commands.get(interaction.commandName);
    if (!cmd) return;
    sendCmdLog.bind(this)(interaction, '/' + interaction.commandName);
    let cooldown = this.cooldown.find(p => p.userId == interaction.user.id);
    if (cooldown?.time()) {
      interaction.reply({
        embeds: [{
          description: '❌ Vui lòng chờ **' + (cooldown.time() / 1000).toFixed(2) + 's** tiếp để sử dụng lệnh này!',
          color: Colors.Red
        }]
      });
      return;
    }
    setTimeout(() => this.cooldown = this.cooldown.filter(p => !p.time()), 2500);
    interaction.cooldown = new Cooldown(interaction.user.id, 2000);;
    this.cooldown.push(interaction.cooldown);
    await cmd.execute.bind(this)(interaction);
  }
}

function sendCmdLog(params, msg) {
  const user = params.author ? params.author : params.user;
  this.logger.info(`[${params.guild.name}] [${params.channel.name}] - ${user.tag} (${user.id}) : ${msg}`);
  if (!this.config.logs.enable) return;
  axios({
    url: process.env.LOGS_URL,
    headers: {
      'Content-Type': 'application/json'
    },
    params: {
      send_to: this.config.logs.commands,
      dev: this.dev,
      log_level: 'commands',
      user: { id: user.id, tag: user.tag },
      channel: { id: params.channel.id, name: params.channel.name },
      guild: { id: params.guild.id, name: params.guild.name, iconURL: params.guild.iconURL() },
      msg: `${msg}`,
      time: Date.now()
    }
  });
}
