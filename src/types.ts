export interface ruleType {
  value: boolean
  content: string
  important: boolean
}

export interface rulesType {
  username: ruleType
  format: ruleType
  askTrust: ruleType
  reserve: ruleType
  consistent: ruleType
}
