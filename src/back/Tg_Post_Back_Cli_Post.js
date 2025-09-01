export default class Tg_Post_Back_Cli_Post {
  constructor(handler, DtoPost) {
    this.handler = handler;
    this.DtoPost = DtoPost;
  }

  async run(argv) {
    const [text, image] = argv.slice(2);
    if (!text) {
      console.error("Usage: node bin/post.js <text> [image]");
      process.exit(1);
    }
    const dto = new this.DtoPost({ text, image });
    await this.handler.publish(dto);
    console.log("Post published.");
  }
}
