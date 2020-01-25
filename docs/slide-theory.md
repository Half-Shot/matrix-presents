Slide Theory
------------

This document describes how `matrix-presents` uses rooms and events to store slides.

## The Room

One presentation is stored inside one room.

A room will have a `uk.half-shot.presents.slides` state event with an empty `state_key`.
The event will contain a number of event_ids which correspond to each slide.

```
{
	"slides": [
		"$jBKbAKRMgJ-SO37RfAOM6UtCwibPzn8zzMPxv85928k",
		"$j9jua8Rsd7TV4mkhvBA8jQIz0OLQoX75pd6vJqn1AO4",
		"$bgYjfoZsCjG9e3-OlRUWeluiLdCtLnvUt-Uis4l8Jms"
	]
}
```
*Example event content for `uk.half-shot.presents.slides`*

This allows a client to index all the slides, as well as store the ordering of the presentation.
Currently the ordering of slides is linear, where the index of the event_id denotes the ordering of
the slides.

Any `uk.half-shot.presents.slide` event can be added into this index, from any `sender`.

The powerlevel required to send `uk.half-shot.presents.slides` decides who is considered an **Editor** in
a room. In Matrix, you require only PL50 to send a state event into the room, so by default all 
"Moderators" in a room are also Editors. Clients should ensure that the PL required to send this event is 
sufficently high for the user's needs.

## Slides

Slides are stored inside the same room, and can be created by anyone. They should be normal events.

### Fragment Events

Fragment events are ANY event that can be rendered inside a slide. Clients may decide for themselves which
events they wish to render in a slide (and show an appropriate fallback if not), but allclients should
display:

- `m.room.message`
  - `msgtype`:
    - `m.text` (both HTML and plain)
    - `m.image`

Anybody may create fragment, and again care should be taken to ensure that the PLs for the room have been 
set correctly. Anyone able to send any event is considered a **Contributor**.

### Slide Events

Slide events will contain references to the child events.

An example `uk.half-shot.presents.slide` event:
```
{
    "title": "Foobar",
    "subtitle": "The need for foo",
    "columns" [
        ["!foobar:example.com"],
        ["!bar:baz.com"],
    ],
}
```
*Example event content for `uk.half-shot.presents.slide`*

A slide may contain a `title` and a `subtitle`. These are plaintext that may be rendered
inside a heading. If `columns` is not defined or is empty (but NOT if it contains an empty
 array), then the title and subtitle should be rendered as a "title card". That is, they should be rendered
 centered. Optionally, if the event is also the first slide, the author of the slide may be present. 
Otherwise, the `title` and `subtitle` are optional and may be rendered above the rest of the slide.

`columns` defines the fragments to be rendered inside a slide, seperated into columns in the show. A 
simple slide may only have one column with one item (and therefore should be rendered centered). Two or 
more columns should be equally spaced out along the slide. Columns may not yet have sub-columns, due to 
the difficulties in rendering subcolumns without impairing readability. Fragments should be rendered on 
top of each other per column, and width/height should be dynamically adjusted depending on the type of 
fragment.

Fragments can be lazyloaded into a slide, or a client may wait for all the fragments to be loaded before   
displaying the slide. Smarter clients may attempt to "buffer" the next few slides while rendering the 
current one to avoid any slowdowns during a presentation.

As with the parent `uk.half-shot.presents.slides` event, PLs should be chosen with care. By default, 
anyone can send a slide event into a room although only slides inside the parent will be rendered to \
viewers. 

### Edits

Edits are currently an anomoly in that the previous event cannot point to the edited event, so it is hard to notify clients of an edit unless they see it come down sync. For the time being, editing a fragment will require editing the parent slide event.