A presentation is wrapped in a room.

A room will have ONE uk.half-shot.presents.slides state event
The event will only contain a number of events which correspond to slides.

A room will have many uk.half-shot.presents.slide events.
A slide may contain many sub-events, which will also be referenced in this event.

An example `uk.half-shot.presents.slide` event:
```json
{
    "title": "Foobar",
    "subtitle": "The need for foo",
    "columns": [
        ["!foobar:example.com"],
        ["!bar:baz.com"]
    ]
}
```
