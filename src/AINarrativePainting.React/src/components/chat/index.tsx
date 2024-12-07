import { memo } from 'react'
import { ChatItem } from '../../types/type'
import Answer from './Answer'
import Question from './Question'

type ChatProps = {
  items: ChatItem[]
}

const Chat = (props: ChatProps) => {
  const { items } = props

  return (
    <div className="flex flex-col w-full gap-4 p-4">
      {items.map((item, index) => {
        if (item.isAnswer) {
          return <Answer key={item.id} item={item}></Answer>
        }

        return <Question key={item.id} item={item}></Question>
      })}
    </div>
  )
}

export default memo(Chat)
