require("dotenv").config();
const {
  Bot,
  GrammyError,
  HttpError,
  Keyboard,
  InlineKeyboard,
} = require("grammy");

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
  await ctx.reply("volleyBall Inside");
});

bot.api.setMyCommands([
  { command: "start", description: "Start bot" },
  { command: "stop", description: "Stop bot" },
  { command: "hello", description: "Получить приветсвтие" },
  { command: "mood", description: "Какое у тебя настроение?" },
  { command: "share", description: "Поделиться данными с ботом" },
  { command: "inline_keyboard", description: "Инлайн клавиатура" },
]);
// обработчик комманд, в функции указывается комманда обработчик

bot.command(["say_hello", "hello", "say_hi"], async (ctx) => {
  await ctx.reply("Hello");
});
bot.command("start", async (ctx) => {
  await ctx.reply("Игра");
});

bot.command("mood", async (ctx) => {
  // const moodKeyboard = new Keyboard()
  //   .text("Хорошо")
  //   .text("Норм")
  //   .text("Плохо")
  //   .resized()
  //   .oneTime();
  const moodLabels = ["Хорошо", "Норм", "Плохо"];
  const rows = moodLabels.map((label) => {
    return [Keyboard.text(label)];
  });
  const moodKeyboard2 = Keyboard.from(rows).resized();

  await ctx.reply("Как настроение?", {
    reply_markup: moodKeyboard2,
  });
});

bot.hears("Хорошо", async (ctx) => {
  await ctx.reply("Класс!", {
    reply_markup: { remove_keyboard: true },
  });
});

bot.command("share", async (ctx) => {
  const shareKeyboard = new Keyboard()
    .requestLocation("your geolocation")
    .requestContact("Contact")
    .requestPoll("Опрос")
    .resized()
    .oneTime();

  await ctx.reply("Чем хочешь поделиться?", {
    reply_markup: shareKeyboard,
  });
});

bot.on(":contact", async (ctx) => {
  await ctx.reply("Спасибо за контакт");
});

bot.command("inline_keyboard", async (ctx) => {
  const inlineKeyboard = new InlineKeyboard()
    .text("1", "button 1")
    .text("2", "button 2");

  await ctx.reply("выберите кнопку", {
    reply_markup: inlineKeyboard,
  });
});

bot.callbackQuery(["button 1", "button 2"], async (ctx) => {
  await ctx.answerCallbackQuery(`Вы выбрали цифру: ${ctx.callbackQuery.data}`);
  await ctx.reply(`Вы выбрали цифру: ${ctx.callbackQuery.data}`);
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
