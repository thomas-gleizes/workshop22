import { GetServerSideProps, NextPage } from "next"
import TradingLog from "../components/TradingLog"
import ClientDashboard from "../components/ClientDashboard"

interface Props {}

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  return {
    props: {}
  }
}

const HomePage: NextPage<Props> = () => {
  return (
    <div>
      <h1 className="text-primary"></h1>

      <div className="m-10 grid grid-cols-12 gap-x-8">
        <div className="col-span-4">
          <ClientDashboard />
        </div>
        <div className="col-span-8">
          <TradingLog />
        </div>
      </div>
    </div>
  )
}

export default HomePage
