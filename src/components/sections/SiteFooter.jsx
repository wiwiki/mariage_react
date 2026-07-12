// Fully static — the copy is final, so it renders instantly with no CMS
// fetch and no skeletons (same pattern as HeroSection.jsx).
function SiteFooter() {
  return (
    <footer>
      <div className="script">Anaïssia & Antoine</div>
      <div className="tagline">Célébration · Romance · Dolce vita à l’italienne</div>
    </footer>
  )
}

export default SiteFooter
