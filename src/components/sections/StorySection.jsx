import Multiline from '../Multiline'
import { Skeleton, SkeletonText } from '../Skeleton'

function StorySection({ content, loading }) {
  return (
    <section className="story center" id="histoire">
      <div className="wrap">
        <p className="eyebrow">{loading ? <Skeleton width="12ch" /> : content.storyEyebrow}</p>
        <p className="script">
          {loading ? <Skeleton width="70%" height="1.2em" /> : <Multiline text={content.storyScript} />}
        </p>
        <p className="lede">{loading ? <SkeletonText lines={3} /> : content.storyLede}</p>
      </div>
    </section>
  )
}

export default StorySection
