import SmartImage from '../SmartImage'
import { Skeleton, SkeletonText } from '../Skeleton'

function VenueSection({ content, loading }) {
  return (
    <section className="venue-sec center" id="lieu">
      <div className="wrap" style={{ maxWidth: '1000px' }}>
        <p className="eyebrow">{loading ? <Skeleton width="7ch" /> : content.venueEyebrow}</p>
        <h2 className="section-title">{loading ? <Skeleton width="16ch" /> : content.venueTitle}</h2>
        <p className="lede">{loading ? <SkeletonText lines={2} /> : content.venueLede}</p>
        <div className="venue-grid">
          <SmartImage
            className="venue-photo-frame"
            imgClassName="venue-photo"
            src={content.venuePhoto}
            alt={content.venuePhotoAlt}
          />
          <div className="venue-info">
            {loading ? (
              <>
                <h3><Skeleton width="20ch" /></h3>
                <p className="addr"><Skeleton width="24ch" /></p>
                <span className="label"><Skeleton width="14ch" /></span>
                <p><SkeletonText lines={2} /></p>
                <span className="label"><Skeleton width="10ch" /></span>
                <p><SkeletonText lines={2} /></p>
                <span className="label"><Skeleton width="12ch" /></span>
                <p><Skeleton width="20ch" /></p>
              </>
            ) : (
              <>
                <h3>{content.venueName}</h3>
                <p className="addr">{content.venueAddress}</p>

                <span className="label">{content.howToReachLabel}</span>
                <p>{content.howToReachText}</p>

                <span className="label">{content.accommodationLabel}</span>
                <p>{content.accommodationText}</p>

                <span className="label">{content.venueContactLabel}</span>
                <p>{content.venueContactText}</p>

                <a className="map-link" href={content.mapUrl} target="_blank" rel="noopener">
                  {content.mapLinkLabel}
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default VenueSection
