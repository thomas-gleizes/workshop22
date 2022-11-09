declare type Component<Props = {}> = React.FC<Props>

interface Client {
  port: number
  transactions: string[]
  country: string
}

declare type Type = "buy" | "sell"
