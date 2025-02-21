require("dotenv").config();
const {
  Bot,
  GrammyError,
  HttpError,
  Keyboard,
  InlineKeyboard,
} = require("grammy");

const { hydrate } = require("@grammyjs/hydrate");
const bot = new Bot(process.env.BOT_API_KEY);
bot.use(hydrate());

bot.api.setMyCommands([
  { command: "start", description: "Start bot" },
  { command: "stop", description: "Stop bot" },
  { command: "menu", description: "Вызвать меню" },
]);

bot.command("start", async (ctx) => {
  await ctx.reply("Игра");
});

// bot.on("message", async (ctx) => {
//   console.log(ctx);
// });

// bot.hears("тест", async (ctx) => {
//   await ctx.reply("volleyBall Inside");
// });

const menuKeyboard = new InlineKeyboard()
  .text("Узнать статус заказа", "order-status")
  .text("Обратиться в поддержку", "support");

const backKeyboard = new InlineKeyboard().text("<Назад в меню>", "back");
bot.command("menu", async (ctx) => {
  await ctx.reply("Выберите пункт меню", {
    reply_markup: menuKeyboard,
  });
});

bot.callbackQuery("order-status", async (ctx) => {
  await ctx.callbackQuery.message.editText("Статус заказа: в пути", {
    reply_markup: backKeyboard,
  });
  await ctx.answerCallbackQuery();
});

bot.callbackQuery("support", async (ctx) => {
  await ctx.callbackQuery.message.editText("Напишите ваш запрос", {
    reply_markup: backKeyboard,
  });
  await ctx.answerCallbackQuery();
});

bot.callbackQuery("back", async (ctx) => {
  await ctx.callbackQuery.message.editText("Выберите пункт меню", {
    reply_markup: menuKeyboard,
  });
  await ctx.answerCallbackQuery();
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
