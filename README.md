# HyggeHub

A Nordic glass design system for Home Assistant: ten custom cards, six complete themes, and an
**Appearance** panel where each person in the home picks their own day and night look.

- **Per-user looks.** Each Home Assistant user chooses a theme and frost level for
  day, and either another look for night or "Same as day". The choice is stored with the user, so it
  follows them to every device and never changes what anyone else sees.
- **When night starts** is per user too: follow the device's light/dark setting, follow the sun, or
  fixed times.
- **Whole themes, no accent picker.** Fjord, Birch and Lichen (light); Polar night, Aurora and Ember
  (dark). Each one sets the backdrop, glass, text, accent and status colours together, and also the Home
  Assistant colours the sidebar, header, dialogs and built-in cards use.

## Cards

| Card | What it shows |
| --- | --- |
| `hyggehub-header-card` | A slim row of status chips; a clock, greeting and date only if you switch them on |
| `hyggehub-notification-stack-card` | Home Assistant's notifications as a pile: tap to fan out, drag sideways to dismiss. Gone when there are none |
| `hyggehub-room-card` | A room: the main button toggles all its lights, plus fans, blinds, climate and a dimmer |
| `hyggehub-alarm-card` | The alarm's state in one circle; tapping it walks through mode → code → exit delay |
| `hyggehub-countdown-card` | A date, a weekly event, a timer, an `input_datetime` or a calendar entry |
| `hyggehub-bins-card` | The next bin collection with an icon for each kind of waste, then the next few, from your collection schedule |
| `hyggehub-lists-card` | To-do lists you swipe between, with a completed group and a shared note |
| `hyggehub-weather-card` | The place and current weather with falling snow or rain, an hours/days forecast you page through, and today's daylight |
| `hyggehub-media-card` | Now playing, with artwork, a live equaliser and controls |
| `hyggehub-appliance-card` | A washer or dryer with a spinning drum, time left and wash/rinse/spin phases |
| `hyggehub-energy-card` | Live power moving between solar, battery, grid and the home (needs live W/kW sensors) |
| `hyggehub-usage-card` | Electricity in and out, water and gas for today, this week or this month, from meters such as Målerportal |
| `hyggehub-family-card` | Everyone at once, plus the car as a chip. Tap a person or the car and the card becomes their page, with a breadcrumb back |

All cards follow Home Assistant's conventions: tap to act, hold (or right-click) for the entity's
more-info dialog. They size themselves for the sections view.

## Install

### 1. Build (or download a release)

```sh
npm ci
npm run build        # → dist/hyggehub.js
```

### 2. Add the file to Home Assistant

**HACS:** HACS → ⋮ → Custom repositories → add this repository as a *Dashboard* (plugin) and install
HyggeHub. HACS registers the resource for you, at a path like `/hacsfiles/HyggeHub/hyggehub.js`.
Check the exact path under Settings → Dashboards → ⋮ → Resources; the panel below needs the same one.

**By hand:** copy `dist/hyggehub.js` to `/config/www/hyggehub/hyggehub.js`, then add it under
Settings → Dashboards → ⋮ → Resources as a **JavaScript module** at `/local/hyggehub/hyggehub.js?v=0.1.0`.
Bump the `?v=` each time you replace the file, or browsers keep the old copy.

### 3. Add the Appearance page to the sidebar

**Without touching YAML (works on every install):** Settings → Dashboards → Add dashboard →
*New dashboard from scratch*, call it **Appearance**, pick the icon `mdi:palette-swatch-outline`, and
keep *Show in sidebar* on. Open it, ⋮ → Edit dashboard → ⋮ → Raw configuration editor, and paste:

```yaml
views:
  - title: Appearance
    type: panel
    cards:
      - type: custom:hyggehub-appearance-card
```

**Or as a real sidebar panel**, if you can edit `configuration.yaml` (for example with the File editor
add-on), pointing `module_url` at the same file as the resource:

```yaml
panel_custom:
  - name: hyggehub-appearance-panel
    sidebar_title: Appearance
    sidebar_icon: mdi:palette-swatch-outline
    url_path: appearance
    module_url: /hacsfiles/HyggeHub/hyggehub.js # the path from Resources; /local/hyggehub/hyggehub.js if installed by hand
```

