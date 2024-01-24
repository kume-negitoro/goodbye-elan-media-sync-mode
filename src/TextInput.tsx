import { useRef } from 'react'

export interface TextInputProps {
  onChange?: (value: string) => void
  onEnter?: (value: string) => void
}

export const TextInput = (props: TextInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <input
      className="border-2 border-gray-300 rounded-md"
      ref={inputRef}
      type="text"
      onChange={(e) => props.onChange?.(e.target.value)}
      onKeyDown={(e) => {
        if (e.key !== 'Enter') return

        const input = inputRef.current
        if (input) {
          props.onEnter?.(input.value)
          input.value = ''
        }
      }}
    />
  )
}
