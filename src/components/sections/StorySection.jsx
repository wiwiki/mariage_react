import SmartImage from '../SmartImage'
import coupleStory from '../../assets/couple-story.jpg'

// Fully static — the copy is final, so it renders instantly with no CMS
// fetch and no skeletons (same pattern as HeroSection.jsx).
function StorySection() {
  return (
    <section className="story center" id="histoire">
      <div className="wrap story-wrap">
        <p className="eyebrow">Notre histoire</p>
        <p className="script story-script">
          Rencontrés à Montréal,
          <br />
          unis en Italie
        </p>

        <div className="story-body">
          <div className="story-text">
            <p>
              C’est en Italie, plus précisément dans le Piémont, que nous avons choisi de
              célébrer notre mariage avec vous, entourés des personnes que nous aimons et qui
              font partie de notre histoire.
            </p>
            <p>
              Antoine est né et a grandi au Québec, Anaïssia est née et a grandi dans le sud
              de la France. Deux parcours, deux cultures, deux histoires qui se sont
              rencontrées à Montréal en 2018, où nous avons construit une grande partie de
              notre vie.
            </p>
            <p>
              Issues de familles aux racines internationales, et avec une partie de nos
              ancêtres venant d’Italie, il semblait presque évident que l’union Sifoni et
              Franca soit célébrée ici.
            </p>
            <p>
              Nous savons que ce mariage représentera un voyage pour la majorité d’entre
              vous, et nous vous serons éternellement reconnaissants de faire le déplacement
              pour partager avec nous ce moment si précieux.
            </p>
            <p>
              C’est ici, entre une partie de nos racines, nos histoires et tous ceux qui nous
              accompagnent, que nous avons choisi de commencer le prochain chapitre de notre
              vie.
            </p>
            <p>
              Le Castello di Oviglio, témoin du temps depuis le XIVᵉ siècle, a traversé les
              époques en conservant tout son charme et son authenticité.
            </p>
            <p>
              Préparez-vous à une soirée romantique, faite de belles surprises, de
              gastronomie italienne, de rires… et probablement de quelques larmes.
            </p>
          </div>

          <div className="story-media">
            <SmartImage
              className="story-photo-frame"
              imgClassName="story-photo"
              src={coupleStory}
              alt="Anaïssia & Antoine"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default StorySection
