import { rulesType, ruleType } from "./types"

export const secondGroupLink = `https://t.me/+1dS6r91r0hYzZWZk`

export const pleaseJoin = `<i>📢 لأي استفسارات انظم لمجموعة التوثيق والنقاشات: ${secondGroupLink}</i>`

export const botReplyGenerator = (rulesBrokenFiltered: ruleType[]): string => {
  return `‼️ سوف يتم حذف رسالتك بعد ثواني لانك خالفت (${
    rulesBrokenFiltered.length
  }) القوانين التالية:

${rulesBrokenFiltered.map((rule) => rule.content).join("\n\n")}

${pleaseJoin}`
}

export const usernameRule = `❌ وضع الاسم واللقب واليوزرنيم (المعرف).`

export const askTrustRule = `❌ التوثيقات تكون في مجموعة التوثيق والنقاشات: ${secondGroupLink}`

export const reserveRule = `❌ يجب أن يكون الحجز ردًا على العرض نفسه.`

export const formatRule = `❌ احترام النموذج (اضغط على النص 👇 لنسخه):
<code>
🟢 شراء / 🔴 بيع
❶☚ اسم العملة: 
❷☚ الكمية: 
❸☚ السعر: 
➍☚ طرق الدفع: 
الملاحظة: </code>`
