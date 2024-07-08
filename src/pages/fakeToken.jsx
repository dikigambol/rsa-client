import axios from "axios";
import { useState } from "react";
import { authInfo } from "../services/getUserInfo";

export default function FakeToken() {
    const [response, setResponse] = useState(null);
    const [loading_auth, setLoadingAuth] = useState(false);
    const [form, setForm] = useState({});
    const [copySuccess, setCopySuccess] = useState('');
    const nopeg = sessionStorage.getItem('token') ? authInfo().nopeg : 'xxx'

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoadingAuth(true);
        try {
            const result = await axios.post(`http://localhost:5000/fake-token/${sessionStorage.getItem('type')}/${nopeg}`, form);
            setResponse(result.data);
            setLoadingAuth(false);
            setCopySuccess(''); // Reset copy success message
        } catch (error) {
            setResponse(error.response ? error.response.data : { error: error.message });
            setLoadingAuth(false);
        }
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(response.token);
            setCopySuccess('Response copied to clipboard!');
        } catch (err) {
            setCopySuccess('Failed to copy!');
        }
    };

    return (
        <div className="card shadow-sm">
            <div className="card-body">
                <h5 className="card-title text-center">Buat Token Palsu</h5>
                <form onSubmit={handleSubmit}>
                    <div className="mb-2">
                        <label>Nopeg</label>
                        <input className="form-control" name="nopeg" onChange={handleChange} />
                    </div>
                    <div className="mb-2">
                        <label>Name</label>
                        <input className="form-control" name="name" onChange={handleChange} />
                    </div>
                    <div className="mb-2">
                        <label>Role</label>
                        <input className="form-control" name="role" onChange={handleChange} />
                    </div>
                    <div className="mb-2">
                        <label>Claim</label>
                        <input className="form-control" value="only distributed for SI HRD Asia" disabled />
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary btn-block mt-4"
                        disabled={loading_auth}
                    >
                        {loading_auth ? "Loading..." : "Buat"}
                    </button>
                </form>
                {response && (
                    <>
                        <br />
                        <label>Response:</label>
                        <pre>
                            {JSON.stringify(response, null, 2)}
                        </pre>
                        <button
                            className="btn btn-secondary btn-block mt-2"
                            onClick={copyToClipboard}
                        >
                            Copy to Clipboard
                        </button>
                        {copySuccess && (
                            <div className="alert alert-info mt-2" role="alert">
                                {copySuccess}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
