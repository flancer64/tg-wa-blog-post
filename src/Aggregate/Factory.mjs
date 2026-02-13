export default class Ttp_Back_Aggregate_Factory {
  constructor() {
    this.create = ({ ru, en, es }) => {
      const status = en?.ok && es?.ok ? 'success' : 'failure';
      const aggregate = {
        ru_message_id: String(ru.message_id),
        ru_original_text: ru.text || '',
        ru_published_at: ru.date || '',
        en_text: en?.text || '',
        en_message_id: en?.message_id ? String(en.message_id) : '',
        en_published_at: en?.published_at || '',
        es_text: es?.text || '',
        es_message_id: es?.message_id ? String(es.message_id) : '',
        es_published_at: es?.published_at || '',
        status,
      };
      return Object.freeze(aggregate);
    };
  }
}
