// eslint-disable-next-line no-unused-vars
import React, { useRef, useState } from 'react';
import axios from 'axios';

const initialState = {
    no_pegawai: '',
    nama: '',
    level_user: '',
    tgl_masuk: '',
    gender: '',
    no_ktp: '',
    no_hp: '',
    email: '',
    alamat_domisili: '',
    alamat_ktp: '',
    tempat_lahir: '',
    tgl_lahir: '',
    status_nikah: '',
    tgl_keluar: '',
    pendidikan: '',
    posisi: '',
    divisi: '',
    jabatan: ''
};

const ListUser = () => {
    const [loading_list_user, setloading_list_user] = useState(false)
    const [list_user, setlist_user] = useState([])
    const [token_list, settoken_list] = useState(sessionStorage.getItem('type') == 'RSA' ? sessionStorage.getItem('token') : sessionStorage.getItem('token_hmac'))
    const [isToken, setisToken] = useState(true)
    const [isError, setisError] = useState(false)
    const [response, setResponse] = useState(null);
    const [form, setform] = useState(initialState)
    const [loading_add_user, setloading_add_user] = useState(false)
    const [loading_edit_user, setloading_edit_user] = useState(false)
    const [divisi, setdivisi] = useState([])
    const modal = useRef()
    const modal2 = useRef()
    const algoritme = sessionStorage.getItem('type') == 'RSA' ? '' : '-hmac'

    const handlerInput = (e) => {
        setform({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const getListUser = async () => {
        setloading_list_user(true);
        try {
            const result = await axios.get('http://localhost:5000/user' + algoritme, {
                headers: {
                    "Content-type": "application/json",
                    "authorization": isToken ? "Bearer " + token_list : ''
                },
            });
            const resdivisi = await axios.get('http://localhost:5000/divisi' + algoritme);
            setdivisi(resdivisi.data)
            setResponse({
                url: result.config.url,
                method: result.config.method,
                headers: result.config.headers.authorization,
                message: "fetch success",
                status: result.status
            });
            setisError(false)
            setlist_user(result.data)
            setloading_list_user(false);
        } catch (error) {
            setisError(true)
            setlist_user([])
            setResponse({
                url: error.response.config.url,
                method: error.response.config.method,
                headers: error.response.config.headers.authorization,
                ...error.response.data
            });
            setloading_list_user(false);
        }
    };

    const handleSubmitUser = async (e) => {
        e.preventDefault()
        setloading_add_user(true)
        try {
            const result = await axios.post('http://localhost:5000/create-user' + algoritme, form, {
                headers: {
                    "Content-type": "application/json",
                    "authorization": isToken ? "Bearer " + token_list : ''
                },
            });
            const result2 = await axios.get('http://localhost:5000/user' + algoritme, {
                headers: {
                    "Content-type": "application/json",
                    "authorization": isToken ? "Bearer " + token_list : ''
                },
            });
            setlist_user(result2.data)
            setform(initialState)
            setResponse({
                url: result.config.url,
                method: result.config.method,
                headers: result.config.headers.authorization,
                ...result.data
            });
            setisError(false)
            setloading_add_user(false)
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
            setloading_add_user(false)
            modal.current.click()
        }
    }

    const handleDetail = async (id) => {
        try {
            const result = await axios.get(`http://localhost:5000/user${algoritme}?nopeg=${id}`, {
                headers: {
                    "Content-type": "application/json",
                    "authorization": isToken ? "Bearer " + token_list : ''
                },
            });
            setform({ ...form, ...result.data })
            setResponse({
                url: result.config.url,
                method: result.config.method,
                headers: result.config.headers.authorization,
                status: result.status
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

    const handleEditData = async (e) => {
        e.preventDefault()
        setloading_edit_user(true);
        try {
            const result = await axios.post(`http://localhost:5000/user${algoritme}?nopeg=${form.no_pegawai}`, form, {
                headers: {
                    "Content-type": "application/json",
                    "authorization": isToken ? "Bearer " + token_list : ''
                },
            });
            const result2 = await axios.get('http://localhost:5000/user' + algoritme, {
                headers: {
                    "Content-type": "application/json",
                    "authorization": isToken ? "Bearer " + token_list : ''
                },
            });
            setlist_user(result2.data)
            setform(initialState)
            setResponse({
                url: result.config.url,
                method: result.config.method,
                headers: result.config.headers.authorization,
                ...result.data
            });
            setisError(false)
            setloading_edit_user(false);
            modal2.current.click()
        } catch (error) {
            setisError(true)
            setResponse({
                url: error.response.config.url,
                method: error.response.config.method,
                headers: error.response.config.headers.authorization,
                ...error.response.data
            });
            setform(initialState)
            setloading_list_user(false);
            modal2.current.click()
        }
    }

    return (
        <div className='card shadow-sm mb-3'>
            <div className="card-body">
                <h5 className="card-title text-center">Data Pegawai</h5>
                <pre>API route get user: /user</pre>
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
                <button type="button" className="btn btn-success mb-4 mt-2 mr-2" onClick={getListUser}>
                    {loading_list_user ? "Fetching..." : "Fetch User List"}
                </button>
                <button type="button" className="btn btn-primary mb-3" data-toggle="modal" data-target="#tambahDataModal" onClick={() => setform(initialState)}>Tambah</button>
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
                    loading_list_user ?
                        <div className='text-center'>
                            Fetching user list...
                        </div>
                        :
                        <>
                            {list_user.length === 0 && !isError ?
                                <div className='text-center'>
                                    No Data Found.
                                </div>
                                :
                                <div className='table-responsive'>
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>No</th>
                                                <th>No Pegawai</th>
                                                <th>Nama</th>
                                                <th>Divisi</th>
                                                <th>Level User</th>
                                                <th>Default Password</th>
                                                <th>Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {list_user.map((list, i) => {
                                                return (
                                                    <tr key={i}>
                                                        <td>{i + 1}</td>
                                                        <td>{list.no_pegawai}</td>
                                                        <td>{list.nama}</td>
                                                        <td>{list.divisi}</td>
                                                        <td>{list.level_user}</td>
                                                        <td>{list.default_password}</td>
                                                        <td>
                                                            <button type="button" className="btn btn-success mb-3" data-toggle="modal" data-target="#detailDataModal" onClick={() => handleDetail(list.no_pegawai)}>
                                                                Detail
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

                {/* modal tambah  */}
                <div className="modal fade" id="tambahDataModal" tabIndex={-1} role="dialog" aria-labelledby="tambahDataModalLabel" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="tambahDataModalLabel">Tambah Data Pegawai</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">×</span>
                                </button>
                            </div>

                            <form onSubmit={handleSubmitUser}>
                                <div className="modal-body">
                                    <pre>API route create user: /create-user</pre>
                                    <div className="form-group">
                                        <label htmlFor="nama">Nama</label>
                                        <input type="text" required className="form-control" name="nama" placeholder="Masukkan Nama" value={form.nama} onChange={handlerInput} />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="no_pegawai">No Pegawai</label>
                                        <input type="text" required className="form-control" name="no_pegawai" placeholder="Masukkan No Pegawai" value={form.no_pegawai} onChange={handlerInput} />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="password">Level User</label>
                                        <select className='form-control' required name='level_user' value={form.level_user} onChange={handlerInput}>
                                            <option value="">- pilih -</option>
                                            <option value="user">user</option>
                                            <option value="superadmin">superadmin</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-dismiss="modal" ref={modal}>Tutup</button>
                                    <button type="submit" className="btn btn-primary" disabled={loading_add_user}>{loading_add_user ? "Loading..." : "Simpan"}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {/* modal detail  */}
                <div className="modal fade" id="detailDataModal" tabIndex={-1} role="dialog" aria-labelledby="detailDataModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="tambahDataModalLabel">Detail Pegawai</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">×</span>
                                </button>
                            </div>
                            <form onSubmit={handleEditData}>
                                <div className="modal-body row">
                                    <div className="col-md-12">
                                        <pre>
                                            - API route detail user (get): /user?nopeg=
                                            <br />
                                            - API route edit user (post): /user?nopeg=
                                        </pre>
                                    </div>
                                    <div className="col-md-12">
                                        {response && !isError ?
                                            <>
                                                <label>Response:</label>
                                                <pre>
                                                    {JSON.stringify(response, null, 2)}
                                                </pre>
                                            </>
                                            : null
                                        }
                                        {response && isError ?
                                            <>
                                                <label>Response:</label>
                                                <pre>
                                                    {JSON.stringify(response, null, 2)}
                                                </pre>
                                            </>
                                            : null
                                        }
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="nama">Nama</label>
                                            <input type="text" required className="form-control" name="nama" placeholder="Masukkan Nama" value={form.nama} onChange={handlerInput} />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="no_pegawai">No Pegawai</label>
                                            <input type="text" required className="form-control" name="no_pegawai" placeholder="Masukkan No Pegawai" value={form.no_pegawai} disabled />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="tgl_masuk">Tanggal Masuk</label>
                                            <input type="date" required className="form-control" name="tgl_masuk" value={form.tgl_masuk} onChange={handlerInput} />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="gender">Jenis Kelamin</label>
                                            <select className="form-control" name="gender" value={form.gender} onChange={handlerInput}>
                                                <option value="">Pilih Jenis Kelamin</option>
                                                <option value="Laki-Laki">Laki-Laki</option>
                                                <option value="Perempuan">Perempuan</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="no_ktp">Nomor KTP</label>
                                            <input type="number" required className="form-control" name="no_ktp" placeholder="Masukkan Nomor KTP" value={form.no_ktp} onChange={handlerInput} />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="no_hp">Nomor HP</label>
                                            <input type="number" required className="form-control" name="no_hp" placeholder="Masukkan Nomor HP" value={form.no_hp} onChange={handlerInput} />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="email">Email</label>
                                            <input type="email" required className="form-control" name="email" placeholder="Masukkan Email" value={form.email} onChange={handlerInput} />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="alamat_domisili">Alamat Domisili</label>
                                            <input type="text" required className="form-control" name="alamat_domisili" placeholder="Masukkan Alamat Domisili" value={form.alamat_domisili} onChange={handlerInput} />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="alamat_ktp">Alamat KTP</label>
                                            <input type="text" required className="form-control" name="alamat_ktp" placeholder="Masukkan Alamat KTP" value={form.alamat_ktp} onChange={handlerInput} />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="tempat_lahir">Tempat Lahir</label>
                                            <input type="text" required className="form-control" name="tempat_lahir" placeholder="Masukkan Tempat Lahir" value={form.tempat_lahir} onChange={handlerInput} />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="tgl_lahir">Tanggal Lahir</label>
                                            <input type="date" required className="form-control" name="tgl_lahir" value={form.tgl_lahir} onChange={handlerInput} />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="status_nikah">Status Nikah</label>
                                            <select className="form-control" name="status_nikah" value={form.status_nikah} onChange={handlerInput}>
                                                <option value="">Pilih Status Nikah</option>
                                                <option value="Single">Single</option>
                                                <option value="Menikah">Menikah</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="tgl_keluar">Tanggal Keluar</label>
                                            <input type="date" className="form-control" name="tgl_keluar" value={form.tgl_keluar} onChange={handlerInput} />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="pendidikan">Pendidikan</label>
                                            <select className="form-control" name="pendidikan" value={form.pendidikan} onChange={handlerInput}>
                                                <option value="">Pilih Pendidikan</option>
                                                <option value="SD">SD</option>
                                                <option value="SMP">SMP</option>
                                                <option value="SMA/SMK">SMA/SMK</option>
                                                <option value="D3">D3</option>
                                                <option value="S1">S1</option>
                                                <option value="S2">S2</option>
                                                <option value="S3">S3</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="posisi">Posisi</label>
                                            <select className="form-control" name="posisi" value={form.posisi} onChange={handlerInput}>
                                                <option value="">Pilih Posisi</option>
                                                <option value="Karyawan">Karyawan</option>
                                                <option value="Dosen">Dosen</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="divisi">Divisi</label>
                                            <select className="form-control" name="divisi" value={form.divisi} onChange={handlerInput}>
                                                <option value="">Pilih Divisi</option>
                                                {divisi.map((list, i) => {
                                                    return (
                                                        <option value={list.id_divisi} key={i}>{list.ket_divisi}</option>
                                                    )
                                                })}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="jabatan">Jabatan</label>
                                            <input type="text" required className="form-control" name="jabatan" placeholder="Masukkan Jabatan" value={form.jabatan} onChange={handlerInput} />
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-dismiss="modal" ref={modal2}>Tutup</button>
                                    <button type="submit" className="btn btn-primary" disabled={loading_edit_user}>{loading_edit_user ? "Loading..." : "Simpan"}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ListUser;