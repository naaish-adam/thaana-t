import axios from "axios";

const TOKEN = process.env.BOT_TOKEN;

const ai = axios.create({
  baseURL: `https://api.telegram.org/bot${TOKEN}`,
  timeout: 10000,
});

interface Chat {
  id: number;
  first_name: string;
  username: string;
  type: string;
}

interface User {
  id: number;
  is_bot: boolean;
  first_name: string;
  username: string;
  language_code: string;
}

interface Message {
  message_id: number;
  from: User;
  chat: Chat;
  date: number;
  text: string;
}

interface InlineQuery {
  id: string;
  from: User;
  chat_type: string;
  query: string;
  offset: string;
}

export interface Update {
  update_id: number;
  message?: Message;
  edited_message?: Message;
  inline_query?: InlineQuery;
}

type InlineQueryResult = InlineQueryResultArticle | InlineQueryResultPhoto;

interface InlineQueryResultArticle {
  type: "article";
  id: string;
  title: string;
  input_message_content: {
    message_text: string;
    parse_mode?: "MarkdownV2" | "Markdown" | "HTML";
  };
  description?: string;
  thumb_url?: string;
  thumb_width?: number;
  thumb_height?: number;
}

interface InlineQueryResultPhoto {
  type: "photo";
  id: string;
  photo_url: string;
  thumb_url: string;
  title?: string;
  description?: string;
  photo_width?: number;
  photo_height?: number;
}

export const sendMessage = async (chatId: number, text: string) => {
  try {
    await ai.post(
      `/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(text)}`
    );
  } catch (err) {
    console.log("ERR:", err);
  }
};

export const answerInlineQuery = async (
  inlineQueryId: string,
  results: InlineQueryResult[],
  cacheTime = 300
) => {
  try {
    await ai.post(
      `/answerInlineQuery?inline_query_id=${inlineQueryId}&cache_time=${cacheTime}&results=${encodeURIComponent(
        JSON.stringify(results)
      )}`
    );
  } catch (err) {
    console.log("ERR:", err);
  }
};

export const editMessage = async (
  chatId: number,
  messageId: number,
  text: string
) => {
  try {
    await ai.post(
      `/editMessage?chat_id=${chatId}&message_id=${messageId}&text=${encodeURIComponent(
        text
      )}`
    );
  } catch (err) {
    console.log("ERR:", err);
  }
};
