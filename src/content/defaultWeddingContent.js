import venueCastle from '../assets/venue-fallback.png'
import coupleStory from '../assets/couple-story.jpg'

// Fallback copy — used until the Strapi section single types respond, and for
// any field left empty there. Keeps the site readable with zero backend.
// The hero section is fully static (see HeroSection.jsx) so it has no entry.
// Default images are bundled from src/assets (not hotlinked to Strapi media)
// so they keep working even if files are removed from the media library.
const defaultWeddingContent = {
  storyEyebrow: 'Notre histoire',
  storyScript: 'Rencontrés à Montréal,\nunis en Italie',
  // Paragraphs are separated by a blank line (\n\n) and rendered as separate
  // <p>. If Strapi later sends a long-text value, the same split applies.
  storyLede:
    'C’est en Italie, plus précisément dans le Piémont, que nous avons choisi de ' +
    'célébrer notre mariage avec vous, entourés des personnes qui nous aiment et qui ' +
    'font partie de notre histoire.\n\n' +
    'Antoine est né et a grandi au Québec, Anaïssia est née et a grandi dans le sud de ' +
    'la France. Deux parcours, deux cultures, deux histoires qui se sont rencontrées à ' +
    'Montréal en 2018, où nous avons construit une grande partie de notre vie. Issues de ' +
    'familles aux racines internationales, et avec une partie de nos ancêtres venant ' +
    'd’Italie, il semblait presque évident que l’union Sifoni et Franca devait se ' +
    'célébrer ici.\n\n' +
    'Nous savons que ce mariage représentera un voyage pour la majorité d’entre vous, et ' +
    'nous vous serons éternellement reconnaissants de faire le déplacement pour partager ' +
    'avec nous ce moment si précieux. C’est ici, entre une partie de nos racines, nos ' +
    'histoires et tous ceux qui nous accompagnent, que nous avons choisi d’écrire le ' +
    'prochain chapitre de notre vie.\n\n' +
    'Le Castello di Oviglio, témoin du temps depuis le XIVᵉ siècle, a traversé les époques ' +
    'en conservant tout son charme et son authenticité. Préparez-vous à une soirée ' +
    'romantique, faite de belles surprises, de gastronomie italienne, de rires… et ' +
    'probablement de quelques larmes.',
  // Strapi field `pictureCouple` is an array of images; a single bundled photo
  // is the fallback when it's absent/empty.
  pictureCouple: [coupleStory],
  storyImageAlt: 'Anaïssia & Antoine',

  programmeEyebrow: 'Le déroulé',
  programmeTitle: 'Programme de la journée',
  programmeItems: [
    { time: '16:00', title: 'Cérémonie', description: 'Échange des vœux sous les oliviers' },
    { time: '17:30', title: 'Aperitivo', description: 'Vins du Piémont & bouchées italiennes' },
    { time: '19:30', title: 'Dîner', description: 'Longues tables, lin naturel & bougies' },
    { time: '21:30', title: 'Gâteau', description: 'Découpe sous les guirlandes lumineuses' },
    { time: '22:00', title: 'Danse', description: "Première danse & fête jusqu'au bout de la nuit" },
  ],

  venueEyebrow: 'Le lieu',
  venueTitle: 'Castello di Oviglio',
  venueLede:
    'Un château royal du Piémont, monument national depuis 1908, niché au cœur des ' +
    'vignobles entre le Monferrato et les Langhe.',
  venuePhoto: venueCastle,
  venuePhotoAlt: 'Le Castello di Oviglio et son parc',
  venueName: 'Relais del Castello di Oviglio',
  venueAddress: 'Via XXIV Maggio, 1 · 15026 Oviglio (AL) · Italie',
  howToReachLabel: "Comment s'y rendre",
  howToReachText:
    'À mi-chemin entre Asti et Alessandria, dans le Piémont. Aéroports les plus ' +
    'proches : Turin (~1h), Gênes (~1h) et Milan Malpensa (~1h30).',
  accommodationLabel: 'Hébergement',
  accommodationText:
    'Le château dispose de neuf chambres de caractère sur place. Nous vous ' +
    "communiquerons une liste d'hébergements aux alentours.",
  venueContactLabel: 'Contact du lieu',
  venueContactText: '(+39) 0131 776166 · info@castellodioviglio.it',
  mapUrl:
    'https://www.google.com/maps/search/?api=1&query=Castello+di+Oviglio+Via+XXIV+Maggio+1+15026+Oviglio+AL+Italy',
  mapLinkLabel: 'Voir sur la carte',

  rsvpEyebrow: 'Réponse souhaitée',
  rsvpTitle: 'Nous serions ravis\nde votre présence',
  rsvpDeadlineText:
    "Merci de confirmer votre présence avant le 1er mars 2027. Pour toute " +
    "question concernant l'hébergement ou le voyage, n'hésitez pas à nous écrire.",
  rsvpButtonLabel: 'Confirmer ma présence',
  rsvpDateLine: '19 · 06 · 2027 — Piémont, Italie',

  footerScript: 'Anaïssia & Antoine',
  footerTagline: 'Romantique · Minimal · Élégant · Intemporel · Italian Soul',
}

export default defaultWeddingContent
