import { rulesType, ruleType } from "./types"

export const secondGroupLink = `https://t.me/+1dS6r91r0hYzZWZk`

export const pleaseJoin = `<i>📢 لأي استفسارات انظم لمجموعة التوثيق والنقاشات: ${secondGroupLink}</i>`

export const usernameRule = `وضع الاسم واللقب واليوزرنيم (المعرف).`

export const askTrustRule = `التوثيقات تكون في مجموعة التوثيق والنقاشات: ${secondGroupLink}`

export const askReserveRule = `يجب أن يكون الحجز ردًا على العرض نفسه.`

export const noMediaRule = `ممنوع نشر الصور والفيديوهات.`

export const correctEmojiRule = `🟢 شراء أو 🔴 بيع؟ 🤔😅`

export const formatRule = `احترام النموذج (اضغط على النص 👇 لنسخه):
<code>
🟢 شراء / 🔴 بيع
❶☚ اسم العملة: 
❷☚ الكمية: 
❸☚ السعر: 
➍☚ طرق الدفع: 
الملاحظة: </code>`

export const noticeGenerator = (rulesBroken: ruleType[]): string => {
  // const rulesFiltered: ruleType[] = Object.values(rulesBroken).filter(
  //   (rule) => rule.value === true && rule.important === true
  // )

  return `‼️ سوف يتم حذف رسالتك بعد ثواني لانك خالفت (${rulesBroken.length}) القوانين التالية:

${rulesBroken.map((rule) => `❌ ` + rule.content).join("\n\n")}

${pleaseJoin}`
}

export const noticeGeneratorNotImportant = (rulesBroken: ruleType[]): string => {
  // const rulesBroken: ruleType[] = Object.values(rulesBroken).filter(
  //   (rule) => rule.value === true && rule.important === true
  // )

  return rulesBroken.map((rule) => rule.content).join("\n\n")
}
