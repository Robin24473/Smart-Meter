// Links the dashboard to the logged-in user: their meter and the admin's tariff.
(async function () {
  const $ = id => document.getElementById(id);
  const C = window.APP_CONFIG;
  $('connectPanel').hidden = true;
  const me = await requireLogin();
  if (!me) return;
  $('who').textContent = me.profile.full_name || me.profile.email;
  $('signOut').onclick = signOut;
  if (me.profile.role === 'admin') $('adminLink').hidden = false;

  // Tariff set by the admin
  async function loadTariff() {
    const { data: t } = await sb.from('tariff').select('*').eq('id', 1).single();
    if (!t) return;
    dashAPI.setTariff(tariffToFields(t));
    $('rateSrc').textContent = `Rates for ${t.city}, set by the administrator`;
  }
  await loadTariff();
  sb.channel('tariff').on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'tariff' }, loadTariff).subscribe();

  // The user's meters
  const { data: meters } = await sb.from('meters').select('device_id,label').order('created_at');
  if (!meters || !meters.length) {
    $('headSub').textContent = 'No meter is linked to your account yet. Ask the administrator to add it.';
    dashAPI.hideConnect();
    return;
  }
  const pick = $('meterPick');
  if (meters.length > 1) {
    pick.innerHTML = meters.map(m => `<option value="${m.device_id}">${m.label || m.device_id}</option>`).join('');
    pick.hidden = false;
    pick.onchange = () => { dashAPI.setMeter(pick.value, C.BROKER_WSS); dashAPI.connect(); };
  }
  dashAPI.setMeter(meters[0].device_id, C.BROKER_WSS);
  dashAPI.connect();
})();
