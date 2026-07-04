import { Link } from 'react-router-dom'
import Multiline from '../Multiline'
import { Skeleton, SkeletonText } from '../Skeleton'

function RsvpSection({ content, loading }) {
  return (
    <section className="rsvp" id="rsvp">
      <div className="wrap">
        <p className="eyebrow">{loading ? <Skeleton width="14ch" onDark /> : content.rsvpEyebrow}</p>
        <h2 className="section-title">
          {loading ? <Skeleton width="60%" onDark /> : <Multiline text={content.rsvpTitle} />}
        </h2>
        <p>{loading ? <SkeletonText lines={2} onDark /> : content.rsvpDeadlineText}</p>
        <Link className="btn" to="/rsvp">
          {loading ? <Skeleton width="16ch" onDark /> : content.rsvpButtonLabel}
        </Link>
        <div className="date-line">
          {loading ? <Skeleton width="22ch" onDark /> : content.rsvpDateLine}
        </div>
      </div>
    </section>
  )
}

export default RsvpSection
