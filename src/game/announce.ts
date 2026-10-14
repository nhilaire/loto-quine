// What is said and shown when a ball is revealed.
import { fr } from '../i18n/fr';
import { nicknameOf } from './nicknames';

export type Announcement = { spoken: string; nickname: string | null };

export function announcement(ball: number, nicknamesOn: boolean): Announcement {
  const nickname = nicknamesOn ? nicknameOf(ball) : null;
  return { spoken: nickname ? fr.voice.nickname(ball, nickname) : fr.voice.plain(ball), nickname };
}
