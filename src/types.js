import type {Guild, Role} from 'discord.js'

export type CommandData = {
  GUILD: Guild,
  rolesByName: {[name: string]: Role},
  channelsByName: {[name: string]: Channel}
  getEmoji: (string) => string,
};
