# NOCTERRA design direction

NOCTERRA is a browser-based personal dashboard for a laptop or projector. The main view keeps the time and today's planning visible together in a single viewport.

- Midnight Blue sets the screen: `#080F1C` for the ground, `#14243D` for dashboard surfaces, and `#D6FF45` for the few active or current states.
- The layout uses an editorial hierarchy: a large local clock, a quiet date line, and compact panels for the calendar, tasks, upcoming schedule, weather, and GitHub activity.
- Georgia gives the clock and headings a measured editorial character. Segoe UI keeps labels and controls familiar on Windows.
- The calendar and clock use the device's local time. Tasks are stored in browser local storage. Weather and GitHub remain clearly disconnected until a data source is configured.
- The dashboard fits one viewport without page or nested scrolling. Smaller screens reflow the panels while keeping every section visible.
- Dial: ENERGY 2 / RHYTHM 2 / MOTION 1. The clock anchors the first scan; the calendar, tasks, and agenda share the upper row, while the GitHub grid gets twice the weather width for its week columns. Motion stays with the live clock and direct interaction feedback.
- Lime marks the NOCTERRA wordmark, current date and time, and primary task action. Panel icons and borders stay subdued so the accent retains its hierarchy.