Restart Home Assistant. Either way, every user sees the same page but edits only their own settings.

### 4. Build a dashboard

[`examples/dashboard.yaml`](examples/dashboard.yaml) is a full four-column dashboard. Paste it into a
new dashboard's raw configuration editor and change the entity ids.

In your Home Assistant profile, leave **Theme** on *Backend-selected*. HyggeHub writes its own
colours on top, and a second theme would only fight it.

## Card options

### Room

```yaml
type: custom:hyggehub-room-card
name: Kitchen
icon: mdi:pot-steam-outline
temperature: sensor.kitchen_temperature   # optional
humidity: sensor.kitchen_humidity         # optional
dimmer: light.kitchen_island              # optional brightness bar
entities:
  - light.kitchen_island
  - entity: fan.kitchen_hood
    icon: mdi:stove
  - entity: switch.cabinet_lights
    kind: light        # light | fan | cover | toggle | info; the room button switches every `light`
```

Lights, fans, covers, switches and input_booleans toggle on tap. Lights get a warm glow, fans
spin, and blinds show their slats opening or closing. A switch counts as a light when its id contains
"light" or "lamp", or when you set `kind: light`. Dragging the dimmer while the room is dark turns that
light on.

### Alarm

```yaml
type: custom:hyggehub-alarm-card
entity: alarm_control_panel.home
modes: [home, away, night, vacation]  # optional; defaults to what the panel supports
code_length: 4                        # submit after 4 digits; 0 = variable length with an OK key
exit_delay: 30                        # seconds, so the ring counts down while arming
entry_delay: 30                       # seconds, for the countdown while pending
sensors: [binary_sensor.front_door, binary_sensor.terrace_door]
mode_descriptions:
  night: Ground floor only
```

Panels without a code skip the keypad, and text codes get a password field. Home Assistant doesn't
publish how long an exit delay lasts, so without `exit_delay` the ring spins instead of counting down.
A wrong code shakes the dots and shows Home Assistant's error message.

### Countdown

```yaml
type: custom:hyggehub-countdown-card
name: Lofoten
style: ring                 # ring (big) or compact (a half-width tile)
icon: mdi:image-filter-hdr
target: "2026-12-18T09:40"  # or one of:
# entity: timer.sauna | input_datetime.x | sensor.<timestamp> | calendar.x
# weekly: { day: tue, time: "07:00" }
# yearly: true              # with target, repeats every year
start: "2026-08-20"         # optional: when the wait began, for the ring
value_entity: sensor.sauna_temperature  # optional: something rising towards a target
value_target: 80
animation: flicker          # flicker | pulse | none, for the icon
chips: [{ name: Paper }, { name: Plastic, color: ok }]  # accent | ok | warn | crit | warm | any CSS colour
done_text: Ready
```

### Lists

```yaml
type: custom:hyggehub-lists-card
lists:
  - entity: todo.shopping_list
    name: Groceries
    done_label: Got it
  - entity: todo.chores
    name: To do
    done_label: Done
note:
  entity: input_text.quick_note   # or a text.* entity
  name: Note
```

This works with any `todo` entity, such as the Shopping list or Local to-do integrations. Ticked items move to the
completed group, which is just Home Assistant's own completed status. Typing in the add box first
looks through the completed items, ignoring case. An exact match is restored when you press Enter
instead of being added twice, partial matches are offered, and anything already on the active list is
highlighted instead of duplicated. Swipe a row right to tick it off or restore it, and left to delete it.

The note tab saves to the entity you give it. `input_text` is limited to 255 characters (set `max: 255`
on the helper; the default is 100), and the card shows a counter.

### Bins

```yaml
type: custom:hyggehub-bins-card
upcoming: 3                         # later collections listed under the next one
schedule:                           # one entry per bin
  - { name: Rest og Mad,       day: mon, every_weeks: 2, first: "2026-10-19" }
  - { name: Papir/Pap og Glas, day: fri, every_weeks: 4, first: "2026-10-09" }
  - { name: Plast og Metal,    day: fri, every_weeks: 4, first: "2026-10-23" }
```

Each entry is one bin. `day` is the weekday it is collected, `every_weeks` how often (default 1), and
`first` any date it was or will be collected, which anchors fortnightly and four-weekly rounds. Bins
collected on the same day are shown together.

