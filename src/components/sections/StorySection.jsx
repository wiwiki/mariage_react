import Multiline from '../Multiline'
import SmartImage from '../SmartImage'
import { Skeleton, SkeletonText } from '../Skeleton'

function StorySection({ content, loading }) {
  const paragraphs = content.storyLede.split('\n\n')

  return (
    <section className="story center" id="histoire">
      <div className="wrap story-wrap">
        <p className="eyebrow">{loading ? <Skeleton width="12ch" /> : content.storyEyebrow}</p>
        <p className="script story-script">
          {loading ? <Skeleton width="70%" height="1.2em" /> : <Multiline text={content.storyScript} />}
        </p>

        <div className="story-body">
          <div className="story-text">
            {loading ? (
              <>
                <SkeletonText lines={4} />
                <SkeletonText lines={4} />
              </>
            ) : (
              paragraphs.map((para, i) => <p key={i}>{para}</p>)
            )}
          </div>

          <div className="story-media">
            {loading ? (
              <div className="story-photo-frame img-frame">
                <span className="skeleton skeleton-fill" aria-hidden="true" />
              </div>
            ) : (
              content.pictureCouple.map((src, i) => (
                <SmartImage
                  key={i}
                  className="story-photo-frame"
                  imgClassName="story-photo"
                  src={src}
                  alt={content.pictureCouple.length > 1 ? `${content.storyImageAlt} (${i + 1})` : content.storyImageAlt}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default StorySection
