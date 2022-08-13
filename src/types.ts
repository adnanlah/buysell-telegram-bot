export interface ruleType {
  value: boolean
  content: string
  important: boolean
}

export interface rulesType {
  username: ruleType
  format: ruleType
  askTrust: ruleType
  askReserve: ruleType
  correctEmoji: ruleType
  noMedia: ruleType
}

export interface generatedMessage {
  update_id: number
  message: {
    date: number
    chat: {
      last_name: string
      id: number
      first_name: string
      username: string
    }
    message_id: number
    from: {
      last_name: string
      id: number
      first_name: string
      username: string
    }
    text: string
  }
}
