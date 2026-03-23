status: SUCCESS

summary:
Added media-aware Telegram message handling across docs, adapters, run-cycle, and tests. Text messages still use the translation pipeline; photo, video, and document messages bypass media transformation, while captions are translated and republished with the media payload.

details:
- Updated product, constraints, architecture, composition, and code-contract docs to describe structured messages and media preservation.
- Extended TelegramReader to return structured message metadata with message type, caption, and media payload.
- Extended TelegramPublisher with type-based sendMessage, sendPhoto, sendVideo, and sendDocument support.
- Updated RunCycle to branch on message type, translate captions for media messages, and keep media unchanged.
- Updated aggregate creation and unit tests to cover text, media without caption, and media with caption scenarios.

results:
- `npm test` passed.
- Git remote was corrected to `https://github.com/flancer64/tg-wa-blog-post.git`.
