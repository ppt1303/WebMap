import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../store/authSlice";

export default function Login() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((s) => s.auth);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!username || !password) return;
    dispatch(login({ username, password }));
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.card}>
        <h2 style={styles.title}>Đăng nhập</h2>
        <form onSubmit={submit} style={styles.form}>
          <input style={styles.input} value={username} onChange={e => setUsername(e.target.value)} placeholder="Tên đăng nhập" required />
          <input style={styles.input} value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Mật khẩu" required />
          <button style={{ ...styles.button, ...(loading ? styles.buttonDisabled : {}) }} type="submit" disabled={loading}>
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
          {error && <div style={styles.error}>{error}</div>}
        </form>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0, left: 0,
    width: "100vw",
    height: "100vh",
    background: "linear-gradient(135deg, #74ABE2, #5563DE)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999
  },
  card: {
    background: "#fff",
    padding: "50px 40px",
    borderRadius: "20px",
    boxShadow: "0 15px 40px rgba(0,0,0,0.3)",
    width: "380px",
    maxWidth: "90%",
    textAlign: "center",
    animation: "fadeIn 0.5s"
  },
  title: {
    marginBottom: "30px",
    fontSize: "28px",
    color: "#333",
    fontWeight: 700
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px"
  },
  input: {
    padding: "14px",
    borderRadius: "12px",
    border: "1px solid #ccc",
    outline: "none",
    fontSize: "16px",
    transition: "0.2s",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
  },
  button: {
    background: "#5563DE",
    color: "#fff",
    padding: "14px",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    transition: "0.3s",
  },
  buttonDisabled: {
    background: "#9ca3af",
    cursor: "not-allowed"
  },
  error: {
    color: "red",
    fontWeight: "600",
    marginTop: "10px"
  },
  footer: {
    marginTop: "20px"
  },
  link: {
    textDecoration: "none",
    color: "#5563DE",
    fontWeight: "bold",
    cursor: "pointer"
  }
};
