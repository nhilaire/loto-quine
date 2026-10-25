// What is said and shown when a ball is revealed, in the game's language.
import { DICTIONARIES, Language } from '../i18n';
import { nicknameOf, spokenNicknameOf } from './nicknames';

export type Announcement = { spoken: string; nickname: string | null };

export function announcement(ball: number, nicknamesOn: boolean, language: Language = 'fr'): Announcement {
  const voice = DICTIONARIES[language].voice;
  const nickname = nicknamesOn ? nicknameOf(ball, language) : null;
  return { spoken: nickname ? voice.nickname(ball, spokenNicknameOf(ball, language) ?? nickname) : voice.plain(ball), nickname };
}
