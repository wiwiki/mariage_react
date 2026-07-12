import SmartImage from '../SmartImage'
import venuePhoto from '../../assets/venue-castello.webp'

// Fully static — the copy is final, so it renders instantly with no CMS
// fetch and no skeletons (same pattern as HeroSection.jsx).
function VenueSection() {
  return (
    <section className="venue-sec center" id="lieu">
      <div className="wrap" style={{ maxWidth: '1000px' }}>
        <p className="eyebrow">Le lieu</p>
        <h2 className="section-title">Castello di Oviglio</h2>
        <p className="lede">
          Un château royal du Piémont, monument national depuis 1908, niché au cœur des
          vignobles entre le Monferrato et les Langhe.
        </p>
        <div className="venue-grid">
          <SmartImage
            className="venue-photo-frame"
            imgClassName="venue-photo"
            src={venuePhoto}
            alt="Le Castello di Oviglio et son parc"
          />
          <div className="venue-info">
            <h3>Relais del Castello di Oviglio</h3>
            <p className="addr">Via XXIV Maggio, 1 · 15026 Oviglio (AL) · Italie</p>

            <span className="label">Comment s'y rendre</span>
            <p>
              À mi-chemin entre Asti et Alessandria, au cœur du Piémont. Aéroports les plus
              proches : Turin (~1h), Gênes (~1h), Milan Malpensa (~1h30), Nice Côte d’Azur
              (~3h).
            </p>

            <span className="label">Hébergement</span>
            <p>
              De nombreuses petites auberges et hôtels sont disponibles à proximité du lieu.
              Nous vous transmettrons une liste d’hébergements recommandés dans les prochains
              mois, une fois le nombre d’invités confirmé.
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
  )
}

export default VenueSection
