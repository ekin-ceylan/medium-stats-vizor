function addButtons() {
  const rows = document.querySelectorAll('.ae.bf.bg.bh'); // Medium stats table satırları

  rows.forEach(row => {
    if (row.querySelector('.fetch-stats-btn')) return; // Zaten ekli ise tekrar ekleme

    const button = document.createElement('button');
    button.innerText = 'Detay Al';
    button.className = 'fetch-stats-btn';
    button.style.marginLeft = '10px';
    button.style.padding = '2px 5px';
    button.style.fontSize = '12px';

    button.onclick = async () => {
      const title = row.querySelector('h2')?.innerText || 'Unknown';
      console.log(`📊 Veri alınıyor: ${title}`);

      // Şimdilik sahte veri ekleyelim
      const newCell = document.createElement('div');
      newCell.innerText = 'Claps: 123'; // Buraya ileride gerçek veri gelecek
      newCell.style.marginTop = '5px';
      row.appendChild(newCell);
    };

    row.appendChild(button);
  });
}

// Sayfa tamamen yüklenince butonları ekle
window.addEventListener('load', () => {
  setTimeout(addButtons, 3000); // Medium geç yükleniyor, biraz bekliyoruz
});
