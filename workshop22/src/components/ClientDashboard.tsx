import { useEffect, useState } from "react"
import axios from "axios"
import Client from "./Client"

interface Props {
  onAddClient: (port: number) => void
}

const InputAddClient: Component<Props> = ({ onAddClient }) => {
  const [port, setPort] = useState<number>(8001)

  const handleClick = () => {
    onAddClient(port)
    setPort(0)
  }

  return (
    <div className="flex justify-center">
      <input
        type="number"
        className="input input-sm input-secondary"
        onChange={(event) => setPort(Number(event.target.value))}
        value={port}
      />
      <button className="btn btn-sm" onClick={handleClick}>
        Ajouter
      </button>
    </div>
  )
}

const ClientDashboard: Component = () => {
  const [clients, setClients] = useState<Client[]>([])

  const handleAddClient = async (port: number) => {
    const alreadyAdd = clients.find((client) => client.port === port)

    if (alreadyAdd) return

    try {
      const { data } = await axios.get(`http://localhost:${port}`)

      setClients((clients) => [
        ...clients,
        { port, country: data.country, transactions: data.transactions }
      ])
    } catch (err) {
      console.log(err)
    }
  }

  const handleEditClient = (client: Client) => {
    setClients((clients) => {
      const index = clients.findIndex((c) => c.port === client.port)

      if (index === -1) return clients

      return [...clients.slice(0, index), client, ...clients.slice(index + 1)]
    })
  }

  return (
    <div className="bg-gray-100 border border-gray-200 rounded-lg px-3 py-4 select-none max-w-[800px]">
      <div>
        <h2 className="text-lg text-center font-bold">Liste de pays</h2>
      </div>
      <div className="divider" />

      <div className="flex flex-col space-y-4 overflow">
        {clients.length ? (
          clients.map((client, index) => <Client key={index} client={client} edit={() => null} />)
        ) : (
          <div>
            <p className="text-center">Aucun pays</p>
          </div>
        )}
      </div>

      <div className="divider" />
      <InputAddClient onAddClient={handleAddClient} />
    </div>
  )
}

export default ClientDashboard
