const searchBtn = document.getElementById('searchBtn');
const cityInput = document.getElementById('cityInput');
const result = document.getElementById('result');

function showMessage(msg) {
  result.classList.remove('hidden');
  result.innerHTML = `<div class="card"><pre>${msg}</pre></div>`;
}

function interpretAqi(aqi) {
  if (aqi === null || aqi === undefined) return 'Unknown';
  aqi = Number(aqi);
  if (aqi <= 50) return {label:'Good', cls:'good'};
  if (aqi <=100) return {label:'Moderate', cls:'badge'};
  if (aqi <=200) return {label:'Unhealthy', cls:'poor'};
  return {label:'Very Unhealthy', cls:'poor'};
}

searchBtn.addEventListener('click', async () => {
  const city = cityInput.value.trim();
  if (!city) return alert('Please enter a city name');
  result.classList.remove('hidden');
  result.innerHTML = '<div class="card">Loading...</div>';
  try {
    const res = await fetch(`/api/search?city=${encodeURIComponent(city)}`);
    if (!res.ok) {
      const err = await res.json().catch(()=>({error:res.statusText}));
      result.innerHTML = '<div class="card"><strong>Error:</strong> ' + (err.error || JSON.stringify(err)) + '</div>';
      return;
    }
    const data = await res.json();
    // provider returns status / data
    if (data.status && data.status !== 'ok') {
      result.innerHTML = '<div class="card"><strong>Provider:</strong> ' + data.data + '</div>';
      return;
    }
    const d = data.data;
    const cityName = d.city && d.city.name ? d.city.name : '—';
    const aqi = d.aqi !== undefined ? d.aqi : '—';
    const time = d.time && d.time.s ? d.time.s : (d.time && d.time.iso ? d.time.iso : '—');
    const dominent = d.dominentpol || '—';
    // iaqi components
    const iaqi = d.iaqi || {};
    const parts = ['pm25','pm10','o3','no2','so2','co'];
    let comps = '';
    parts.forEach(p=>{
      if (iaqi[p]) comps += `<div class="kv"><div>${p.toUpperCase()}</div><div>${iaqi[p].v}</div></div>`;
    });
    const level = interpretAqi(aqi);
    result.innerHTML = `
      <div class="card">
        <h2>${cityName} <span class="${level.cls}">${level.label} — AQI ${aqi}</span></h2>
        <div class="section"><strong>Updated:</strong> ${time} &nbsp; <strong>Dominant pollutant:</strong> ${dominent}</div>
        <div class="section"><h3>Pollutant details</h3>${comps || '<div class="kv">No pollutant breakdown available</div>'}</div>
        <div class="section"><h3>Raw JSON (trim)</h3><pre style="max-height:220px;overflow:auto">${JSON.stringify(d,null,2)}</pre></div>
      </div>
    `;
  } catch (e) {
    result.innerHTML = '<div class="card"><strong>Error:</strong> ' + e.message + '</div>';
  }
});
