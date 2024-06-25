import axios from "axios";
import { useState, useEffect } from "react";

export default function Injeksi() {
    const [response, setResponse] = useState(null);
    const [loading_auth, setLoadingAuth] = useState(false);
    const [form, setForm] = useState({
        method: "",
        url: "",
        json: {}
    });
    const [token_list, settoken_list] = useState(sessionStorage.getItem('token'))

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
            if (form.method == "GET") {
                const result = await axios.get(`http://localhost:5000${form.url}`,
                    {
                        headers: {
                            "Content-type": "application/json",
                            "authorization": "Bearer " + sessionStorage.getItem('token')
                        },
                    }
                );
                setResponse(result.data);
                setLoadingAuth(false);
            } else if (form.method == "POST") {
                const result = await axios.post(`http://localhost:5000${form.url}`, JSON.parse(form.json),
                    {
                        headers: {
                            "Content-type": "application/json",
                            "authorization": "Bearer " + sessionStorage.getItem('token')
                        },
                    }
                );
                setResponse(result.data);
                setLoadingAuth(false);
            } else {
                setResponse({ error: "method not set" });
                setResponse(result.data);
                setLoadingAuth(false);
            }
        } catch (error) {
            setResponse(error.response ? error.response.data : { error: error.message });
            setLoadingAuth(false);
        }
    };

    return (
        <div className="card shadow-sm">
            <div className="card-body">
                <h5 className="card-title text-center">Injeksi SQL</h5>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Method</label>
                        <select name="method" className="form-control" onChange={handleChange}>
                            <option value="">- pilih -</option>
                            <option value="GET">GET</option>
                            <option value="POST">POST</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Route URL</label>
                        <input type="text" className="form-control" name="url" placeholder="ex. /login" onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>JSON</label>
                        <textarea className="form-control json-input" name="json" rows={5} placeholder="{&quot;key&quot;: &quot;value&quot;}" defaultValue={""} onChange={handleChange} />
                    </div>
                    <button type="submit" className="btn btn-primary btn-block" disabled={loading_auth}>{loading_auth ? "Loading..." : "Submit"}</button>
                </form>
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
