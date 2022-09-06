import { GROUP_LINK } from "./init"
import { ruleType } from "./types"

export const pleaseJoin = `<i>📢 لأي استفسارات انظم لمجموعة التوثيق والنقاشات: ${GROUP_LINK}</i>`

export const usernameRule = `وضع يوزرنيم لحسابك (اسم المستخدم).`

export const fullnameRule = `وضع الاسم واللقب لحسابك.`

export const askTrustRule = `التوثيقات تكون في مجموعة التوثيق والنقاشات: ${GROUP_LINK}`

export const askReserveRule = `يجب أن يكون الحجز ردًا على العرض نفسه.`

export const noMediaRule = `ممنوع نشر الصور والفيديوهات.`

export const correctEmojiRule = `🟢 شراء أو 🔴 بيع؟ 🤔😅`

export const formatRule = `اتبع نموذج البيع والشراء.`

export const noticeGenerator = (rulesBroken: ruleType[]): string => {
  return `من فضلك احترم القوانين التالية:

${rulesBroken.map((rule) => `❌ ` + rule.content).join("\n\n")}`
}

export const noticeGeneratorNotImportant = (rulesBroken: ruleType[]): string => {
  return rulesBroken.map((rule) => rule.content).join("\n\n")
}
