// Three-way age selector with little line-art figures, matching the site's
// stroke-icon style. Built on visually-hidden native radio inputs so keyboard
// behavior (arrow keys, Tab, Space) and screen-reader semantics come from the
// browser; the styled <span> next to each input is what the eye sees.
function AdultIcon() {
  return (
    <svg viewBox="0 0 24 30" width="26" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="5.5" r="3.2" />
      <path d="M12 9 v9" />
      <path d="M6.5 12.5 h11" />
      <path d="M12 18 l-3.8 8 M12 18 l3.8 8" />
    </svg>
  )
}

function ChildIcon() {
  return (
    <svg viewBox="0 0 24 30" width="26" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="10" r="2.8" />
      <path d="M12 13 v7" />
      <path d="M7.5 15.5 h9" />
      <path d="M12 20 l-3 6 M12 20 l3 6" />
    </svg>
  )
}

function BabyIcon() {
  return (
    <svg viewBox="0 0 24 30" width="26" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="14" r="3.6" />
      <path d="M12 10.4 q0.4 -1.8 1.9 -2.3" />
      <path d="M8.2 26 a3.8 3.8 0 0 1 7.6 0" />
    </svg>
  )
}

const OPTIONS = [
  { value: 'adult', label: 'Adulte', Icon: AdultIcon },
  { value: 'child', label: 'Enfant', Icon: ChildIcon },
  { value: 'baby', label: 'Bébé', Icon: BabyIcon },
]

// `name` must be unique per guest so each card is its own radio group.
function AgeGroupPicker({ name, value, onChange, disabled }) {
  return (
    <div className="age-picker">
      {OPTIONS.map(({ value: option, label, Icon }) => (
        <label className="age-option" key={option}>
          <input
            className="visually-hidden"
            type="radio"
            name={name}
            value={option}
            checked={value === option}
            onChange={() => onChange(option)}
            disabled={disabled}
          />
          <span className="age-option-inner">
            <Icon />
            <span>{label}</span>
          </span>
        </label>
      ))}
    </div>
  )
}

export default AgeGroupPicker
