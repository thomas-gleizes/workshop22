import { useState } from "react"
import axios from "axios"

interface Props {
  client: Client
  edit: (client: Client) => void
}

const Client: Component<Props> = ({ client, edit }) => {
  const [amount, setAmount] = useState<number>(0)

  const handleSync = async (client: Client) => {
    try {
      const { data } = await axios.get(`http://localhost:${client.port}`)

      edit({ ...client, transactions: data.transactions })
    } catch (err) {
      console.log(err)
    }
  }

  const handlePost = async (client: Client, type: Type) => {
    await axios.post(`http://localhost:${client.port}/${type}`, { amount })

    setAmount(0)

    setTimeout(handleSync, 1000, client)
  }

  return (
    <div className="border border-base-300 bg-base-100 rounded-box">
      <div className="collapse-title text-lg font-medium">
        Pays: {client.country} / port: {client.port}
      </div>
      <div className="p-3">
        {client.transactions.length > 0 ? (
          <div className="flex flex-col space-y">
            {client.transactions.map((transaction: string, index: number) => (
              <div key={index}>{transaction}</div>
            ))}
          </div>
        ) : (
          <div>
            <p>aucune transactions</p>
          </div>
        )}
        <div className="divider" />
        <div className="flex justify-between space-x-2">
          <button className="btn btn-sm" onClick={() => handleSync(client)}>
            Sync
          </button>
          <div>
            <input
              type="number"
              className="input input-sm"
              onChange={(event) => setAmount(Number(event.target.value))}
              value={amount}
            />

            <button className="btn btn-sm" onClick={() => handlePost(client, "buy")}>
              Acheter
            </button>
            <button className="btn btn-sm" onClick={() => handlePost(client, "sell")}>
              Vendre
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Client