A bin's name decides its icons: "Papir/Pap og Glas" shows paper, cardboard and glass. For a
two-compartment bin, "og", "and", "&", "+" or "|" separates the compartments; the 3D energy card colours
each half of the lid by them. Built-in keywords cover the usual
Danish and English names (rest, mad, papir, pap, plast/MDK, glas, metal, farligt, tekstil, storskrald,
have); anything else is shown as written. Add your own names, keywords, colours and icons under `bins`:

```yaml
bins:
  - { name: Restaffald, match: rest, color: "#6b777d", icon: mdi:trash-can-outline }
```

The evening before a collection the card says *Put them out tonight* and its bins give a little hop.

### Notification stack

```yaml
type: custom:hyggehub-notification-stack-card
hide_when_empty: true        # default: no notifications, no card; false shows "All caught up"
rules:                       # optional, checked before the built-in ones
  - match: "sauna"
    icon: mdi:fire
    severity: ok             # info | ok | warn | crit
```

It shows persistent notifications (the bell in the sidebar). Dismissing one here dismisses it in
Home Assistant. Built-in rules pick an icon and colour for batteries, open doors, deliveries, finished
laundry, updates and security alerts.

### Family

Everyone in the home on one card: each person's portrait, where they are, what's next and their
battery, with "All home", "No one home" or "2 of 4 home" at the top. Cars sit as chips in the
top-right corner with their battery level.

**Tap a person or a car** and the whole card becomes their page, with a breadcrumb (*‹ Family ›
Mette*) to go back. A person's page has their whereabouts and since when, the plan for the day and
the next days, battery, the sleep toggle and any extra stats. The car's page shows the car, its
charge (with the limit marked), range, charging power and when it'll be full, the cable, climate
(tap to start or stop), doors and odometer. The card goes back to the family by itself after a
minute without a touch. Holding a person opens Home Assistant's own details for them.

```yaml
type: custom:hyggehub-family-card
people: [...]                        # see below
cars:
  - name: ID.5
    color: moonstone-grey            # moonstone-grey, glacier-white, black, blue, dark-blue, red, silver, green, or #hex
    battery: sensor.id5_battery_level
    range: sensor.id5_range
    charging: binary_sensor.id5_charging        # or a sensor whose state says "charging"
    charging_power: sensor.id5_charging_power   # W or kW
    time_to_full: sensor.id5_remaining_charging_time   # minutes, or a timestamp sensor
    target: sensor.id5_charge_limit             # %
    plugged: binary_sensor.id5_plug
    location: device_tracker.id5
    climate: climate.id5            # or a switch; its tile toggles it
    lock: lock.id5                  # shown only
    odometer: sensor.id5_odometer
```

For a Volkswagen, the **VW Group Connect** integration (in HACS) provides these entities. It updates
every few hours by default so as not to wake the car, so the page shows a recent snapshot.

Options for each person:

```yaml
- entity: person.alex                # optional: leave it out for someone without a tracker
  name: Alex                         # defaults to the person's name
  avatar:
    preset: man                      # woman | man | child | baby
    hair: brown                      # brown, dark-brown, light-brown, blonde, black, red, auburn, grey, or #hex
    eyes: hazel                      # blue, brown, hazel (green-brown), green, grey, or #hex
    skin: fair                       # light, fair, medium, tan, deep, or #hex
    shirt: "#40607a"                 # optional
  # picture: /local/avatars/alex.png # a real image instead of the drawn portrait
  battery: sensor.alex_phone_battery_level
  charging: sensor.alex_phone_battery_state   # a binary_sensor, or a sensor whose state is "charging"
  battery_label: Phone               # "Watch" for a GPS watch
  distance: sensor.home_alex_distance        # optional, shown while away (Proximity integration)
  calendar: calendar.alex            # one or a list; see "Where everyone is" below
  calendar_match: Alex               # optional, for a shared family calendar
  agenda: 2                          # upcoming events on the details side
  default_location: home             # optional, for someone with no tracker
  sleep: input_boolean.ella_asleep   # optional: a tap-to-toggle sleep row (see below)
  stats:
    - entity: sensor.alex_steps
      name: Steps today
      icon: mdi:shoe-print           # timestamp sensors read as "in 2 h 10 min" / "12 min ago"
```

