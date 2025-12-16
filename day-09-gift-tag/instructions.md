# Day 9: Gift Tag Dilemma

## Instructions

Create a goose recipe for gift tags. They must support the following parameters:

recipient_name
gift_description
sender_name
tag_style — one of: elegant, playful, minimalist, festive
include_poem — boolean
qr_message_url — embed a working QR code if provided
gift_size — small, medium, or large (affects layout)
recipient_preferences (object):
favorite_color
language (supports multilingual greetings)
tone (formal, casual, humorous, heartfelt)

What the recipe needs to do:
Your recipe should apply smart logic + design rules to produce a final output that changes dramatically depending on the inputs.

Your recipe must:

1. Generate dynamic, style-driven layouts. tag_style should influence:
typography
spacing
color palette
decorative elements
emoji (if appropriate)
composition

2. Handle multilingual content. Greeting + optional poem should appear in:
English
Spanish
French
(and more if you want!)

3. Support QR code embedding. If qr_message_url is present:
Generate a QR code
Embed it inside the final HTML tag

4. Adapt based on gift size.
small → compact, minimal layout
medium → balanced layout
large → more room for design elements

5. Generate a thoughtful, context-aware poem. When include_poem: true, poem must:

match the selected tone
reference the gift
fit the style

6. Output print-ready HTML. This means:

Valid HTML structure
Inline CSS
Dimensions appropriate for printing
Single-tag layout ready to save or export
Output a clean, print-ready HTML file containing only the tag itself, no preview wrappers or UI scaffolding.
