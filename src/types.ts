export interface ruleType {
  value: boolean
  content: string
}

export interface rulesType {
  username: ruleType
  format: ruleType
  askTrust: ruleType
}
