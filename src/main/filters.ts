import { Message } from 'types/Messages';

export const filterCommonBots = (author: string, enabled: boolean) => {
  if (enabled) {
    return ['Streamelements', 'Streamlabs', 'Moobot', 'tighwin'].includes(
      author
    );
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

export const filterEmotes = (msg: Message, enabled: boolean) => {
  if (enabled) {
    return msg.message.replaceAll(/(<([^>]+)>)/gi, '');
  }
  return msg.message;
};
