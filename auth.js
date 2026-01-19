const SUPABASE_URL = "https://wqhatywfpwioneziadle.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxaGF0eXdmcHdpb25lemlhZGxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4MzE0NzAsImV4cCI6MjA4NDQwNzQ3MH0.e437EhncDLKPqLNRKJFh3-jvKB96-7iwXrBNOw0GvKk";

const loginLink = document.getElementById('login-link');
const authMenu = document.getElementById('auth-menu');
const authBtn = document.getElementById('user-auth-btn');
const authPanel = document.getElementById('user-auth-menu');
const logoutBtn = document.getElementById('logout-btn');
const navLogin = document.getElementById('nav-login');

if (loginLink || authBtn) {
    if (!window.supabase || !window.supabase.createClient) {
        console.error("Supabase no disponible en window.supabase");
        updateAuthUI(false);
        return;
    }

    const { createClient } = window.supabase;
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    async function checkSession() {
        try {
            const { data: { session } } = await supabase.auth.getSession();

            if (session) {
                const userId = session.user.id;

                const { data: profile, error: profileError } = await supabase
                    .from('profiles')
                    .select('display_name, avatar_url')
                    .eq('id', userId)
                    .single();

                updateAuthUI(true, profileError ? null : profile, session.user);
            } else {
                updateAuthUI(false);
            }
        } catch (error) {
            console.error("Auth check failed:", error);
            updateAuthUI(false);
        }
    }

    function setMenuOpen(isOpen) {
        if (!authPanel || !authBtn) return;
        authPanel.classList.toggle('is-open', isOpen);
        authPanel.setAttribute('aria-hidden', String(!isOpen));
        authBtn.setAttribute('aria-expanded', String(isOpen));
    }

    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'auth-toast';
        toast.textContent = message;
        document.body.appendChild(toast);
        requestAnimationFrame(() => toast.classList.add('is-visible'));
        setTimeout(() => {
            toast.classList.remove('is-visible');
            setTimeout(() => toast.remove(), 200);
        }, 2000);
    }

    function updateAuthUI(isLoggedIn, profile, user) {
        if (loginLink) {
            loginLink.classList.toggle('hidden', isLoggedIn);
        }
        if (navLogin) {
            navLogin.classList.toggle('hidden', isLoggedIn);
        }
        if (authMenu) {
            authMenu.classList.toggle('is-visible', isLoggedIn);
        }

        if (authBtn) {
            authBtn.classList.toggle('is-logged-in', isLoggedIn);
        }

        if (isLoggedIn && authBtn) {
            authBtn.title = "Mi Cuenta";

            let content = '';
            if (profile && profile.avatar_url) {
                content += `<img src="${profile.avatar_url}" alt="Avatar" class="auth-avatar">`;
            } else {
                content += `<i class="fa-solid fa-user-circle" aria-hidden="true"></i>`;
            }

            const displayName = 'Mi Cuenta';

            content += `<span>${displayName}</span>`;

            authBtn.innerHTML = content;
        }

        if (!isLoggedIn) {
            setMenuOpen(false);
        }
    }

    if (authBtn && authPanel) {
        authBtn.addEventListener('click', (event) => {
            event.preventDefault();
            const isOpen = authPanel.classList.contains('is-open');
            setMenuOpen(!isOpen);
        });

        document.addEventListener('click', (event) => {
            if (!authPanel.classList.contains('is-open')) return;
            const target = event.target;
            if (authMenu && authMenu.contains(target)) return;
            setMenuOpen(false);
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                setMenuOpen(false);
            }
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            await supabase.auth.signOut();
            setMenuOpen(false);
            updateAuthUI(false);
            showToast("Sesion cerrada");
            setTimeout(() => {
                window.location.href = "login.html";
            }, 800);
        });
    }

    checkSession();
}
