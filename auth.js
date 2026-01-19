const SUPABASE_URL = "https://wqhatywfpwioneziadle.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxaGF0eXdmcHdpb25lemlhZGxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4MzE0NzAsImV4cCI6MjA4NDQwNzQ3MH0.e437EhncDLKPqLNRKJFh3-jvKB96-7iwXrBNOw0GvKk";

const loginLink = document.getElementById('login-link');
const authBtn = document.getElementById('user-auth-btn');
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

    function updateAuthUI(isLoggedIn, profile, user) {
        if (loginLink) {
            loginLink.classList.toggle('hidden', isLoggedIn);
        }
        if (navLogin) {
            navLogin.classList.toggle('hidden', isLoggedIn);
        }
        if (authBtn) {
            authBtn.classList.toggle('hidden', !isLoggedIn);
            authBtn.classList.toggle('is-logged-in', isLoggedIn);
        }

        if (isLoggedIn && authBtn) {
            authBtn.title = "Mi Cuenta";
            authBtn.href = "dashboard.html";

            let content = '';
            if (profile && profile.avatar_url) {
                content += `<img src="${profile.avatar_url}" alt="Avatar" class="auth-avatar">`;
            } else {
                content += `<i class="fa-solid fa-user-circle" aria-hidden="true"></i>`;
            }

            let displayName = '';
            if (profile && profile.display_name) {
                displayName = profile.display_name;
            } else if (user && user.email) {
                displayName = user.email;
            } else {
                displayName = 'Mi Cuenta';
            }

            content += `<span>${displayName}</span>`;

            authBtn.innerHTML = content;
        }
    }

    checkSession();
}
