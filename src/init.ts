const {
  BOT_TOKEN,
  INITIAL_DELAY: _INITIAL_DELAY = "1500",
  ADDITIONAL_DELAY: _ADDITIONAL_DELAY = "1000",
  MESSAGES_COUNT_LIMIT: _MESSAGES_COUNT_LIMIT = "3",
  GROUP_LINK = ""
} = process.env as NodeJS.ProcessEnv & {
  BOT_TOKEN: string
  INITIAL_DELAY: string
  ADDITIONAL_DELAY: string
  MESSAGES_COUNT_LIMIT: string
  GROUP_LINK: string
}

const INITIAL_DELAY = parseInt(_INITIAL_DELAY)
const ADDITIONAL_DELAY = parseInt(_ADDITIONAL_DELAY)
const MESSAGES_COUNT_LIMIT = parseInt(_MESSAGES_COUNT_LIMIT)

export { BOT_TOKEN, INITIAL_DELAY, ADDITIONAL_DELAY, MESSAGES_COUNT_LIMIT, GROUP_LINK }
