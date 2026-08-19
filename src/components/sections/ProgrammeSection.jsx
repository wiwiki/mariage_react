import { Skeleton } from '../Skeleton'

const SKELETON_ROWS = 5

// The heading is hardcoded so guests immediately see what this section is
// while the timeline loads — only the schedule items come from the backend.
function ProgrammeSection({ content, loading }) {
  return (
    <section className="program center" id="programme">
      <div className="wrap">
        <p className="eyebrow">Le déroulé</p>
        <h2 className="section-title">Programme de la journée</h2>
        <div className="timeline">
          {loading
            ? Array.from({ length: SKELETON_ROWS }, (_, i) => (
                <div className="tl-item" key={i}>
                  <div className="tl-time"><Skeleton width="4ch" onDark /></div>
                  <div className="tl-event">
                    <h3><Skeleton width="9ch" onDark /></h3>
                    <p><Skeleton width="75%" onDark /></p>
                  </div>
                </div>
              ))
            : content.programmeItems.map((item) => (
                <div className="tl-item" key={`${item.time}-${item.title}`}>
                  <div className="tl-time">{item.time}</div>
                  <div className="tl-event">
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </section>
  )
}

export default ProgrammeSection
