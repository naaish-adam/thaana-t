import "dotenv/config";
import Fastify from "fastify";
import fs from "fs";
import sizeOf from "image-size";
import path from "path";

import { answerInlineQuery, sendMessage, Update } from "./bot";
import {
  alignOpts,
  AlignValues,
  colors,
  textToImage,
} from "./helpers/textToImage";
import { transliterate } from "./thaana";

const PORT = (process.env.PORT as unknown as number) ?? 3000;
const APP_URL = process.env.APP_URL ?? `http://localhost:${PORT}`;

const f = Fastify({ logger: true, disableRequestLogging: true });

f.register(require("@fastify/static"), {
  root: path.join(__dirname, "images"),
  prefix: "/images",
});

f.get("/ping", async function (_, reply) {
  reply.send("pong");
});

f.post("/", async function (request) {
  const update = request.body as Update;

  const from =
    update.message?.from.username ??
    update.edited_message?.from.username ??
    update.inline_query?.from.username ??
    "No one";

  console.log(
    `> ${from} said: ${
      update.message?.text ||
      update.edited_message?.text ||
      update.inline_query?.query ||
      "no text"
    }`
  );

  if (update.message?.text) {
    const message = update.message.text;
    const command = message.split(" ")[0];

    if (command === "/t") {
      await sendMessage(
        update.message.chat.id,
        transliterate(message.slice(2).toLowerCase())
      );
    }
  } else if (update.inline_query?.query) {
    const query = update.inline_query.query.trim().toLowerCase();
    const command = query.split(" ")[0];

    if (!query) return;

    if (command === "/p") {
      const split = query.split(" ");

      let text = split.slice(1).join(" ");
      let color = "white";
      let align: AlignValues = "center";

      if (split[1] === "/c") {
        color = colors.find((c) => c === split[2]) ?? "white";

        if (split[3] === "/a") {
          align = (alignOpts.find((a) => a === split[4]) ??
            "center") as AlignValues;
          text = split.slice(5).join(" ");
        } else {
          text = split.slice(3).join(" ");
        }
      }

      if (!text) return;

      text = transliterate(text);
      const image = await textToImage(text, {
        textAlign: align,
        textColor: color,
        customHeight: 200,
        verticalAlign: "center",
        fontSize: 24,
        lineHeight: 40,
      });

      fs.writeFileSync(
        path.join(__dirname, "images", `${update.inline_query.id}.png`),
        Buffer.from(image.slice(22), "base64url")
      );

      const dimensions = sizeOf(
        path.join(__dirname, "images", `${update.inline_query.id}.png`)
      );
      const photoUrl = `${APP_URL}/images/${update.inline_query.id}.png`;

      await answerInlineQuery(
        update.inline_query.id,
        [
          {
            id: "1",
            type: "photo",
            photo_url: photoUrl,
            thumb_url: photoUrl,
            photo_width: dimensions.width ?? 400,
            photo_height: dimensions.height ?? 400,
          },
        ],
        1000
      );
      setTimeout(() => {
        fs.unlink(
          path.join(__dirname, "images", `${update.inline_query!.id}.png`),
          (err) => {
            if (err) {
              console.log("\nError: Couldn't delete file", err);
            }
          }
        );
      }, 10000);
    } else {
      const text = transliterate(query);
      await answerInlineQuery(update.inline_query.id, [
        {
          id: "1",
          type: "article",
          title: text,
          input_message_content: {
            message_text: text,
          },
        },
      ]);
    }
  }
});

f.listen({ port: PORT }, function (err) {
  if (err) {
    f.log.error(err);
    process.exit(1);
  }

  console.log(`> server listening on http://localhost:${PORT}`);
});
