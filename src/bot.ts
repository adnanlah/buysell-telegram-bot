import { Bot, Context, session, SessionFlavor } from "grammy"
import { sequentialize } from "@grammyjs/runner"
import { GrammyError, HttpError } from "grammy"
import { processRules } from "./helpers"
import { noticeGenerator, noticeGeneratorNotImportant, pleaseJoin } from "./dialog"

// Define the shape of our session.
interface SessionData {
  validMessagesCount: number
}

// Flavor the context type to include sessions.
type MyContext = Context & SessionFlavor<SessionData>

// Install session middleware, and define the initial session value.
function initial(): SessionData {
  return { validMessagesCount: 0 }
}

// Build a unique identifier for the `Context` object.
function getSessionKey(ctx: Context) {
  return ctx.chat?.id.toString()
}

if (process.env.BOT_TOKEN == null) throw Error("BOT_TOKEN is missing.")
export const bot = new Bot<MyContext>(`${process.env.BOT_TOKEN}`, {
  botInfo: {
    id: 5556548689,
    is_bot: true,
    first_name: "BuySell Monitor",
    username: "buyselldz_bot",
    can_join_groups: false,
    can_read_all_group_messages: false,
    supports_inline_queries: false
  }
})

// Sequentialize before accessing session data!
bot.use(sequentialize(getSessionKey))
bot.use(session({ initial }))

bot.on("message:text").filter(
  async (ctx) => {
    const user = await ctx.getAuthor()
    return !ctx.from?.is_bot && ctx.senderChat?.id !== ctx.chat.id && user.status !== "creator"
  },
  async (ctx) => {
    try {
      const validMessagesCount = ctx.session.validMessagesCount
      console.log({ validMessagesCount })

      const text: string = ctx.message.text
      const isOrphan: boolean = ctx.message.reply_to_message === undefined

      const { rulesBrokenFiltered, notImportantRulesBrokenFiltered } = processRules(
        isOrphan,
        text,
        ctx.from.username
      )

      if (rulesBrokenFiltered.length > 0) {
        const botReplyContent = noticeGenerator(rulesBrokenFiltered)
        const botReplyMessage = await ctx.reply(botReplyContent, {
          reply_to_message_id: ctx.msg.message_id,
          parse_mode: "HTML",
          disable_notification: true,
          allow_sending_without_reply: false,
          protect_content: true,
          disable_web_page_preview: true
        })

        const delay = 4 + rulesBrokenFiltered.length * 3000

        if (validMessagesCount < 20) {
          setTimeout(async () => {
            try {
              await bot.api.deleteMessage(ctx.msg.chat.id, ctx.msg.message_id)
              await bot.api.deleteMessage(ctx.msg.chat.id, botReplyMessage.message_id)
            } catch (err: any) {
              console.log("Oops! Error happened trying to delete messages.", err.message)
            }
          }, delay)
        } else {
          ctx.session.validMessagesCount = 0
          setTimeout(async () => {
            try {
              await bot.api.deleteMessage(ctx.msg.chat.id, ctx.msg.message_id)
              await bot.api.editMessageText(
                ctx.msg.chat.id,
                botReplyMessage.message_id,
                pleaseJoin,
                {
                  parse_mode: "HTML",
                  disable_web_page_preview: true
                }
              )
            } catch (err: any) {
              console.log("Oops! Error happened trying to delete messages.", err.message)
            }
          }, delay)
        }
      } else {
        ctx.session.validMessagesCount++
        if (notImportantRulesBrokenFiltered.length > 0) {
          const botReplyContent = noticeGeneratorNotImportant(notImportantRulesBrokenFiltered)
          await ctx.reply(botReplyContent, {
            reply_to_message_id: ctx.msg.message_id,
            parse_mode: "HTML",
            disable_notification: true,
            allow_sending_without_reply: false,
            protect_content: true,
            disable_web_page_preview: true
          })
        }
      }
    } catch (err: any) {
      throw new Error(err)
    }
  }
)

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
