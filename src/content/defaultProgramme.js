// Fallback programme copy — used until the Strapi `programme` single type
// responds, and for any field left empty there. Mirrors the published Strapi
// content as of 2026-07-12 so an unreachable backend still shows the real
// schedule. Every other section is hardcoded in its component.
const defaultProgramme = {
  programmeEyebrow: 'Le déroulé',
  programmeTitle: 'Programme de la journée',
  programmeItems: [
    { time: '17:00', title: 'Cérémonie', description: 'Échange des vœux sous les arbres' },
    { time: '18:00', title: 'Aperitivo', description: 'Vins du Piémont & bouchées italiennes' },
    { time: '20:00', title: 'Dîner', description: 'Repas dans une grande salle décorée 1700' },
    { time: '22:00', title: 'Torta', description: 'Découpe sous les guirlandes lumineuses' },
    { time: '22:00 +', title: 'Danse', description: "Première danse & fête jusqu'au bout de la nuit" },
  ],
}

export default defaultProgramme
