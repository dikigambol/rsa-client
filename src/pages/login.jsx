import axios from "axios";
import { useState, useEffect } from "react";
import { authInfo } from "../services/getUserInfo";

export default function Login() {
    const [no_pegawai, setNopeg] = useState(null);
    const [password, setPassword] = useState('');
    const [response, setResponse] = useState(null);
    const [loading_auth, setLoadingAuth] = useState(false);
    const [token, setToken] = useState(sessionStorage.getItem('token') || '');

    useEffect(() => {
        setToken(sessionStorage.getItem('token') || '');
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoadingAuth(true);
        try {
            const result = await axios.post('http://localhost:5000/login', {
                no_pegawai: parseInt(no_pegawai),
                password
            });
            sessionStorage.setItem('token', result.data.token);
            sessionStorage.setItem('token_hmac', result.data.token_hmac);
            sessionStorage.setItem('type', 'RSA');
            setToken(result.data.token);
            setLoadingAuth(false);
            window.location.reload()
        } catch (error) {
            setResponse(error.response.data);
            setLoadingAuth(false);
        }
    };

    return (
        <div className="card shadow-sm">
            <div className="card-body">
                <h5 className="card-title text-center">Simulasi Login</h5>
                <pre>API route login: /login</pre>
                {token &&
                    <div>
                        <p>Logged in</p>
                        <p>
                            Nomor Pegawai:
                            <br />
                            {authInfo().nopeg}
                        </p>
                        <p>
                            Nama Lengkap:
                            <br />
                            {authInfo().name}
                        </p>
                        <p>
                            Level User:
                            <br />
                            {authInfo().role}
                        </p>
                        <pre>
                            token : {sessionStorage.getItem('type') == 'RSA' ? sessionStorage.getItem('token') : sessionStorage.getItem('token_hmac')}
                        </pre>
                        <button className="btn btn-danger btn-block" onClick={() => {
                            sessionStorage.clear();
                            window.location.reload();
                        }}>
                            Logout
                        </button>

                    </div>
                }
                {!token && (
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="noPegawai">Nomor Pegawai</label>
                            <input
                                type="number"
                                className="form-control"
                                onChange={(e) => setNopeg(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Katasandi</label>
                            <input
                                type="password"
                                className="form-control"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            className="btn btn-primary btn-block mt-4"
                            disabled={loading_auth}
                        >
                            {loading_auth ? "Loading..." : "Login"}
                        </button>
                    </form>
                )}
                {response && (
                    <>
                        <br />
                        <label>Response:</label>
                        <pre>
                            {JSON.stringify(response, null, 2)}
                        </pre>
                    </>
                )}
            </div>
        </div>
    );
}