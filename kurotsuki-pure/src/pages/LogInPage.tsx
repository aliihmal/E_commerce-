import { useState } from 'react';
import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

// inside your component:
const navigate = useNavigate();async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setError('');
    setSubmitting(true);

    const payload = {
        email,
        password
    };

    try {
        const response = await fetch(
            `${import.meta.env.VITE_API_URL}/auth/login`,
            {
                method: 'POST',
                credentials: 'include',

                headers: {
                    'Content-Type': 'application/json',
                },

                body: JSON.stringify(payload),
            }
        );

        const data = await response.json();

        console.log("LOGIN RESPONSE:", data);

     if (response.ok) {

    console.log("LOGIN RESPONSE:", data);
    sessionStorage.setItem("user", JSON.stringify(data.user));

    console.log(
        "USER STORED:",
        localStorage.getItem("user")
    );

    navigate("/products");

} else {

    setError(
        data.message || "Login failed"
    );
}

    } catch (error) {

        console.error(error);

        setError(
            'Something went wrong. Please try again.'
        );

    } finally {

        setSubmitting(false);
    }
}

  return (
    <div className="auth-wrap" id="login-page">
      <Reveal>
        <h1 className="display">Welcome Back</h1>
        <p className="sub">Log in to your RANDOM account.</p>

        {error && (
          <div className="form-error" id="login-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} id="login-form">
          <div className="form-field" id="email-field">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-field" id="password-field">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            className="btn btn-primary"
            id="login-submit"
            style={{ width: '100%' }}
            disabled={submitting}
            type="submit"
          >
            {submitting ? 'Logging in…' : 'Log In'}
          </button>
        </form>

        <div className="auth-switch" id="login-switch">
          Don't have an account? <Link to="/signup">Create one</Link>
        </div>
      </Reveal>
    </div>
  );
}