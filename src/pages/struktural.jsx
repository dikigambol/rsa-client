// eslint-disable-next-line no-unused-vars
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';

const initialState = {
    id_struktural: '',
    id_divisi: '',
    atasan: ''
};

const Struktural = () => {
    const [loading_list_struktural, setloading_list_struktural] = useState(false)
    const [loading_form_struktural, setloading_form_struktural] = useState(false)
    const [token_list, settoken_list] = useState(sessionStorage.getItem('type') == 'RSA' ? sessionStorage.getItem('token') : sessionStorage.getItem('token_hmac'))
    const [isToken, setisToken] = useState(true)
    const [isError, setisError] = useState(false)
    const [response, setResponse] = useState(null);
    const [form, setform] = useState(initialState)
    const [divisi, setdivisi] = useState([])
    const [list_user, setlist_user] = useState([])
    const [struktural, setstruktural] = useState([])
    const [type, setType] = useState("add")
    const modal = useRef()
    const algoritme = sessionStorage.getItem('type') == 'RSA' ? '' : '-hmac'

    const handlerInput = (e) => {
        setform({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const getListStruktural = async () => {
        setloading_list_struktural(true);
        try {
            const result = await axios.get('http://localhost:5000/struktural' + algoritme);
            setstruktural(result.data)
            setResponse({
                url: result.config.url,
                method: result.config.method,
                message: "fetch success",
                status: result.status
            });
            setisError(false)
            setloading_list_struktural(false);
        } catch (error) {
            setisError(true)
            setResponse({
                url: error.response.config.url,
                method: error.response.config.method,
                ...error.response.data
            });
            setloading_list_struktural(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        setloading_form_struktural(true)
        try {
            const result = await axios.post('http://localhost:5000/struktural' + algoritme, form, {
                headers: {
                    "Content-type": "application/json",
                    "authorization": isToken ? "Bearer " + token_list : ''
                },
            });
            const result2 = await axios.get('http://localhost:5000/struktural' + algoritme);
            setstruktural(result2.data)
            setform(initialState)
            setResponse({
                url: result.config.url,
                method: result.config.method,
                headers: result.config.headers.authorization,
                ...result.data
            });
            setisError(false)
            setloading_form_struktural(false)
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
            setloading_form_struktural(false)
            modal.current.click()
        }
    }

    const handleDetail = async (list) => {
        setform(list)
    }

    const handleEdit = async (e) => {
        e.preventDefault()
        setloading_form_struktural(true)
        try {
            const result = await axios.put(`http://localhost:5000/struktural${algoritme}/${form.id_struktural}`, form, {
                headers: {
                    "Content-type": "application/json",
                    "authorization": isToken ? "Bearer " + token_list : ''
                },
            });
            const result2 = await axios.get('http://localhost:5000/struktural' + algoritme);
            setstruktural(result2.data)
            setform(initialState)
            setResponse({
                url: result.config.url,
                method: result.config.method,
                headers: result.config.headers.authorization,
                ...result.data
            });
            setisError(false)
            setloading_form_struktural(false)
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
            setloading_form_struktural(false)
            modal.current.click()
        }
    }

    const handleDelete = async (id) => {
        try {
            const result = await axios.delete(`http://localhost:5000/struktural${algoritme}/${id}`, {
                headers: {
                    "Content-type": "application/json",
                    "authorization": isToken ? "Bearer " + token_list : ''
                },
            });
            const result2 = await axios.get('http://localhost:5000/struktural' + algoritme);
            setstruktural(result2.data)
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

    const getDropdown = async () => {
        const result = await axios.get('http://localhost:5000/divisi' + algoritme);
        const result2 = await axios.get('http://localhost:5000/user' + algoritme, {
            headers: {
                "Content-type": "application/json",
                "authorization": isToken ? "Bearer " + token_list : ''
            },
        });
        setdivisi(result.data)
        setlist_user(result2.data)
    }

    useEffect(() => {
        getDropdown()
    }, [])

    return (
        <div className='card shadow-sm mb-3'>
            <div className="card-body">
                <h5 className="card-title text-center">Data Struktural</h5>
                <pre>API route get struktural: /struktural</pre>
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
                <button type="button" className="btn btn-success mb-4 mt-2 mr-2" onClick={getListStruktural}>
                    {loading_list_struktural ? "Fetching..." : "Fetch Struktural List"}
                </button>
                <button type="button" className="btn btn-primary mb-3" data-toggle="modal" data-target="#strukturalModal" onClick={() => (setform(initialState), setType("add"))}>Tambah</button>
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
                    loading_list_struktural ?
                        <div className='text-center'>
                            Fetching struktural list...
                        </div>
                        :
                        <>
                            {struktural.length === 0 && !isError ?
                                <div className='text-center'>
                                    No Data Found.
                                </div>
                                :
                                <div className='table-responsive'>
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>No</th>
                                                <th>Nama Divisi</th>
                                                <th>Atasan</th>
                                                <th>Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {struktural.map((list, i) => {
                                                return (
                                                    <tr key={i}>
                                                        <td>{i + 1}</td>
                                                        <td>{list.ket_divisi}</td>
                                                        <td>{list.nama}</td>
                                                        <td>
                                                            <button type="button" className="btn btn-success mb-3 mr-2" data-toggle="modal" data-target="#strukturalModal" onClick={() => (handleDetail(list), setType("edit"))}>
                                                                Edit
                                                            </button>
                                                            <button type="button" className="btn btn-danger mb-3" onClick={() => handleDelete(list.id_struktural)}>
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

                <div className="modal fade" id="strukturalModal" tabIndex={-1} role="dialog" aria-labelledby="strukturalModalLabel" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="strukturalModal">Form Struktural</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">×</span>
                                </button>
                            </div>

                            <form onSubmit={type === "add" ? handleSubmit : handleEdit}>
                                <div className="modal-body">
                                    <pre>
                                        - API route create struktural (post): /struktural
                                        <br />
                                        - API route edit struktural (put): /struktural/:id
                                    </pre>
                                    <div className="form-group">
                                        <label htmlFor="nama">Nama Divisi</label>
                                        <select className='form-control' name="id_divisi" value={form.id_divisi} onChange={handlerInput}>
                                            <option value="">pilih divisi</option>
                                            {divisi.map((list, i) => {
                                                return (
                                                    <option value={list.id_divisi} key={i}>{list.ket_divisi}</option>
                                                )
                                            })}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="nama">Atasan</label>
                                        <select className='form-control' name="atasan" value={form.atasan} onChange={handlerInput}>
                                            <option value="">pilih atasan</option>
                                            {list_user.map((list, i) => {
                                                return (
                                                    <option value={list.no_pegawai} key={i}>{list.nama}</option>
                                                )
                                            })}
                                        </select>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-dismiss="modal" ref={modal}>Tutup</button>
                                    <button type="submit" className="btn btn-primary" disabled={loading_form_struktural}>{loading_form_struktural ? "Loading..." : "Simpan"}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Struktural;