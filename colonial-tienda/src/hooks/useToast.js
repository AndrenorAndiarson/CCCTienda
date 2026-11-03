import { useCallback, useEffect, useRef, useState } from 'react'

export default function useToast(duration = 2600) {
  const [message, setMessage] = useState('')
  const [visible, setVisible] = useState(false)
  const timer = useRef(null)

  const show = useCallback(
    (text) => {
      setMessage(text)
      setVisible(true)
      clearTimeout(timer.current)
      timer.current = setTimeout(() => setVisible(false), duration)
    },
    [duration]
  )

  useEffect(() => () => clearTimeout(timer.current), [])

  return { message, visible, show }
}