```yaml
type: custom:hyggehub-family-card
title: Family
people:
  - entity: person.alex
    avatar: { preset: man, hair: brown, eyes: hazel }
    battery: sensor.alex_phone_battery_level
    calendar: calendar.alex
  - entity: person.sam
    avatar: { preset: woman, hair: brown, eyes: blue }
    battery: sensor.sam_phone_battery_level
    calendar: calendar.sam
  - entity: person.noah              # a GPS watch, if they get one; works without it too
    avatar: { preset: child, hair: brown, eyes: brown }
    calendar: calendar.noah
    default_location: home
  - name: Ella
    avatar: { preset: baby, hair: brown, eyes: blue }
    calendar: calendar.ella
    default_location: home
    sleep: input_boolean.ella_asleep
```

The portraits are drawn in code: shaded faces, glossy eyes and light on the hair, so they stay
sharp at any size and follow the theme. They breathe and blink, each on its own rhythm, and a
`sleep` entity closes their eyes and floats a few z's. The ring around a portrait shows where the person is:
green at home, accent colour in a named zone, grey away. It pulses for ten minutes after someone
arrives home.

The phone battery and charging sensors come with the Home Assistant Companion app. Turn them on
under the app's Settings → Companion App → Manage sensors.

#### Where everyone is

Two sources, combined. GPS says where someone *is*; the calendar says where they're *meant to be*
and what's next.

