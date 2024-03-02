import { cn } from "@/libs/utils"
import { ExtendedMessage } from "@/types/message"
import { Icons } from "../Icons"


interface MessageProps{
    message: ExtendedMessage,
    isNextMessageSamePerson: boolean
}


const Message = ({message, isNextMessageSamePerson}: MessageProps) => {
    return <div className={cn('flex items-end', {
        "justify-end": message.isUserMessage,
    })}>
        <div className={cn("relative flex-h-6 w-6 aspect-square items-center justify-center", {
            'order-2 bg-blue-600 rounded-sm': message.isUserMessage,
            "order-1 bg-zinc-800 rounded-sm": !message.isUserMessage,
            invisible: isNextMessageSamePerson
        })}>
            {message.isUserMessage ? (
                <Icons.user className="fill-zinc-200 text-zinc-200 h-3/4 w-3/4" />
            ): (
                <Icons.logo className="fill-zinc-300 h-3/4 w-3/4" />
            )}
        </div>
    </div>
}


export default Message