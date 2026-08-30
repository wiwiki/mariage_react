import { createClient } from "jsr:@supabase/supabase-js@2"

const CODE_PATTERN = /^[A-Z0-9]{6}$/
// Single source of truth: each meal choice and the column its attending-count
// lands in. Keep in sync with mealChoice in the guests JSON shape, and with
// MEAL_OPTIONS in src/pages/rsvp/RsvpForm.jsx — a choice with no column here is
// counted nowhere, and a column here that the table lacks fails the whole write.
const MEAL_TYPES = [
  { value: "standard",   column: "count_standard" },
  { value: "vegetarian", column: "count_vegetarian" },
  { value: "vegan",      column: "count_vegan" },
] as const
const MEAL_CHOICES = MEAL_TYPES.map((m) => m.value)
const AGE_GROUPS = ["adult", "child", "baby"]
const MAX_GUESTS = 10

// The frontend is on a different origin (mariagefranca.sifoni.ca), so preflight
// has to be handled explicitly or every POST fails in the browser.
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "content-type, authorization, apikey",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
}

// Under the new key scheme the secret keys arrive as a JSON object, not a plain
// string like the legacy SUPABASE_SERVICE_ROLE_KEY did.
const admin = createClient(
  Deno.env.get("SUPABASE_URL")!,
  JSON.parse(Deno.env.get("SUPABASE_SECRET_KEYS")!)["default"],
)

function json(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, "Content-Type": "application/json" },
  })
}

// An allowlist, not a denylist. Two reasons: a column added later cannot leak by
// accident (code and invite_link above all — invite_link embeds the code), and the
// camelCase output keeps the response identical to what Strapi returned, so the
// frontend's RsvpForm needs no changes.
function sanitize(row: Record<string, any>) {
  return {
    householdName:    row.household_name,
    maxGuests:        row.max_guests,
    rsvpStatus:       row.rsvp_status,
    messageToCouple:  row.message_to_couple,
    respondedAt:      row.responded_at,
    countAdult:       row.count_adult,
    countChild:       row.count_child,
    countBaby:        row.count_baby,
    countStandard:    row.count_standard,
    countVegetarian:  row.count_vegetarian,
    countVegan:       row.count_vegan,
  }
}

async function findByCode(rawCode: unknown) {
  const code = String(rawCode ?? "").trim().toUpperCase()
  if (!CODE_PATTERN.test(code)) return null

  const { data } = await admin
    .from("invitations").select("*").eq("code", code).maybeSingle()
  return data
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS })

  const action = new URL(req.url).pathname.split("/").pop()
  const body = await req.json().catch(() => ({}))
  const invitation = await findByCode(body?.code)

  if (!invitation) return json(404, { error: "invalid_code" })

  if (action === "verify") {
    return json(200, {
      invitation: sanitize(invitation),
      guests: invitation.guests ?? [],
    })
  }

  if (action !== "submit") return json(404, { error: "not_found" })

  if (invitation.rsvp_status !== "pending") {
    return json(409, { error: "already_responded" })
  }

  const maxGuests = Number.isInteger(invitation.max_guests) && invitation.max_guests > 0
    ? Math.min(invitation.max_guests, MAX_GUESTS)
    : MAX_GUESTS

  const rawGuests = Array.isArray(body?.guests) ? body.guests : []
  const guests = rawGuests.slice(0, maxGuests).map((g: any) => ({
    firstName: typeof g?.firstName === "string" ? g.firstName : "",
    lastName: typeof g?.lastName === "string" ? g.lastName : "",
    attending: Boolean(g?.attending),
    mealChoice: MEAL_CHOICES.includes(g?.mealChoice) ? g.mealChoice : null,
    allergies: typeof g?.allergies === "string" ? g.allergies : null,
    ageGroup: AGE_GROUPS.includes(g?.ageGroup) ? g.ageGroup : "adult",
  }))

  const attendees = guests.filter((g) => g.attending)
  const mealCounts = Object.fromEntries(
    MEAL_TYPES.map(({ value, column }) => [
      column, attendees.filter((g) => g.mealChoice === value).length,
    ]),
  )

  // Never report success on an unwritten RSVP: a false confirmation screen means
  // the guest walks away believing they replied and never tries again.
  const { error } = await admin.from("invitations").update({
    guests,
    rsvp_status: attendees.length > 0 ? "confirmed" : "declined",
    count_adult: attendees.filter((g) => g.ageGroup === "adult").length,
    count_child: attendees.filter((g) => g.ageGroup === "child").length,
    count_baby:  attendees.filter((g) => g.ageGroup === "baby").length,
    ...mealCounts,
    responded_at: new Date().toISOString(),
    ...(typeof body?.message === "string" ? { message_to_couple: body.message } : {}),
  }).eq("id", invitation.id)

  if (error) {
    console.error("rsvp submit failed", invitation.id, error)
    return json(500, { error: "submit_failed" })
  }

  return json(200, { success: true })
})