1. **GPS, when it knows a place.** The Companion app (or a GPS watch's integration) reports to a
   `person`. Draw each place once under Settings → Areas, labels & zones → Zones (`Work`, `School`,
   `Nursery`, `Grandparents`) and the person's state becomes that zone's name while they're in it.
   Home and named zones always win.
2. **The calendar, when GPS can't say.** If GPS only knows "away", or there is no tracker, the
   event happening right now supplies the place: a playdate added for Noah with a location shows
   as *Playdate at Lily's · Lily's house*, marked with a small calendar icon, until it ends.
3. **`default_location`**, when neither knows. `home` suits a toddler with no tracker.

The front of each tile shows the next event, e.g. *Football · 16:30*; the details side lists what's
on now and the next ones (`agenda`).

**Setting it up with Google Calendar.** Add the Google Calendar integration (Settings → Devices &
services → Add integration → Google Calendar) and sign in with the Google account that sees your
calendars. Every calendar it can see becomes an entity, including calendars shared with you, so
the plan is:

- one Google calendar per child (*Noah*, *Ella*) shared with both of you. Add their school
  hours as a recurring event with the school's address as the location, plus playdates, football and
  the doctor as one-off events.
- your own calendars as they are now, pointed to from your cards.

Prefer one shared family calendar instead? Put the name in the event, like *Noah: playdate at
Lily's*, and give each card `calendar_match: Noah`. Several names, comma-separated, match either.

Google Calendar syncs into Home Assistant every few minutes, so a new event can take a little
while to appear. The card re-reads the calendars each time an event starts or ends, and at least
every five minutes.

#### When Ella sleeps

Make an `input_boolean.ella_asleep` helper (Settings → Devices & services → Helpers → Toggle) and
set it as `sleep`. Their details side then has a sleep row you tap at bedtime and again when they
wake. While it's on, the portrait closes its eyes and the tile reads *Asleep*.

### Usage (meters)

For homes whose meters report totals (kWh, m³) rather than live power, such as the Danish
**Målerportal** integration. The card reads the same long-term statistics as Home Assistant's Energy
dashboard: today's hours, or this week's and this month's days, as small bars per meter, plus the net
(used or exported) and how recent the readings are, since meters like these report hours late.

```yaml
type: custom:hyggehub-usage-card
period: day                  # day | week | month, the view it opens on
meters:
  - entity: sensor.el_energi_dashboard
    kind: import             # import | export | water | gas | heat | other (guessed if left out)
  - entity: sensor.el_eksport_energi_dashboard
    kind: export
  - entity: sensor.koldt_vand_energi_dashboard
    kind: water
    name: Water              # optional
```

### Weather, media, appliance, energy, header

```yaml
type: custom:hyggehub-weather-card
entity: weather.home
name: Sønderborg             # the place shown at the top; defaults to Home Assistant's location name
slots: 6                     # forecast slots per page; arrows page through the rest
view: hourly                 # hourly | daily, the view it opens on (Hours / Days switch on the card)

type: custom:hyggehub-media-card
entity: media_player.living_room    # one speaker, or several (speakers and groups):
# entities:                         # follows whichever is playing; chips switch between them
#   - media_player.kitchen
#   - entity: media_player.whole_house
#     name: Everywhere
volume: true                        # the volume bar; false hides it

type: custom:hyggehub-appliance-card
name: Washing machine
entity: sensor.washer_status        # running states: run, wash, rinse, spin, drying… (override with running_states)
machine: washer                     # washer | dryer
remaining_entity: sensor.washer_remaining   # minutes, or a timestamp sensor
total_minutes: 95
program_entity: sensor.washer_program
phase_entity: sensor.washer_phase   # optional; matched against phases
phases: [Wash, Rinse, Spin]
power_entity: sensor.washer_power   # optional alternative: running above power_threshold watts
power_threshold: 5

type: custom:hyggehub-energy-card
solar: sensor.solar_power           # W or kW
grid: sensor.grid_power             # + import, − export; or import only, with:
# grid_export: sensor.grid_export_power   # when export is its own sensor
battery: sensor.battery_power       # + discharging, − charging
battery_soc: sensor.battery_level
extras: [{ name: Spot price, entity: sensor.spot_price }]

type: custom:hyggehub-header-card
chips: [{ entity: lock.front_door, icon: mdi:lock-outline }]
people: [person.alex, person.sam]   # optional "All home / 2 of 3 home" chip
clock: false                        # clock, greeting and date are all off by default
greeting: false
date: false
```

## How the theming works

`src/theme/engine.ts` is the only global state. Each card and the panel hand it `hass`. On a user's
first load it reads their Appearance with `frontend/get_user_data` (key `hyggehub_appearance`) and
subscribes to changes, so a change made on a phone shows up on the wall tablet signed in as the same
user. It caches a copy per device so a reload paints the right look before the websocket answers.

The resolved palette is written as CSS custom properties on `<html>`: the `--hh-*` tokens the cards
use, plus the Home Assistant variables listed in `apply()`. The backdrop is
`--lovelace-background`, built from four soft colour fields that stand still. An earlier version moved
them by animating values on `<html>`, which restyled the whole page every frame and made the iPhone app
reload its page every half-minute or so. Only values that changed are written, for the same reason.

### Animation rules

The cards follow the rules that keep animated dashboards smooth on phones:

- **Only `transform` and `opacity`, on whole elements.** The graphics chip moves and fades those
  without repainting. Animating shadows, filters, heights, or anything inside an SVG drawing repaints
  every frame. Pulses are rings that scale and fade; the portraits breathe as a whole; the equaliser
  scales its bars.
- **Never animate page-wide values.** Anything set on `<html>` restyles every element on the page.
- **Pause what isn't seen.** Every card watches whether it's on screen and pauses its animations when
  it isn't; the weather's snow and rain only run while it's actually snowing or raining.
- **Occasional beats constant.** A blink is a 150 ms class change every few seconds, not an animation
  that runs forever.

## Developing

```sh
npm run dev      # http://localhost:5173/dev/index.html
```

`dev/` holds a stand-in Home Assistant: realistic entities, services that change them, and the
websocket subscriptions the cards use (notifications, to-do items, forecasts, per-user storage). The
"Signed in as" button in the sidebar switches between two users, so you can watch each one keep
their own appearance. The alarm code is `1234`.

`npm run typecheck` and `npm run build` must both pass before a release.

## Status

Version 0.1.0. Every card has been built, type-checked and checked visually against the stand-in
Home Assistant in `dev/`. It has **not been run against a real Home Assistant yet**. These are the
parts most likely to need adjusting there:

- whether Home Assistant re-applies its own theme over HyggeHub's colours at moments the engine
  doesn't catch (the engine re-applies after any theme or dark-mode change it sees)
- `frontend/subscribe_user_data`, which older cores lack (reading and saving still work without it)
- integration-specific state names for appliances (use `running_states` and `phases` to match yours)
