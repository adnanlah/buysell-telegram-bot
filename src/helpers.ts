export const sleep = (time: number) => new Promise((res) => setTimeout(res, time, "done sleeping"))

export const isCorrectOffer = (text: string): boolean => {
  return (
    text.includes("عملة") &&
    text.includes("كمية") &&
    text.includes("سعر") &&
    text.includes("دفع") &&
    (text.startsWith("🟢") || text.startsWith("🔴"))
  )
}

export const isIncludesReserve = (text: string): boolean => {
  return (
    text.includes("حجز") ||
    text.includes("محجوز") ||
    text.toUpperCase().includes("HJZ") ||
    text.toUpperCase().includes("HJAZ") ||
    text.toUpperCase().includes("HAZJ")
  )
}

export const isIncludesTrust = (text: string): boolean => {
  return (
    text.includes("توثيق") || text.includes("يوثق") || text.includes("وثق") || text.includes("ثقة")
  )
}
