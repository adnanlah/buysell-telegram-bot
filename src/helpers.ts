import { askTrustRule, consistentRule, formatRule, reserveRule, usernameRule } from "./dialog"
import { rulesType } from "./types"

export const sleep = (time: number) => new Promise((res) => setTimeout(res, time, "done sleeping"))

export const processFormat = (text: string): boolean => {
  return (
    text.includes("عملة") &&
    text.includes("كمية") &&
    text.includes("سعر") &&
    text.includes("دفع") &&
    (text.startsWith("🟢") || text.startsWith("🔴"))
  )
}

export const processReserve = (text: string): boolean => {
  return (
    text.includes("حجز") ||
    text.includes("محجوز") ||
    text.toUpperCase().includes("HJZ") ||
    text.toUpperCase().includes("HJAZ") ||
    text.toUpperCase().includes("HAZJ")
  )
}

export const processTrust = (text: string): boolean => {
  return text.includes("توثيق") || text.includes("يوثق") || text.includes("وثق")
}

export const processInconsistency = (text: string): boolean => {
  return (
    text.startsWith("🟢 بيع") ||
    text.startsWith("🟢بيع") ||
    text.startsWith("🔴 شراء") ||
    text.startsWith("🔴شراء")
  )
}

export const processText = (text: string): Record<string, boolean> => {
  return {
    isCorrectFormat: processFormat(text),
    itDoesIncludeReserve: processReserve(text),
    itDoesIncludeTrust: processTrust(text),
    isNotConsistent: processInconsistency(text)
  }
}

export const processRules = (
  isOrphan: boolean,
  text: string,
  username: string | undefined
): rulesType => {
  const rulesBroken: rulesType = {
    username: { value: false, content: usernameRule, important: true },
    askTrust: { value: false, content: askTrustRule, important: true },
    reserve: { value: false, content: reserveRule, important: true },
    format: { value: false, content: formatRule, important: true },
    consistent: { value: false, content: consistentRule, important: false }
  }

  const { isCorrectFormat, itDoesIncludeTrust, itDoesIncludeReserve, isNotConsistent } =
    processText(text)

  if (username === undefined) {
    rulesBroken["username"].value = true
  }

  if (isOrphan && !isCorrectFormat && itDoesIncludeReserve) {
    rulesBroken["reserve"].value = true
  }

  if (isOrphan && !isCorrectFormat) {
    rulesBroken["format"].value = true
  }

  if (itDoesIncludeTrust && !itDoesIncludeReserve && !isCorrectFormat) {
    rulesBroken["askTrust"].value = true
  }

  if (isOrphan && isCorrectFormat && isNotConsistent) {
    rulesBroken["consistent"].value = true
  }

  return rulesBroken
}
