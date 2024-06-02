// eslint-disable-next-line no-unused-vars
import React, { useRef, useState } from 'react';
import axios from 'axios';

const initialState = {
    id_divisi: '',
    ket_divisi: '',
};

const Divisi = () => {
    const [loading_list_divisi, setloading_list_divisi] = useState(false)
    const [loading_form_divisi, setloading_form_divisi] = useState(false)
    const [token_list, settoken_list] = useState(sessionStorage.getItem('token'))
    const [isToken, setisToken] = useState(true)
    const [isError, setisError] = useState(false)
    const [response, setResponse] = useState(null);
    const [form, setform] = useState(initialState)
    const [divisi, setdivisi] = useState([])
    const [type, setType] = useState("add")
    const modal = useRef()

    const handlerInput = (e) => {
        setform({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const getListDivisi = async () => {
        setloading_list_divisi(true);
        try {
            const result = await axios.get('http://localhost:5000/divisi');
            setdivisi(result.data)
            setResponse({
                url: result.config.url,
                method: result.config.method,
                headers: result.config.headers,
                message: "fetch success",
                status: result.status
            });
            setisError(false)
            setloading_list_divisi(false);
        } catch (error) {
            setisError(true)
            setResponse({
                url: error.response.config.url,
                method: error.response.config.method,
                headers: error.response.config.headers,
                ...error.response.data
            });
            setloading_list_divisi(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        setloading_form_divisi(true)
        try {
            const result = await axios.post('http://localhost:5000/divisi', form, {
                headers: {
                    "Content-type": "application/json",
                    "authorization": isToken ? "Bearer " + token_list : ''
                },
            });
            const result2 = await axios.get('http://localhost:5000/divisi');
            setdivisi(result2.data)
            setform(initialState)
            setResponse({
                url: result.config.url,
                method: result.config.method,
                headers: result.config.headers.authorization,
                ...result.data
            });
            setisError(false)
            setloading_form_divisi(false)
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
            setloading_form_divisi(false)
            modal.current.click()
        }
    }

    const handleDetail = async (list) => {
        setform(list)
    }

    const handleEdit = async (e) => {
        e.preventDefault()
        setloading_form_divisi(true)
        try {
            const result = await axios.put(`http://localhost:5000/divisi/${form.id_divisi}`, form, {
                headers: {
                    "Content-type": "application/json",
                    "authorization": isToken ? "Bearer " + token_list : ''
                },
            });
            const result2 = await axios.get('http://localhost:5000/divisi');
            setdivisi(result2.data)
            setform(initialState)
            setResponse({
                url: result.config.url,
                method: result.config.method,
                headers: result.config.headers.authorization,
                ...result.data
            });
            setisError(false)
            setloading_form_divisi(false)
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
            setloading_form_divisi(false)
            modal.current.click()
        }
    }

    const handleDelete = async (id) => {
        try {
            const result = await axios.delete(`http://localhost:5000/divisi/${id}`, {
                headers: {
                    "Content-type": "application/json",
                    "authorization": isToken ? "Bearer " + token_list : ''
                },
            });
            const result2 = await axios.get('http://localhost:5000/divisi');
            setdivisi(result2.data)
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
                <h5 className="card-title text-center">Data Divisi</h5>
                <pre>API route get divisi: /divisi</pre>
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
                <button type="button" className="btn btn-success mb-4 mt-2 mr-2" onClick={getListDivisi}>
                    {loading_list_divisi ? "Fetching..." : "Fetch Divisi List"}
                </button>
                <button type="button" className="btn btn-primary mb-3" data-toggle="modal" data-target="#divisiModal" onClick={() => (setform(initialState), setType("add"))}>Tambah</button>
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
                    loading_list_divisi ?
                        <div className='text-center'>
                            Fetching divisi list...
                        </div>
                        :
                        <>
                            {divisi.length === 0 && !isError ?
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
                                                <th>Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {divisi.map((list, i) => {
                                                return (
                                                    <tr key={i}>
                                                        <td>{i + 1}</td>
                                                        <td>{list.ket_divisi}</td>
                                                        <td>
                                                            <button type="button" className="btn btn-success mb-3 mr-2" data-toggle="modal" data-target="#divisiModal" onClick={() => (handleDetail(list), setType("edit"))}>
                                                                Edit
                                                            </button>
                                                            <button type="button" className="btn btn-danger mb-3" onClick={() => handleDelete(list.id_divisi)}>
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

                <div className="modal fade" id="divisiModal" tabIndex={-1} role="dialog" aria-labelledby="divisiModalLabel" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="divisiModal">Form Divisi</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">×</span>
                                </button>
                            </div>

                            <form onSubmit={type === "add" ? handleSubmit : handleEdit}>
                                <div className="modal-body">
                                    <pre>
                                        - API route create divisi (post): /divisi
                                        <br />
                                        - API route edit divisi (put): /divisi/:id
                                    </pre>
                                    <div className="form-group">
                                        <label htmlFor="nama">Nama Divisi</label>
                                        <input type="text" required className="form-control" name="ket_divisi" value={form.ket_divisi} onChange={handlerInput} />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-dismiss="modal" ref={modal}>Tutup</button>
                                    <button type="submit" className="btn btn-primary" disabled={loading_form_divisi}>{loading_form_divisi ? "Loading..." : "Simpan"}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Divisi;