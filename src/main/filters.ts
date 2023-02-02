import { Message } from 'types/Messages';

export const filterCommonBots = (author: string, enabled: boolean) => {
  if (enabled) {
    return [
      'streamelements',
      'streamlabs',
      'moobot',
      'nightbot',
      'fossabot',
    ].includes(author.toLocaleLowerCase());
  }
  return false;
};

export const filterNonSubs = (msg: Message, enabled: boolean) => {
  if (enabled) {
    return !msg.subscriber;
  }
  return false;
};

export const filterNonVips = (msg: Message, enabled: boolean) => {
  if (enabled) {
    return !msg.badges?.vip;
  }
  return false;
};

export const filterNonMods = (msg: Message, enabled: boolean) => {
  if (enabled) {
    return !msg.badges?.moderator;
  }
  return false;
};

export const filterCommands = (msg: Message, enabled: boolean) => {
  if (enabled) {
    const words = msg.message.split(' ');
    const messageContainsCommand = words.length === 1 && words[0][0] === '!';
    return messageContainsCommand || false;
  }
  return false;
};

export const filterEmotes = (msg: Message, enabled: boolean) => {
  if (enabled) {
    return msg.message.replaceAll(/(<([^>]+)>)/gi, '');
  }
  return msg.message;
};
