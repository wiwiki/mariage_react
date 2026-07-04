import { Skeleton } from '../Skeleton'

function SiteFooter({ content, loading }) {
  return (
    <footer>
      <div className="script">{content.footerScript}</div>
      <div className="tagline">{loading ? <Skeleton width="30ch" onDark /> : content.footerTagline}</div>
    </footer>
  )
}

export default SiteFooter
