#!/bin/bash
# Social Media Campaign Generator
# Usage: ./run-campaign.sh

cd "$(dirname "$0")"

echo "🚀 Generating Social Media Campaign..."
echo ""

goose run --recipe social-campaign.yaml \
  --params event_name="Winter Wonderland Festival" \
  --params event_date="December 28, 2025 | 5:00 PM - 10:00 PM" \
  --params event_description="A magical winter festival featuring ice sculptures, live music, food trucks, and a spectacular fireworks display to celebrate the holiday season" \
  --params target_audience="Families, couples, and winter enthusiasts of all ages" \
  --params call_to_action="Get your tickets now at winterwonderland.com - Early bird pricing ends December 22nd!" \
  --no-session

echo ""
echo "✅ Campaign generated! Check for index.html in this directory."
echo "🌐 Open index.html in your browser to view the campaign."
