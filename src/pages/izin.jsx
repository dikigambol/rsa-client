// eslint-disable-next-line no-unused-vars
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { authInfo } from '../services/getUserInfo';

const initialState = {
    no_pegawai: sessionStorage.getItem('token') ? authInfo().nopeg : '',
    tgl_izin: '',
    keterangan: '',
    status_izin: 0
};

const Izin = () => {
    const [loading_list_izin, setloading_list_izin] = useState(false)
    const [loading_form_izin, setloading_form_izin] = useState(false)
    const [token_list, settoken_list] = useState(sessionStorage.getItem('token'))
    const [isToken, setisToken] = useState(true)
    const [isError, setisError] = useState(false)
    const [response, setResponse] = useState(null);
    const [form, setform] = useState(initialState)
    const [izin, setIzin] = useState([])
    const [type, setType] = useState("add")
    const modal = useRef()

    const handlerInput = (e) => {
        setform({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const getListIzin = async () => {
        setloading_list_izin(true);
        try {
            const result = await axios.get(`http://localhost:5000/izin/${form.no_pegawai}`, {
                headers: {
                    "Content-type": "application/json",
                    "authorization": isToken ? "Bearer " + token_list : ''
                },
            });
            setIzin(result.data)
            setResponse({
                url: result.config.url,
                method: result.config.method,
                headers: result.config.headers.authorization,
                message: "fetch success",
                status: result.status
            });
            setisError(false)
            setloading_list_izin(false);
        } catch (error) {
            setisError(true)
            setResponse({
                url: error.response.config.url,
                method: error.response.config.method,
                headers: error.response.config.headers.authorization,
                ...error.response.data
            });
            setloading_list_izin(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        setloading_form_izin(true)
        try {
            const result = await axios.post(`http://localhost:5000/izin/${form.no_pegawai}`, form, {
                headers: {
                    "Content-type": "application/json",
                    "authorization": isToken ? "Bearer " + token_list : ''
                },
            });
            const result2 = await axios.get(`http://localhost:5000/izin/${form.no_pegawai}`, {
                headers: {
                    "Content-type": "application/json",
                    "authorization": isToken ? "Bearer " + token_list : ''
                },
            });
            setIzin(result2.data)
            setform(initialState)
            setResponse({
                url: result.config.url,
                method: result.config.method,
                headers: result.config.headers.authorization,
                ...result.data
            });
            setisError(false)
            setloading_form_izin(false)
            modal.current.click()
        } catch (error) {
            setisError(true)
            setform(initialState)
            setResponse({
                url: error.response.config.url,
                method: error.response.config.method,
                headers: error.response.config.headers.authorization,
                ...error.response.data
            });
            setloading_form_izin(false)
            modal.current.click()
        }
    }

    const handleDetail = async (list) => {
        setform(list)
    }

    const handleEdit = async (e) => {
        e.preventDefault()
        setloading_form_izin(true)
        try {
            const result = await axios.put(`http://localhost:5000/izin/${form.id_izin}/${form.no_pegawai}`, form, {
                headers: {
                    "Content-type": "application/json",
                    "authorization": isToken ? "Bearer " + token_list : ''
                },
            });
            const result2 = await axios.get(`http://localhost:5000/izin/${form.no_pegawai}`, {
                headers: {
                    "Content-type": "application/json",
                    "authorization": isToken ? "Bearer " + token_list : ''
                },
            });
            setIzin(result2.data)
            setform(initialState)
            setResponse({
                url: result.config.url,
                method: result.config.method,
                headers: result.config.headers.authorization,
                ...result.data
            });
            setisError(false)
            setloading_form_izin(false)
            modal.current.click()
        } catch (error) {
            setisError(true)
            setform(initialState)
            setResponse({
                url: error.response.config.url,
                method: error.response.config.method,
                headers: error.response.config.headers.authorization,
                ...error.response.data
            });
            setloading_form_izin(false)
            modal.current.click()
        }
    }

    const handleDelete = async (id) => {
        try {
            const result = await axios.delete(`http://localhost:5000/izin/${id}/${form.no_pegawai}`, {
                headers: {
                    "Content-type": "application/json",
                    "authorization": isToken ? "Bearer " + token_list : ''
                },
            });
            const result2 = await axios.get(`http://localhost:5000/izin/${form.no_pegawai}`, {
                headers: {
                    "Content-type": "application/json",
                    "authorization": isToken ? "Bearer " + token_list : ''
                },
            });
            setIzin(result2.data)
            setform(initialState)
            setResponse({
                url: result.config.url,
                method: result.config.method,
                headers: result.config.headers.authorization,
                ...result.data
            });
            setisError(false)
        } catch (error) {
            setisError(true)
            setform(initialState)
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
                <h5 className="card-title text-center">Data Izin Saya</h5>
                <pre>API route get izin: /izin/:id</pre>
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
                <button type="button" className="btn btn-success mb-4 mt-2 mr-2" onClick={getListIzin}>
                    {loading_list_izin ? "Fetching..." : "Fetch Izin List"}
                </button>
                <button type="button" className="btn btn-primary mb-3" data-toggle="modal" data-target="#izinModal" onClick={() => (setform(initialState), setType("add"))}>Tambah</button>
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
                    loading_list_izin ?
                        <div className='text-center'>
                            Fetching izin list...
                        </div>
                        :
                        <>
                            {izin.length === 0 && !isError ?
                                <div className='text-center'>
                                    No Data Found.
                                </div>
                                :
                                <div className='table-responsive'>
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>No</th>
                                                <th>Tanggal Izin</th>
                                                <th>Keterangan</th>
                                                <th>Status Izin</th>
                                                <th>Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {izin.map((list, i) => {
                                                return (
                                                    <tr key={i}>
                                                        <td>{i + 1}</td>
                                                        <td>{list.tgl_izin}</td>
                                                        <td>{list.keterangan}</td>
                                                        <td>{list.status_izin === 0 ? "pengajuan" : list.status_izin === 1 ? "disetujui" : "ditolak"}</td>
                                                        <td>
                                                            <button type="button" className="btn btn-success mb-3 mr-2" data-toggle="modal" data-target="#izinModal" onClick={() => (handleDetail(list), setType("edit"))}>
                                                                Edit
                                                            </button>
                                                            <button type="button" className="btn btn-danger mb-3" onClick={() => handleDelete(list.id_izin)}>
                                                                Hapus
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

                <div className="modal fade" id="izinModal" tabIndex={-1} role="dialog" aria-labelledby="izinModalLabel" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="izinModal">Form Izin</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">×</span>
                                </button>
                            </div>

                            <form onSubmit={type === "add" ? handleSubmit : handleEdit}>
                                <div className="modal-body">
                                    <pre>
                                        - API route create izin (post): /izin/:id
                                        <br />
                                        - API route edit izin (put): /izin/:id/:nopeg
                                    </pre>
                                    <div className="form-group">
                                        <label htmlFor="nama">Tanggal</label>
                                        <input type="date" className='form-control' name='tgl_izin' value={form.tgl_izin} onChange={handlerInput} />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="nama">Keterangan</label>
                                        <textarea name="keterangan" className='form-control' value={form.keterangan} onChange={handlerInput}></textarea>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-dismiss="modal" ref={modal}>Tutup</button>
                                    <button type="submit" className="btn btn-primary" disabled={loading_form_izin}>{loading_form_izin ? "Loading..." : "Simpan"}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Izin;