// Fully static — the hero never changes, so it renders instantly with no
// CMS fetch, no skeletons, and no dependency on the hero-banner single type.
function HeroSection() {
  return (
    <header className="hero" id="top">
      <div className="hero-leaf">❦</div>
      <p className="eyebrow">Nous nous marions</p>
      <div className="divider"></div>
      <h1>
        Anaïssia
        <span className="script amp">&amp;</span>
        Antoine
      </h1>
      <div className="meta">
        <span>19 Juin 2027</span>
        <span className="venue">Relais del Castello di Oviglio</span>
        <span className="venue">Piémont, Italie</span>
      </div>
    </header>
  )
}

export default HeroSection
