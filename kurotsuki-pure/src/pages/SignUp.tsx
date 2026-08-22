import { useState } from 'react';
import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const payload ={
      name,
      email,
      password,
      phone
    }
    const createUser = async () => {
      const response = await fetch(`http://localhost:3000/user/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log(data);
    };
    createUser();
    setSubmitting(false);
  }

  return (
    <div className="auth-wrap" id="register-page">
      <Reveal>
        <h1 className="display">Join Kurotsuki</h1>
        <p className="sub">Create an account to shop and place orders.</p>

        {error && (
          <div className="form-error" id="register-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} id="register-form">
          <div className="form-field" id="name-field">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-field" id="register-email-field">
            <label htmlFor="register-email">Email</label>
            <input
              type="email"
              id="register-email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-field" id="register-password-field">
            <label htmlFor="register-password">Password</label>
            <input
              type="password"
              id="register-password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
            />
          </div>

          <div className="form-row" id="contact-fields">
            <div className="form-field" id="phone-field">
              <label htmlFor="phone">Phone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            
          </div>

          <button
            className="btn btn-primary"
            id="register-submit"
            style={{ width: '100%' }}
            disabled={submitting}
            type="submit"
          >
            {submitting ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <div className="auth-switch" id="register-switch">
          Already have an account? <Link to="/login">Log in</Link>
        </div>
      </Reveal>
    </div>
  );
}