export default class Tg_Post_Back_Handler_Publish {
  constructor(botClient) {
    this.botClient = botClient;
  }

  async publish(dto) {
    if (dto.image) {
      await this.botClient.sendPhoto(dto.image, dto.text);
    } else {
      await this.botClient.sendMessage(dto.text);
    }
  }
}
