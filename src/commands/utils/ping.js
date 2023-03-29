import { EmbedBuilder } from 'discord.js';

export const data = {
  name: 'ping',
  description: 'Kiểm tra tốc độ phản hồi của bot.'
}

export async function execute(interaction) {
  const embed = new EmbedBuilder()
    .setDescription(`Pong! ${interaction.client.ws.ping}ms!`)
    .setColor('Purple');

  interaction.reply({
    embeds: [embed],
  });
}
