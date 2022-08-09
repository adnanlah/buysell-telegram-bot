import { rulesType, ruleType } from "./types"

export const sleep = (time: number) => new Promise((res) => setTimeout(res, time, "done sleeping"))

export const botReplyGenerator = (rulesBrokenFiltered: ruleType[]): string => {
  return `‼️ سوف يتم حذف رسالتك بعد ثواني لانك خالفت (${
    rulesBrokenFiltered.length
  }) القوانين التالية:

${rulesBrokenFiltered.map((rule) => rule.content).join("\n\n")}

<i>لأي استفسارات انظم لمجموعة التوثيق والنقاشات: https://t.me/+1dS6r91r0hYzZWZk</i>`
}

export const usernameRule = `❌ وضع الاسم واللقب واليوزرنيم (المعرف)`

export const askTrustRule = `❌ التوثيقات تكون في مجموعة التوثيق والنقاشات: https://t.me/+1dS6r91r0hYzZWZk`

export const formatRule = `❌ احترام النموذج (اضغط على النص 👇 لنسخه):
<code>
🟢 شراء / 🔴 بيع
❶☚ اسم العملة: 
❷☚ الكمية: 
❸☚ السعر: 
➍☚ طرق الدفع: 
الملاحظة: </code>`
