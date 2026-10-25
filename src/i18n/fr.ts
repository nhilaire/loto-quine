// Every player-facing string lives in a dictionary, French first (the reference, tone: tu). Components never inline
// text: they read `t` from useI18n(). Other languages (en.ts) must have the same keys (src/i18n/types.ts).
// French typography: no-break space (NBSP) before « : ; ! ? » and inside « ».
import { NBSP } from './format';

const N = NBSP;

// French plural rule: singular for 0 and 1.
export function plural(n: number, one: string, other: string): string {
  return n <= 1 ? one : other;
}

export const fr = {
  // BCP 47 locale of this language: number formatting and the text-to-speech voice.
  locale: 'fr-FR',
  consent: {
    title: 'Statistiques anonymes',
    body:
      "Pour améliorer l'appli, Loto Quine peut envoyer des statistiques anonymes (parties jouées, étapes gagnées, " +
      "plantages). Aucune donnée personnelle. Tu peux changer d'avis dans les paramètres.",
    accept: 'Accepter',
    refuse: 'Refuser',
  },
  home: {
    pitch: `Ton animateur de loto dans la poche${N}!`,
    newGame: 'Nouvelle partie',
    resume: 'Reprendre la partie',
    rules: 'Règles',
    settings: 'Paramètres',
    about: 'À propos',
  },
  // « À propos » (AC-41), texts approved by the user on 2026-10-15.
  about: {
    title: 'À propos',
    storyTitle: "L'histoire de ce jeu",
    story: [
      `Petit, j'allais parfois au loto de l'école${N}: la salle pleine, les cartons, les jetons, l'animateur qui ` +
        `annonçait les boules avec leurs surnoms, et ce petit silence avant que quelqu'un crie «${N}Quine${N}!${N}». ` +
        "J'ai voulu retrouver cette ambiance à la maison, pour jouer en famille avec mes enfants, sans boulier ni sac de boules.",
    ],
    authorTitle: "Un mot de l'auteur",
    author: [
      `Ce jeu ne sort pas d'un studio${N}: je l'ai imaginé et programmé sur mon temps libre, en développeur passionné, sans prétention.`,
      "Il est donc perfectible et sans doute pas exempt de bugs. Si une boule fait des siennes ou si la voix écorche un " +
        `surnom, merci d'avance pour ton indulgence. Et surtout${N}: bonne partie${N}!`,
    ],
    dataTitle: 'Tes données',
    data: [
      "Aucun compte, aucune publicité. Des statistiques anonymes (parties jouées, étapes gagnées, plantages) ne sont " +
        "envoyées que si tu l'as accepté. Tu peux changer d'avis dans les paramètres.",
    ],
    version: (version: string) => `Version ${version}`,
    back: 'Retour',
  },
  stage: {
    quine: 'Quine',
    double_quine: 'Double quine',
    carton_plein: 'Carton plein',
  },
  game: {
    counter: (n: number) => `Boule n°${n}`,
    noBall: 'Touche la boule pour commencer',
    draw: 'Tirer une boule',
    lastBalls: 'Dernières boules',
    allOut: 'Toutes les boules sont sorties',
    check: 'Vérifier',
    end: 'Terminer la partie',
    endConfirm: `Terminer la partie${N}?`,
    replaceConfirm: `Une partie est en cours. En commencer une nouvelle${N}?`,
    ballLabel: (n: number) => `Boule ${n}`,
  },
  common: {
    yes: 'Oui',
    no: 'Non',
    back: 'Retour',
    home: 'Accueil',
  },
  check: {
    // The check follows the stage: only the winning rows are entered (user feedback 2026-10-14, AC-40).
    title: {
      quine: 'Vérifier une quine',
      double_quine: 'Vérifier une double quine',
      carton_plein: 'Vérifier un carton plein',
    },
    need: {
      quine: 'Saisis seulement la ligne gagnante.',
      double_quine: 'Saisis seulement les 2 lignes gagnantes.',
      carton_plein: 'Saisis les 3 lignes du carton.',
    },
    next: 'Suivant',
    erase: 'Effacer',
    verify: 'Vérifier',
    drawn: 'sorti',
    missingNumber: 'manquant',
    win: `Gagné${N}!`,
    notYet: 'Pas encore…',
    missing: (n: number) => plural(n, `Il manque ${n} numéro`, `Il manque ${n} numéros`),
    rowLabel: (row: number) => `Ligne ${row}`,
    validate: 'Valider le gagnant',
    errorRange: 'Numéro entre 1 et 90',
    errorDuplicate: 'Numéro en double',
    errorIncomplete: 'Ligne incomplète',
    errorEmpty: 'Saisis au moins une ligne',
  },
  win: {
    title: `Bravo${N}!`,
    continue: 'Continuer le tirage',
    newDraw: 'Nouveau tirage',
  },
  tie: {
    open: 'Départager les gagnants',
    title: 'Départager les gagnants',
    count: 'Nombre de gagnants',
    player: (k: number) => `Joueur ${k}`,
    draw: 'Tirer',
    winner: (k: number, n: number) => `Le joueur ${k} gagne avec le ${n}${N}!`,
  },
  over: {
    completed: `Partie terminée${N}!`,
    stopped: 'Partie arrêtée',
    balls: (n: number) => plural(n, `${n} boule tirée`, `${n} boules tirées`),
    duration: (n: number) => `Durée${N}: ${n}${N}min`,
  },
  rules: {
    title: 'Règles',
    body: [
      'Chaque joueur a un ou plusieurs cartons de 3 lignes de 5 numéros. Quand un numéro sort, marque-le sur ton carton.',
      `Quine${N}: le premier à compléter une ligne crie «${N}Quine${N}!${N}».`,
      `Double quine${N}: deux lignes complètes.`,
      `Carton plein${N}: les trois lignes.`,
      `L'animateur vérifie avec «${N}Vérifier une quine${N}» (puis double quine, carton plein)${N}: on ne saisit que les lignes gagnantes. ` +
        `S'il y a plusieurs gagnants sur la même boule, ` +
        `chacun tire un numéro${N}: le plus haut gagne.`,
    ],
  },
  settings: {
    title: 'Paramètres',
    voice: 'Voix',
    voiceHelp: 'Annonce chaque boule à voix haute.',
    nicknames: 'Surnoms',
    nicknamesHelp: 'Ajoute le surnom traditionnel du numéro.',
    sounds: 'Sons',
    vibrations: 'Vibrations',
    stats: 'Statistiques anonymes',
    statsHelp: "Aide à corriger les bugs et à améliorer l'appli. Aucune donnée personnelle.",
    language: 'Langue',
    languageAuto: 'Automatique (langue du téléphone)',
    back: 'Retour',
  },
  voice: {
    plain: (n: number) => `${n}${N}!`,
    nickname: (n: number, nickname: string) => `${n}, ${nickname}${N}!`,
  },
  errors: {
    title: 'Oups',
    body: "Un problème est survenu. Relance l'appli.",
    retry: 'Réessayer',
  },
} as const;
