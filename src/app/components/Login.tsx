import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Register from './Register'; // Pastikan Anda mengimpor komponen modal registrasi

const Login = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null); // Untuk menangani kesalahan login
  const [isRegisterOpen, setIsRegisterOpen] = useState(false); // State untuk modal register
  const [resetEmail, setResetEmail] = useState(''); // State untuk email reset password
  const [resetError, setResetError] = useState(null); // Untuk menangani kesalahan reset
  const [resetSuccess, setResetSuccess] = useState(false); // Untuk menampilkan pesan sukses reset
  const navigate = useNavigate(); // Gunakan useNavigate untuk redirect

  // Menentukan redirect URL berdasarkan apakah di localhost atau di server eksternal
  const isLocal = window.location.hostname === 'localhost';

  const signInWithEmail = async () => {
    setError(null);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
  
    if (error) {
      console.error('Error logging in with email and password:', error.message);
      setError('Invalid email or password');
    } else {
      console.log('Logged in successfully:', data);
  
      // Fetch user profile or user role
      const { data: user, error: userError } = await supabase.auth.getUser(); // Get logged-in user
      if (userError) {
        console.error('Error getting user:', userError.message);
        setError('Error getting user');
        return;
      }
      const { data: userProfile, error: profileError } = await supabase
        .from('users') // Assuming you have a table like user_profiles
        .select('role_id') // Select the role of the user
        .eq('id', user.id)
        .single();
  
      if (profileError) {
        console.error('Error fetching user profile:', profileError.message);
      } else {
        // Check the user's role and redirect accordingly
        if (userProfile.role_id === '1') {
          navigate('/dashboard', { replace: true }); // Admin redirected to dashboard
        } else {
          navigate('/', { replace: true }); // Non-admin redirected to home
        }
      }
  
      onClose();
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signInWithEmail();
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        redirectTo: window.location.hostname === 'localhost' 
          ? '/' 
          : '/',
      });

      if (error) {
        throw error;
      }

      // Redirect manual jika perlu
      navigate('/Dashboard', { replace: true });

    } catch (error) {
      console.error('Error during Google login:', error.message);
      alert('Terjadi kesalahan saat login dengan Google.');
      navigate('/', { replace: true });
    }
};

  const handleRegisterRedirect = () => {
    setIsRegisterOpen(true); // Menampilkan modal register
  };

  const handlePasswordReset = async () => {
    setResetError(null);
    setResetSuccess(false);
    const { error } = await supabase.auth.api.resetPasswordForEmail(resetEmail);

    if (error) {
      setResetError(error.message);
    } else {
      setResetSuccess(true);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="relative max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg flex flex-col">
      <button onClick={onClose} className="absolute top-[0px] right-[20px] text-5xl text-gray-700 hover:text-gray-900">
        &times;
      </button>

      <div className="flex">
        {/* Left side - Logo */}
        <div className="bg-transparent p-6 flex flex-col justify-center items-center w-1/3 rounded-l-lg">
          <Image src="/ino.png" alt="Logo" width={128} height={128} className="w-32 h-auto mb-4" />
        </div>

        {/* Right side - Login Form */}
        <div className="p-6 w-2/3">
          <form onSubmit={handleSubmit}>
            <h2 className="text-2xl font-bold mb-4">Login</h2>

            <div className="mb-4">
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            {error && (
              <div className="mb-4 text-red-500">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-[#a2003b] text-white py-2 rounded-md hover:bg-red-800 transition duration-200"
            >
              Masuk
            </button>

            <p className="mt-4 text-sm text-gray-600">
              Belum punya akun?{' '}
              <button
                type="button"
                onClick={handleRegisterRedirect} // Buka modal pendaftaran
                className="text-blue-600 hover:underline"
              >
                Daftar di sini
              </button>
            </p>

            <p className="mt-2 text-sm text-gray-600">
              <button
                type="button"
                onClick={() => setResetEmail('')} // Reset email untuk reset password
                className="text-blue-600 hover:underline"
              >
                Lupa Password? 
              </button>
            </p>
          </form>

          <button
            onClick={handleGoogleLogin}
            className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-red-700 transition duration-200"
          >
            Masuk dengan Google
          </button>
        </div>
      </div>

      {/* Modal Registrasi */}
      {isRegisterOpen && (
        <Register isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)} />
      )}

      {/* Modal Reset Password */}
      {resetEmail && (
        <div className="modal-container">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h3 className="text-lg font-semibold">Reset Password</h3>
            <div className="mb-4">
              <label className="block text-gray-700">Email untuk reset password</label>
              <input
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="Masukkan email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            {resetError && <div className="mb-4 text-red-500">{resetError}</div>}
            {resetSuccess && <div className="mb-4 text-green-500">Email reset password telah dikirim.</div>}

            <button
              onClick={handlePasswordReset}
              className="w-full bg-blue-600 text-white py-2 rounded-md"
            >
              Kirim Link Reset
            </button>

            <button
              onClick={() => setResetEmail('')}
              className="mt-2 w-full bg-gray-300 text-gray-700 py-2 rounded-md"
            >
              Batal
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
