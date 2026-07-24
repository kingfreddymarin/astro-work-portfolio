# Double-tap = right-click on touch screens

**Status:** backlog

## Problem
On phones/tablets there's no right-click. Any UI that relies on a
right-click / context-menu event (e.g. `contextmenu` listeners) is
currently unreachable via touch.

## Proposal
Detect a double-tap gesture on touch devices and treat it as the
equivalent of a right-click, triggering the same context-menu behavior
that `contextmenu` triggers on desktop.

## Notes
- Need to identify which components currently listen for `contextmenu`
  in this codebase and route the double-tap handler to the same logic.
- Should not interfere with normal single-tap interactions or native
  double-tap-to-zoom where relevant.
- Consider a shared utility/hook (e.g. `useDoubleTapContextMenu`) rather
  than duplicating per-component.
