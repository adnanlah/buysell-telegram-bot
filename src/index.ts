require("dotenv").config()
const { Bot } = require("grammy")
import { GrammyError, HttpError } from "grammy"
import { run } from "@grammyjs/runner"
import { sleep, usernameRule, formatRule, askTrustRule, botReplyGenerator } from "./helpers"
import { rulesType, ruleType } from "./types"

if (process.env.BOT_TOKEN == null) throw Error("BOT_TOKEN is missing.")
export const bot = new Bot(`${process.env.BOT_TOKEN}`, {
  botInfo: {
    id: 5556548689,
    is_bot: true,
    first_name: "BuySell Monitor",
    username: "buyselldz_bot",
    can_join_groups: true,
    can_read_all_group_messages: false,
    supports_inline_queries: false
  }
})

bot.on("message:text", async (ctx: any) => {
  try {
    const rulesBroken: rulesType = {
      username: { value: false, content: usernameRule },
      format: { value: false, content: formatRule },
      askTrust: { value: false, content: askTrustRule }
    }

    const text: String = ctx.message.text

    const user = await ctx.getAuthor()

    if (
      ctx.from?.is_bot ||
      ctx.from?.username === "GroupAnonymousBot" ||
      user?.status === "creator"
    ) {
      return
    }

    if (ctx.from.username === undefined) {
      rulesBroken["username"].value = true
    }

    if (
      ctx.message.reply_to_message === undefined &&
      (!text.includes("عملة") ||
        !text.includes("كمية") ||
        !text.includes("سعر") ||
        !text.includes("دفع") ||
        (!text.startsWith("🟢") && !text.startsWith("🔴")))
    ) {
      rulesBroken["format"].value = true
    }

    if (
      (text.includes("توثيق") ||
        text.includes("يوثق") ||
        text.includes("وثق") ||
        text.includes("ثقة")) &&
      !(
        text.includes("حجز") ||
        text.includes("محجوز") ||
        text.toUpperCase().includes("HJZ") ||
        text.toUpperCase().includes("HJAZ") ||
        text.toUpperCase().includes("HAZJ")
      )
    ) {
      rulesBroken["askTrust"].value = true
    }

    const rulesBrokenFiltered: ruleType[] = Object.values(rulesBroken).filter(
      (rule) => rule.value === true
    )

    if (rulesBrokenFiltered.length > 0) {
      const botReplyContent = botReplyGenerator(rulesBrokenFiltered)
      const botReplyMessage = await ctx.reply(botReplyContent, {
        reply_to_message_id: ctx.msg.message_id,
        parse_mode: "HTML",
        disable_notification: true,
        allow_sending_without_reply: false,
        protect_content: true,
        disable_web_page_preview: true
      })

      await sleep(3000 + rulesBrokenFiltered.length * 2000)
      await bot.api.deleteMessage(ctx.msg.chat.id, botReplyMessage.message_id)
      await bot.api.deleteMessage(ctx.msg.chat.id, ctx.msg.message_id)
    }
  } catch (err: any) {
    throw new Error(err)
  }
})

bot.catch((err: any) => {
  const ctx = err.ctx
  console.error(`Error while handling update ${ctx.update.update_id}:`)
  const e = err.error
  if (e instanceof GrammyError) {
    console.error("Error in request:", e.description)
  } else if (e instanceof HttpError) {
    console.error("Could not contact Telegram:", e)
  } else {
    console.error("Unknown error:", e)
  }
})

// bot.start({ drop_pending_updates: true })
run(bot)
