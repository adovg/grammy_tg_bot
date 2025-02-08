require("dotenv").config();
const { Bot, GrammyError, HttpError } = require("grammy");

const bot = new Bot(process.env.BOT_API_KEY);

bot.on("message:voice", async (ctx) => {
  await ctx.reply("Получили голосовое");
});

bot.hears("ID", async (ctx) => {
  await ctx.reply(`Ваш ID: ${ctx.from.id}`);
});

// bot.on("message", async (ctx) => {
//   console.log(ctx);
// });

bot.on([":media", "::url"], async (ctx) => {
  await ctx.reply("Получили ссылку");
});

bot.hears("пинг", async (ctx) => {
  await ctx.reply("понг");
});

bot.hears("тест", async (ctx) => {
  await ctx.reply("игра");
});

bot.api.setMyCommands([
  { command: "start", description: "Start bot" },
  { command: "stop", description: "Stop bot" },
  { command: "hello", description: "Получить приветсвтие" },
]);
// обработчик комманд, в функции указывается комманда обработчик

bot.command(["say_hello", "hello", "say_hi"], async (ctx) => {
  await ctx.reply("Hello");
});
bot.command("start", async (ctx) => {
  await ctx.reply("Игра");
});

bot.catch((err) => {
  const ctx = err.ctx;
  console.error(`Error while handling update ${ctx.update.update_id}:`);
  const e = err.error;

  if (e instanceof GrammyError) {
    console.error("Error in request:", e.description);
  } else if (e instanceof HttpError) {
    console.error("Could not contact Telegram:", e);
  }
});

// bot.on("message", async (ctx) => {
//   await ctx.reply("Нужно подумать");
// });
bot.start();
