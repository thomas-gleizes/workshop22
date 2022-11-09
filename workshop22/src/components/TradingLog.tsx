import { useEffect, useState } from "react"
import dayjs from "dayjs"

const host = "localhost"
const port = 7777

const ENDPOINT = `ws://${host}:${port}`

interface Message {
  timestamp: number
  content: string
}

const TradingLog: Component = () => {
  const [socket, setSocket] = useState<WebSocket>()
  const [messages, setMessages] = useState<Message[]>([])

  const handleConnect = () => setSocket(new WebSocket(ENDPOINT))

  const handleDisconnect = () => {
    socket?.close()
    setSocket(undefined)
  }

  useEffect(() => {
    if (socket) {
      socket.onmessage = ({ type, data }) =>
        setMessages([...messages, { timestamp: Date.now(), content: data }])

      return () => {
        socket.onmessage = null
      }
    }
  }, [socket, messages])

  return (
    <div className="p-4 bg-gray-100 border-gray-200 border border-black shadow-lg rounded-lg w-full px-3">
      <div className="divide flex flex-col space-y-3">
        {messages.length ? (
          messages.reverse().map((message, index) => (
            <div key={index}>
              <div className="flex justify-between w-full">
                <span className="w-1/3">
                  {dayjs(message.timestamp).format("DD/MM/YY HH:mm:ss")}
                </span>
                <span className="w-fit">{message.content}</span>
              </div>
            </div>
          ))
        ) : (
          <div>
            <p className="py-2 text-center select-none">Aucune transaction enregistrée</p>
          </div>
        )}
      </div>
      <div className="mt-10">
        <div className="divider">
          {socket ? (
            <button className="btn btn-sm" onClick={handleDisconnect}>
              Déconnexion
            </button>
          ) : (
            <button className="btn btn-sm" onClick={handleConnect}>
              Connexion
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default TradingLog
