// Shared login helpers for all pages.
(function () {
  const C = window.APP_CONFIG;
  const sb = window.supabase.createClient(C.SUPABASE_URL, C.SUPABASE_KEY);
  window.sb = sb;

  // Returns {session, profile} or redirects to the login page.
  window.requireLogin = async function (opts = {}) {
    const { data: { session } } = await sb.auth.getSession();
    if (!session) { location.replace('index.html'); return null; }
    const { data: profile, error } = await sb.from('profiles').select('*').eq('id', session.user.id).single();
    if (error || !profile) { await sb.auth.signOut(); location.replace('index.html'); return null; }
    if (opts.admin && profile.role !== 'admin') { location.replace('dashboard.html'); return null; }
    return { session, profile };
  };

  window.signOut = async function () { await sb.auth.signOut(); location.replace('index.html'); };

  // Tariff row -> the field names the dashboard uses.
  window.tariffToFields = t => ({
    tariff: Number(t.normal_rate), pk1s: t.peak1_start.slice(0, 5), pk1e: t.peak1_end.slice(0, 5),
    pk2s: t.peak2_start.slice(0, 5), pk2e: t.peak2_end.slice(0, 5), pkPct: Number(t.peak_pct),
    opS: t.off_start.slice(0, 5), opE: t.off_end.slice(0, 5), opPct: Number(t.off_pct)
  });
})();
