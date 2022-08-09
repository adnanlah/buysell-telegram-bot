import { rulesType, ruleType } from "./types"

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

export const botReplyGenerator = (rulesBrokenFiltered: ruleType[]): string => {
  return `‼️ سوف يتم حذف رسالتك بعد ثواني لانك خالفت (${
    rulesBrokenFiltered.length
  }) القوانين التالية:

${rulesBrokenFiltered.map((rule) => rule.content).join("\n\n")}

<i>- لأي استفسارات انظم لمجموعة التوثيق والنقاشات: https://t.me/+1dS6r91r0hYzZWZk</i>`
}

export const usernameRule = `❌ وضع الاسم واللقب واليوزرنيم (المعرف).`

export const askTrustRule = `❌ التوثيقات تكون في مجموعة التوثيق والنقاشات: https://t.me/+1dS6r91r0hYzZWZk`

export const reserveRule = `❌ يجب أن يكون الحجز ردًا على العرض نفسه.`

export const formatRule = `❌ احترام النموذج (اضغط على النص 👇 لنسخه):
<code>
🟢 شراء / 🔴 بيع
❶☚ اسم العملة: 
❷☚ الكمية: 
❸☚ السعر: 
➍☚ طرق الدفع: 
الملاحظة: </code>`
