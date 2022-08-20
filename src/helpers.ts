import {
  askTrustRule,
  correctEmojiRule,
  formatRule,
  askReserveRule,
  usernameRule,
  noMediaRule
} from "./dialog"
import { rulesType, ruleType } from "./types"

export const sleep = (time: number) => new Promise((res) => setTimeout(res, time, "done sleeping"))

const checkFormat = (text: string): boolean => {
  return (
    (text.includes("عملة") || text.includes("محفظة")) &&
    text.includes("كمية") &&
    text.includes("سعر") &&
    text.includes("دفع") &&
    (text.startsWith("🟢") || text.startsWith("🔴"))
  )
}

const checkReserveWords = (text: string): boolean => {
  return (
    text.includes("حجز") ||
    text.includes("محجوز") ||
    text.includes("بريفي") ||
    text.includes("خاص") ||
    text.includes("prv") ||
    text.includes("prive") ||
    text.includes("privé") ||
    text.toUpperCase().includes("HJZ") ||
    text.toUpperCase().includes("HJAZ") ||
    text.toUpperCase().includes("HAZJ")
  )
}

const checkTrustWords = (text: string): boolean => {
  return text.includes("توثيق") || text.includes("يوثق") || text.includes("وثق")
}

const checkEmojis = (text: string): boolean => {
  return (
    text.startsWith("🟢 بيع") ||
    text.startsWith("🟢بيع") ||
    text.startsWith("🔴 شراء") ||
    text.startsWith("🔴شراء") ||
    text.includes("🟢 شراء / 🔴 بيع")
  )
}

export const checkText = (text: string): Record<string, boolean> => {
  return {
    isCorrectFormat: checkFormat(text),
    itDoesIncludeReserve: checkReserveWords(text),
    itDoesIncludeTrust: checkTrustWords(text),
    isEmojisWrong: checkEmojis(text)
  }
}

export const getRulesObject = (): rulesType => {
  return {
    username: { value: false, content: usernameRule, important: true },
    askTrust: { value: false, content: askTrustRule, important: true },
    askReserve: { value: false, content: askReserveRule, important: true },
    format: { value: false, content: formatRule, important: true },
    correctEmoji: { value: false, content: correctEmojiRule, important: false },
    noMedia: { value: false, content: noMediaRule, important: true }
  }
}

export const validateUserMessage = (
  msg: any
): {
  importantRulesBroken: ruleType[]
  notImportantRulesBroken: ruleType[]
} => {
  const rulesObject = getRulesObject()
  const isOrphan = msg.reply_to_message === undefined
  const { first_name, last_name, username } = msg.from

  if (msg.text) {
    const { isCorrectFormat, itDoesIncludeTrust, itDoesIncludeReserve, isEmojisWrong } = checkText(
      msg.text.trim()
    )
    const isShort = msg.text.trim().length < 60

    if (username === undefined || (!first_name.trim() && !last_name.trim())) {
      rulesObject["username"].value = true
    }

    if (isOrphan && !isCorrectFormat && itDoesIncludeReserve) {
      rulesObject["askReserve"].value = true
    }

    if (isOrphan && !isCorrectFormat) {
      rulesObject["format"].value = true
    }

    if (isOrphan && !isCorrectFormat) {
      rulesObject["format"].value = true
      rulesObject["askReserve"].value = true
    }

    if (itDoesIncludeTrust && !itDoesIncludeReserve && !isCorrectFormat) {
      rulesObject["askTrust"].value = true
    }

    if (isOrphan && isCorrectFormat && isEmojisWrong) {
      rulesObject["correctEmoji"].value = true
    }
  } else {
    rulesObject["noMedia"].value = true
  }

  const importantRulesBroken: ruleType[] = Object.values(rulesObject).filter(
    (rule) => rule.value === true && rule.important === true
  )

  const notImportantRulesBroken: ruleType[] = Object.values(rulesObject).filter(
    (rule) => rule.value === true && rule.important === false
  )

  return { importantRulesBroken, notImportantRulesBroken }
}
