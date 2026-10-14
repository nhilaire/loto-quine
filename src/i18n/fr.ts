// Every player-facing string lives here, in French (tone: tu). Components never inline text.
// French typography: no-break space (NBSP) before « : ; ! ? » and inside « ».
import { NBSP } from './format';

const N = NBSP;

// French plural rule: singular for 0 and 1.
export function plural(n: number, one: string, other: string): string {
  return n <= 1 ? one : other;
}

export const fr = {
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
    check: 'Vérifier un carton',
    lastBalls: 'Dernières boules',
    allOut: 'Toutes les boules sont sorties',
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
    title: 'Vérifier un carton',
    need: {
      quine: 'Il faut 1 ligne complète.',
      double_quine: 'Il faut 2 lignes complètes.',
      carton_plein: 'Il faut les 3 lignes complètes.',
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
      `L'animateur vérifie le carton avec «${N}Vérifier un carton${N}». S'il y a plusieurs gagnants sur la même boule, ` +
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
