import { toast } from 'sonner'
import { LogLevel, type Message } from '../api/types'

function toastByLevel(m: Message) {
  switch (m.level) {
    case LogLevel.Debug:
      toast(m.message)
      break
    case LogLevel.Info:
      toast.info(m.message)
      break
    case LogLevel.Warning:
      toast.warning(m.message)
      break
    case LogLevel.Error:
      toast.error(m.message)
      break
    case LogLevel.Critical:
      toast.error(m.message, { description: 'Critical' })
      break
  }
}

export function showMessage(m: Message) {
  toastByLevel(m)
}


export function showMessages(messages: Message[]) {
  messages.forEach(showMessage)
}
