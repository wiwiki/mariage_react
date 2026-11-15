import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { categories, onSite } from '../content/hebergements'
import SiteFooter from '../components/sections/SiteFooter'

const tel = (phone) => `tel:${phone.replace(/\s/g, '')}`

function Contact({ place }) {
  const { phones = [], email, url } = place
  if (!phones.length && !email) {
    return url ? (
      <a href={url} target="_blank" rel="noopener">
        Via le site
      </a>
    ) : (
      '—'
    )
  }
  return (
    <>
      {phones.map((phone) => (
        <a key={phone} href={tel(phone)}>
          {phone}
        </a>
      ))}
      {email && <a href={`mailto:${email}`}>{email}</a>}
    </>
  )
}

function PlaceRow({ place }) {
  return (
    <tr>
      <td className="stay-name">
        {place.url ? (
          <a href={place.url} target="_blank" rel="noopener">
            {place.name}
          </a>
        ) : (
          <span>{place.name}</span>
        )}
        <span className="stay-place">{place.place}</span>
        <span className="stay-note">{place.note}</span>
      </td>
      <td data-label="En voiture">{place.drive}</td>
      <td data-label="Chambres">{place.rooms || '—'}</td>
      <td data-label="Prix / nuit" className="stay-price">
        <span>
          {place.price}
          {place.estimated && <sup>†</sup>}
        </span>
      </td>
      <td data-label="Contact" className="stay-contact">
        <div>
          <Contact place={place} />
        </div>
      </td>
    </tr>
  )
}

function HebergementPage() {
  // HashRouter keeps the scroll position of the page we came from.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  return (
    <>
      <section className="stay-page">
        <div className="wrap stay-wrap">
          <Link className="rsvp-back" to="/">
            ← Retour au mariage
          </Link>

          <header className="center">
            <p className="eyebrow">Hébergement</p>
            <h1 className="section-title">Où dormir autour du château</h1>
            <p className="lede">
              Une sélection d’hébergements près d’Oviglio : tout près et abordables, agritourismes dans les
              vignes, et adresses plus chic un peu plus loin. Les temps de trajet sont en voiture depuis le
              château.
            </p>
            <ul className="stay-facts">
              <li>Juin est la haute saison : réservez tôt</li>
              <li>Une voiture est presque indispensable</li>
              <li>Aéroports : Turin ou Gênes ~1 h, Milan ~1 h 30</li>
            </ul>
          </header>

          <aside className="stay-onsite">
            <p className="eyebrow">Sur place</p>
            <h2>{onSite.name}</h2>
            <p>{onSite.text}</p>
            <p className="stay-price">{onSite.price}</p>
            <p className="stay-onsite-contact">
              {onSite.address} · <a href={tel(onSite.phone)}>{onSite.phone}</a> ·{' '}
              <a href={onSite.url} target="_blank" rel="noopener">
                Voir la fiche
              </a>
            </p>
          </aside>

          {categories.map((category) => (
            <section className="stay-category" key={category.id} aria-labelledby={`stay-${category.id}`}>
              <h2 id={`stay-${category.id}`}>{category.title}</h2>
              <p className="stay-intro">{category.intro}</p>
              <table className="stay-table">
                <thead>
                  <tr>
                    <th scope="col">Établissement</th>
                    <th scope="col">En voiture</th>
                    <th scope="col">Chambres</th>
                    <th scope="col">Prix / nuit*</th>
                    <th scope="col">Contact</th>
                  </tr>
                </thead>
                <tbody>
                  {category.places.map((place) => (
                    <PlaceRow key={place.name} place={place} />
                  ))}
                </tbody>
              </table>
            </section>
          ))}

          <div className="stay-footnotes">
            <p>
              * Prix indicatif pour une chambre double, par nuit, relevé sur les sites de réservation en
              2025–2026. Un samedi de juin se situe plutôt dans le haut de la fourchette. Ajoutez la taxe de
              séjour (environ 2 € par personne et par nuit).
            </p>
            <p>† Aucun tarif publié : fourchette des établissements comparables du secteur.</p>
            <p>
              Le nombre de chambres et les prix peuvent avoir changé : vérifiez au moment de réserver. Pour
              les petits établissements, un appel ou un WhatsApp au numéro mobile (ceux qui commencent par
              3) est souvent plus rapide qu’un courriel.
            </p>
          </div>
        </div>
      </section>
      <SiteFooter />
    </>
  )
}

export default HebergementPage
