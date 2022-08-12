import { askTrustRule, correctEmojiRule, formatRule, askReserveRule, usernameRule } from "./dialog"
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

export const validateUserMessage = (
  isOrphan: boolean,
  text: string,
  username: string | undefined
): {
  rulesBrokenFiltered: ruleType[]
  notImportantRulesBrokenFiltered: ruleType[]
} => {
  const rulesBroken: rulesType = {
    username: { value: false, content: usernameRule, important: true },
    askTrust: { value: false, content: askTrustRule, important: true },
    askReserve: { value: false, content: askReserveRule, important: true },
    format: { value: false, content: formatRule, important: true },
    correctEmoji: { value: false, content: correctEmojiRule, important: false }
  }

  const { isCorrectFormat, itDoesIncludeTrust, itDoesIncludeReserve, isEmojisWrong } =
    checkText(text)

  if (username === undefined) {
    rulesBroken["username"].value = true
  }

  if (isOrphan && !isCorrectFormat && itDoesIncludeReserve) {
    rulesBroken["askReserve"].value = true
  }

  if (isOrphan && !isCorrectFormat) {
    rulesBroken["format"].value = true
  }

  if (itDoesIncludeTrust && !itDoesIncludeReserve && !isCorrectFormat) {
    rulesBroken["askTrust"].value = true
  }

  if (isOrphan && isCorrectFormat && isEmojisWrong) {
    rulesBroken["correctEmoji"].value = true
  }

  const rulesBrokenFiltered: ruleType[] = Object.values(rulesBroken).filter(
    (rule) => rule.value === true && rule.important === true
  )

  const notImportantRulesBrokenFiltered: ruleType[] = Object.values(rulesBroken).filter(
    (rule) => rule.value === true && rule.important === false
  )

  return { rulesBrokenFiltered, notImportantRulesBrokenFiltered }
}
