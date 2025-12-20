# Day 14: Social Media Blitz

## Instructions

Create a social media campaign system using goose sub-recipes:

Create 3 sub-recipes:
* instagram-post.yaml - Generates Instagram caption with hashtags
* twitter-thread.yaml - Creates a Twitter/X thread (3-5 tweets)
* facebook-event.yaml - Generates Facebook event description

Create 1 main recipe:
social-campaign.yaml - Orchestrates all three sub-recipes to generate a complete campaign

All recipes should accept these core parameters:

* event_name - Name of the festival event
* event_date - When it's happening
* event_description - What it's about
* target_audience - Who should attend
* call_to_action - What you want people to do

Apply the following customizations to each social media post:
* Instagram: needs a captivating caption with strategic hashtags and emoji
* Twitter/X: needs a concise thread that builds excitement
* Facebook: needs a detailed event description with all the logistics
