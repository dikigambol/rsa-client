// eslint-disable-next-line no-unused-vars
import { useState } from "react"
import Divisi from "./pages/divisi"
import ListUser from "./pages/listUser"
import Login from "./pages/login"
import Struktural from "./pages/struktural"
import Izin from "./pages/izin"
import IzinAtasan from "./pages/izinAtasan"
import FakeToken from "./pages/fakeToken"
import Injeksi from "./pages/injeksiSql"

function App() {
  const [page, setpage] = useState("data-pegawai")

  return (
    <div className="container-fluid p-4">
      <div className="row">
        <div className="col-md-4 mb-3">
          <Login />
        </div>
        <div className="col-md-8">
          <div className="row">
            <div className="col-md-12 mb-3">
              <p className="m-0">
                <button className="btn btn-primary mr-2 mb-3" type="button" onClick={() => setpage("data-pegawai")}>
                  Data Pegawai
                </button>
                <button className="btn btn-warning mr-2 mb-3" type="button" onClick={() => setpage("data-divisi")}>
                  Data Divisi
                </button>
                <button className="btn btn-success mr-2 mb-3" type="button" onClick={() => setpage("data-struktural")}>
                  Data Struktural
                </button>
                <button className="btn btn-danger mr-2 mb-3" type="button" onClick={() => setpage("data-izin")}>
                  Data Izin
                </button>
                <button className="btn btn-secondary mr-2 mb-3" type="button" onClick={() => setpage("spoofing")}>
                  Spoofing Token
                </button>
                <button className="btn btn-secondary mr-2 mb-3" type="button" onClick={() => setpage("injeksi")}>
                  Injeksi SQL
                </button>
              </p>
              {page === "data-pegawai" && <ListUser />}
              {page === "data-divisi" && <Divisi />}
              {page === "data-struktural" && <Struktural />}
              {page === "data-izin" &&
                <>
                  <Izin />
                  <IzinAtasan />
                </>
              }
              {page === "spoofing" && <FakeToken />}
              {page === "injeksi" && <Injeksi />}
            </div>
          </div>
        </div>
      </div>
    </div>

  )
}

export default App
