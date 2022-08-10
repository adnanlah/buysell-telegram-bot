require("dotenv").config()
import { run } from "@grammyjs/runner"
import bot from "./bot"

// storage
;(async function () {
  await bot.api.deleteWebhook({ drop_pending_updates: true })
})()

run(bot)
