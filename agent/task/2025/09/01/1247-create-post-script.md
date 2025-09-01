# Task: create post script

## Summary

Implemented CLI script to publish posts to Telegram channel via grammY.

## Observations

- Manual dependency wiring used because @teqfw/di package was not accessible.
- Script expects BOT_TOKEN and CHANNEL_ID in environment.

## Suggestions

- Replace manual wiring with real @teqfw/di container.
- Add unit tests for publish handler.
