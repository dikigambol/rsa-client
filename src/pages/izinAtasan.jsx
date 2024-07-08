// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import axios from 'axios';
import { authInfo } from '../services/getUserInfo';

const IzinAtasan = () => {
    const [loading_list_atasan, setloading_list_atsan] = useState(false)
    const [token_list, settoken_list] = useState(sessionStorage.getItem('type') == 'RSA' ? sessionStorage.getItem('token') : sessionStorage.getItem('token_hmac'))
    const [isToken, setisToken] = useState(true)
    const [isError, setisError] = useState(false)
    const [response, setResponse] = useState(null);
    const [atasan, setAtasan] = useState([])
    const no_pegawai = sessionStorage.getItem('token') ? authInfo().nopeg : 'xxx'
    const algoritme = sessionStorage.getItem('type') == 'RSA' ? '' : '-hmac'

    const getListAtasan = async () => {
        setloading_list_atsan(true);
        try {
            const result = await axios.get(`http://localhost:5000/izin-atasan${algoritme}/${no_pegawai}`, {
                headers: {
                    "Content-type": "application/json",
                    "authorization": isToken ? "Bearer " + token_list : ''
                },
            });
            setAtasan(result.data)
            setResponse({
                url: result.config.url,
                method: result.config.method,
                headers: result.config.headers.authorization,
                message: "fetch success",
                status: result.status
            });
            setisError(false)
            setloading_list_atsan(false);
        } catch (error) {
            setisError(true)
            setAtasan([])
            setResponse({
                url: error.response.config.url,
                method: error.response.config.method,
                headers: error.response.config.headers.authorization,
                ...error.response.data
            });
            setloading_list_atsan(false);
        }
    };

    const handleVerifikasi = async (id, status) => {
        try {
            const result = await axios.post(`http://localhost:5000/izin-verifikasi${algoritme}/${no_pegawai}`, { id_izin: id, status_izin: status }, {
                headers: {
                    "Content-type": "application/json",
                    "authorization": isToken ? "Bearer " + token_list : ''
                },
            });
            const result2 = await axios.get(`http://localhost:5000/izin-atasan${algoritme}/${no_pegawai}`, {
                headers: {
                    "Content-type": "application/json",
                    "authorization": isToken ? "Bearer " + token_list : ''
                },
            });
            setAtasan(result2.data)
            setResponse({
                url: result.config.url,
                method: result.config.method,
                headers: result.config.headers.authorization,
                message: "fetch success",
                status: result.status
            });
            setisError(false)
        } catch (error) {
            setisError(true)
            setResponse({
                url: error.response.config.url,
                method: error.response.config.method,
                headers: error.response.config.headers.authorization,
                ...error.response.data
            });
        }
    }

    return (
        <div className='card shadow-sm mb-3'>
            <div className="card-body">
                <h5 className="card-title text-center">Data Izin Atasan</h5>
                <pre>API route get izin atasan: /izin-atasan/:id</pre>
                <div className="form-check">
                    <input className="form-check-input" type="checkbox" defaultValue={1} id="defaultCheck1" defaultChecked={true}
                        onChange={() => setisToken(!isToken)}
                    />
                    <label className="form-check-label" htmlFor="defaultCheck1">
                        Set Token on Headers
                    </label>
                </div>
                <div className="row">
                    <div className="col-md-9">
                        <input className="form-control mt-2" type="input" value={token_list} disabled={!isToken}
                            onChange={(e) => settoken_list(e.target.value)} />
                    </div>
                    <div className="col-md-3">
                        <button type="button" className="btn btn-success mb-4 mt-2 mr-2" onClick={() => settoken_list(sessionStorage.getItem('token'))}>
                            set real token
                        </button>
                    </div>
                </div>
                <button type="button" className="btn btn-success mb-4 mt-2 mr-2" onClick={getListAtasan}>
                    {loading_list_atasan ? "Fetching..." : "Fetch Izin Atasan List"}
                </button>
                {response && !isError ?
                    <>
                        <br />
                        <label>Response:</label>
                        <pre>
                            {JSON.stringify(response, null, 2)}
                        </pre>
                    </>
                    : null
                }
                {response && isError ?
                    <>
                        <br />
                        <label>Response:</label>
                        <pre>
                            {JSON.stringify(response, null, 2)}
                        </pre>
                    </>
                    : null
                }
                {
                    loading_list_atasan ?
                        <div className='text-center'>
                            Fetching izin list...
                        </div>
                        :
                        <>
                            {atasan.length === 0 && !isError ?
                                <div className='text-center'>
                                    No Data Found.
                                </div>
                                :
                                <div className='table-responsive'>
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>No</th>
                                                <th>Nama</th>
                                                <th>Divisi</th>
                                                <th>Tanggal Izin</th>
                                                <th>Keterangan</th>
                                                <th>Status Izin</th>
                                                <th>Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {atasan.map((list, i) => {
                                                return (
                                                    <tr key={i}>
                                                        <td>{i + 1}</td>
                                                        <td>{list.nama}</td>
                                                        <td>{list.ket_divisi}</td>
                                                        <td>{list.tgl_izin}</td>
                                                        <td>{list.keterangan}</td>
                                                        <td>{list.status_izin === 0 ? "pengajuan" : list.status_izin === 1 ? "disetujui" : "ditolak"}</td>
                                                        <td>
                                                            <button type="button" className="btn btn-success mb-3 mr-2" onClick={() => handleVerifikasi(list.id_izin, 1)}>
                                                                Acc
                                                            </button>
                                                            <button type="button" className="btn btn-danger mb-3" onClick={() => handleVerifikasi(list.id_izin, 2)}>
                                                                Tolak
                                                            </button>
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            }
                        </>
                }
            </div>
        </div>
    );
};

export default IzinAtasan;