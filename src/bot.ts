import { Bot, Context, session, SessionFlavor } from "grammy"
import { sequentialize } from "@grammyjs/runner"
import { GrammyError, HttpError } from "grammy"
import { sleep, isCorrectOffer, isIncludesTrust, isIncludesReserve } from "./helpers"
import {
  usernameRule,
  formatRule,
  askTrustRule,
  botReplyGenerator,
  reserveRule,
  pleaseJoin
} from "./dialog"
import { rulesType, ruleType } from "./types"

if (process.env.BOT_TOKEN == null) throw Error("BOT_TOKEN is missing.")

interface SessionData {
  goodMessage: number
}

type MyContext = Context & SessionFlavor<SessionData>

// Install session middleware, and define the initial session value.
function initial(): SessionData {
  return { goodMessage: 0 }
}

// Build a unique identifier for the `Context` object.
function getSessionKey(ctx: Context) {
  return ctx.chat?.id.toString()
}

export const bot = new Bot<MyContext>(`${process.env.BOT_TOKEN}`, {
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

// Sequentialize before accessing session data!
bot.use(sequentialize(getSessionKey))
bot.use(session({ initial }))

bot.on("message:text", async (ctx) => {
  try {
    const count = ctx.session.goodMessage
    console.log({ count })

    const rulesBroken: rulesType = {
      username: { value: false, content: usernameRule },
      askTrust: { value: false, content: askTrustRule },
      reserve: { value: false, content: reserveRule },
      format: { value: false, content: formatRule }
    }

    const text: string = ctx.message.text
    const isOrphan: boolean = ctx.message.reply_to_message === undefined

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

    if (isOrphan && !isCorrectOffer(text) && isIncludesReserve(text)) {
      rulesBroken["reserve"].value = true
    }

    if (isOrphan && !isCorrectOffer(text)) {
      rulesBroken["format"].value = true
    }

    if (isIncludesTrust(text) && !isIncludesReserve(text)) {
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
      await bot.api.deleteMessage(ctx.msg.chat.id, ctx.msg.message_id)
      if (count < 21) {
        await bot.api.deleteMessage(ctx.msg.chat.id, botReplyMessage.message_id)
      } else {
        ctx.session.goodMessage = 0
        await bot.api.editMessageText(ctx.msg.chat.id, botReplyMessage.message_id, pleaseJoin, {
          parse_mode: "HTML",
          disable_web_page_preview: true
        })
      }
    } else {
      ctx.session.goodMessage++
    }
  } catch (err: any) {
    throw new Error(err)
  }
})

bot.catch((err) => {
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

export default bot
