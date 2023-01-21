import tmi from 'tmi.js';

export interface Message {
  id: string | undefined;
  username: string | undefined;
  twitch: string | undefined;
  emotes: { [x: string]: string[]; [x: number]: string[] };
  date: Date;
  message: string;
  badges: tmi.Badges | undefined;
  mod: boolean | undefined;
  subscriber: boolean | undefined;
  color: string | undefined;
  userType: string | undefined;
  turbo: boolean | undefined;
  returningChatter: boolean | undefined;
  firstMessage: boolean | undefined;
}

export interface EmoteOptions {
  format?: 'static' | 'animated' | 'default';
  themeMode: 'light' | 'dark';
  scale: '1.0' | '2.0' | '3.0';
}
