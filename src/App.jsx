function App() {
  return (
    <>
      <nav>
        <a href="#histoire">Histoire</a>
        <a href="#programme">Programme</a>
        <a href="#lieu">Lieu</a>
        <a href="#rsvp">RSVP</a>
      </nav>

      {/* HERO */}
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

      {/* HISTOIRE */}
      <section className="story center" id="histoire">
        <div className="wrap">
          <p className="eyebrow">Notre histoire</p>
          <p className="script">
            Un château français rencontre
            <br />
            un dîner d'été italien
          </p>
          <p className="lede">
            Entre les collines du Piémont, sous les guirlandes de lumière et les oliviers,
            nous célébrons notre amour entouré de ceux qui comptent. Une journée romantique,
            intime et élégante — avec un soupçon d'âme italienne.
          </p>
        </div>
      </section>

      {/* PROGRAMME */}
      <section className="program center" id="programme">
        <div className="wrap">
          <p className="eyebrow">Le déroulé</p>
          <h2 className="section-title">Programme de la journée</h2>
          <div className="timeline">
            <div className="tl-item">
              <div className="tl-time">16:00</div>
              <div className="tl-event">
                <h3>Cérémonie</h3>
                <p>Échange des vœux sous les oliviers</p>
              </div>
            </div>
            <div className="tl-item">
              <div className="tl-time">17:30</div>
              <div className="tl-event">
                <h3>Aperitivo</h3>
                <p>Vins du Piémont &amp; bouchées italiennes</p>
              </div>
            </div>
            <div className="tl-item">
              <div className="tl-time">19:30</div>
              <div className="tl-event">
                <h3>Dîner</h3>
                <p>Longues tables, lin naturel &amp; bougies</p>
              </div>
            </div>
            <div className="tl-item">
              <div className="tl-time">21:30</div>
              <div className="tl-event">
                <h3>Gâteau</h3>
                <p>Découpe sous les guirlandes lumineuses</p>
              </div>
            </div>
            <div className="tl-item">
              <div className="tl-time">22:00</div>
              <div className="tl-event">
                <h3>Danse</h3>
                <p>Première danse &amp; fête jusqu'au bout de la nuit</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LIEU */}
      <section className="venue-sec center" id="lieu">
        <div className="wrap" style={{ maxWidth: '1000px' }}>
          <p className="eyebrow">Le lieu</p>
          <h2 className="section-title">Castello di Oviglio</h2>
          <p className="lede">
            Un château royal du Piémont, monument national depuis 1908, niché au cœur des
            vignobles entre le Monferrato et les Langhe.
          </p>
          <div className="venue-grid">
            <img
              className="venue-photo"
              src="https://www.castellodioviglio.it/wp-content/uploads/2017/03/slide-home-01.jpg"
              alt="Castello di Oviglio illuminé la nuit"
            />
            <div className="venue-info">
              <h3>Relais del Castello di Oviglio</h3>
              <p className="addr">Via XXIV Maggio, 1 · 15026 Oviglio (AL) · Italie</p>

              <span className="label">Comment s'y rendre</span>
              <p>
                À mi-chemin entre Asti et Alessandria, dans le Piémont. Aéroports les plus
                proches : Turin (~1h), Gênes (~1h) et Milan Malpensa (~1h30).
              </p>

              <span className="label">Hébergement</span>
              <p>
                Le château dispose de neuf chambres de caractère sur place. Nous vous
                communiquerons une liste d'hébergements aux alentours.
              </p>

              <span className="label">Contact du lieu</span>
              <p>(+39) 0131 776166 · info@castellodioviglio.it</p>

              <a
                className="map-link"
                href="https://www.google.com/maps/search/?api=1&query=Castello+di+Oviglio+Via+XXIV+Maggio+1+15026+Oviglio+AL+Italy"
                target="_blank"
                rel="noopener"
              >
                Voir sur la carte
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* RSVP */}
      <section className="rsvp" id="rsvp">
        <div className="wrap">
          <p className="eyebrow">Réponse souhaitée</p>
          <h2 className="section-title">
            Nous serions ravis
            <br />
            de votre présence
          </h2>
          <p>
            Merci de confirmer votre présence avant le 1<sup>er</sup> mars 2027. Pour toute
            question concernant l'hébergement ou le voyage, n'hésitez pas à nous écrire.
          </p>
          <a
            className="btn"
            href="mailto:antoine.sifoni@medfarsolutions.com?subject=RSVP%20Mariage%20Ana%C3%AFssia%20%26%20Antoine"
          >
            Confirmer ma présence
          </a>
          <div className="date-line">19 · 06 · 2027 — Piémont, Italie</div>
        </div>
      </section>

      <footer>
        <div className="script">Anaïssia &amp; Antoine</div>
        <div className="tagline">Romantique · Minimal · Élégant · Intemporel · Italian Soul</div>
      </footer>
    </>
  )
}

export default App
