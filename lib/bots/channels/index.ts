import type { Channel, ChannelName } from "../types";
import { telegram } from "./telegram";
import { whatsapp } from "./whatsapp";

const channels: Record<ChannelName, Channel> = { telegram, whatsapp };

export function getChannel(name: ChannelName): Channel {
  return channels[name];
}

/** Only the channels whose env vars are filled in. */
export function readyChannels(): Channel[] {
  return Object.values(channels).filter((channel) => channel.isReady());
}

export { telegram, whatsapp };
