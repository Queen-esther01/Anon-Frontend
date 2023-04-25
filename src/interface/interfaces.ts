export interface IHeader {
    linkText?: string
    link?: string
    showLink: boolean
    className?: string
}

export interface IButton {
    children: string | JSX.Element,
    className?: string,
    onClick?: (value?: any) => void,
    // icon?: JSX.Element,
    // type?: "submit" | "button" | "reset" | undefined,
    // theme?: string,
}

export interface ITextInput {
    type: string,
    placeholder?: string,
    icon?: JSX.Element,
    className?: string,
    error?: string,
    [key:string]: any
}

export interface IRegister {
    username: string
    password: string
    deviceToken: string
}

export interface IModal {
    open: boolean
    onClose: () => void
    [key:string]: any
}

export interface IMessage {
    _id: string
    message: string
    date: string
}

export interface ISendMessage {
    messagesId: string
    userId: string
    message: string
}

export interface IUser {
    createdAt: string
    username: string
    password: string
    uniqueId: string
    theme: string
    isPublic: boolean
    messageCount: number
    messagesId: string
    _id: string
}