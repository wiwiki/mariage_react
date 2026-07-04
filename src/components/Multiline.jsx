// Renders text with literal "\n" line breaks (used for CMS fields that map
// onto multi-line headings) as separate lines.
function Multiline({ text }) {
  const lines = text.split('\n')
  return lines.map((line, i) => (
    <span key={i}>
      {i > 0 && <br />}
      {line}
    </span>
  ))
}

export default Multiline
