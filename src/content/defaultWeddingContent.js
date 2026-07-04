import venueCastle from '../assets/venue-castle.jpg'

// Fallback copy — used until the Strapi section single types respond, and for
// any field left empty there. Keeps the site readable with zero backend.
// The hero section is fully static (see HeroSection.jsx) so it has no entry.
// Default images are bundled from src/assets (not hotlinked to Strapi media)
// so they keep working even if files are removed from the media library.
const defaultWeddingContent = {
  storyEyebrow: 'Notre histoire',
  storyScript: "Un château français rencontre\nun dîner d'été italien",
  storyLede:
    "Entre les collines du Piémont, sous les guirlandes de lumière et les oliviers, " +
    'nous célébrons notre amour entouré de ceux qui comptent. Une journée romantique, ' +
    "intime et élégante — avec un soupçon d'âme italienne.",

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
  venuePhotoAlt: 'Castello di Oviglio illuminé la nuit',
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
