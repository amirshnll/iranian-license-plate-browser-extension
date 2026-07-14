let platesData = {};

fetch('plates.json')
  .then(response => response.json())
  .then(data => {
    platesData = data;
  })
  .catch(error => console.error('Error loading plates data:', error));

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('year').textContent = new Date().getFullYear();
  const manifest = chrome.runtime.getManifest();
  document.getElementById('version').textContent = `v${manifest.version}`;

  const btnSearch = document.getElementById('btn-search');
  const input = document.getElementById('plate-input');
  const letterSelect = document.getElementById('plate-letter');
  const resultDiv = document.getElementById('result');

  function search() {
    const code = input.value.trim();
    const letter = letterSelect.value;

    if (!code) {
      resultDiv.textContent = 'لطفا کد پلاک را وارد کنید.';
      resultDiv.className = 'msg err';
      return;
    }

    // Convert code to english digits just in case
    const englishCode = code.replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d));

    if (platesData[englishCode]) {
      const info = platesData[englishCode];
      let cityDisplay = "";

      if (info.cities) {
        if (letter && info.cities[letter]) {
          cityDisplay = info.cities[letter];
        } else if (letter && !info.cities[letter]) {
          cityDisplay = "برای این حرف در این کد شهری یافت نشد.";
        } else {
          // No letter selected
          const citiesList = Object.values(info.cities);
          const uniqueCities = [...new Set(citiesList)];

          if (uniqueCities.length === 1) {
            cityDisplay = uniqueCities[0];
          } else {
            // Show top 3 distinct cities
            const summary = uniqueCities.slice(0, 5).join('، ');
            cityDisplay = `لطفا حرف پلاک را انتخاب کنید.<br><span style="font-size: 0.8em; color: #666;">(شهرهای شامل: ${summary}${uniqueCities.length > 5 ? '...' : ''})</span>`;
          }
        }
      } else {
        cityDisplay = info.city || "نامشخص";
      }

      resultDiv.innerHTML = `استان: <b>${info.province}</b><br>شهر: <b>${cityDisplay}</b>`;
      resultDiv.className = 'msg ok';
    } else {
      resultDiv.textContent = 'اطلاعاتی برای این کد یافت نشد.';
      resultDiv.className = 'msg err';
    }
  }

  btnSearch.addEventListener('click', search);
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') search();
  });
  // Also search on letter change? Maybe not, user might want to click search.
});
