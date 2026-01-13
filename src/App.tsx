import React, { useState, useEffect } from 'react';
import { User, Phone, School, MapPin, Send, Loader2, Navigation } from 'lucide-react';

interface Region {
  id: string;
  name: string;
}

const AbsensiForm = () => {
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    nama: '', telepon: '', alamat: '', sekolah: '',
    provinsi: '', kota: '', kecamatan: '', kelurahan: ''
  });

  const [regions, setRegions] = useState<{
    prov: Region[], city: Region[], dist: Region[], village: Region[]
  }>({ prov: [], city: [], dist: [], village: [] });

  useEffect(() => {
    fetch('https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json')
      .then(res => res.json())
      .then(data => setRegions(prev => ({ ...prev, prov: data })));
  }, []);

  const handleProvChange = (id: string, name: string) => {
    setFormData({ ...formData, provinsi: name, kota: '', kecamatan: '', kelurahan: '' });
    setRegions(prev => ({ ...prev, city: [], dist: [], village: [] }));
    fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${id}.json`)
      .then(res => res.json())
      .then(data => setRegions(prev => ({ ...prev, city: data })));
  };

  const handleCityChange = (id: string, name: string) => {
    setFormData({ ...formData, kota: name, kecamatan: '', kelurahan: '' });
    setRegions(prev => ({ ...prev, dist: [], village: [] }));
    fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/districts/${id}.json`)
      .then(res => res.json())
      .then(data => setRegions(prev => ({ ...prev, dist: data })));
  };

  const handleDistChange = (id: string, name: string) => {
    setFormData({ ...formData, kecamatan: name, kelurahan: '' });
    setRegions(prev => ({ ...prev, village: [] }));
    fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/villages/${id}.json`)
      .then(res => res.json())
      .then(data => setRegions(prev => ({ ...prev, village: data })));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwq6_DePYRU7Y8Q1gM4lRlWLwWQxXs0Fe0r_9hjtZ6ryCITHG2Dx-I_zYvQhO8jF7ql/exec';

    try {
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify(formData)
      });

      // Tampilkan popup sukses
      setShowSuccess(true);

      // RESET FORM: Mengosongkan semua state
      setFormData({
        nama: '', telepon: '', alamat: '', sekolah: '',
        provinsi: '', kota: '', kecamatan: '', kelurahan: ''
      });
      // Kosongkan juga pilihan wilayah di dropdown agar tidak menggantung
      setRegions(prev => ({ ...prev, city: [], dist: [], village: [] }));

    } catch (error) {
      alert('Terjadi kesalahan koneksi.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = "w-full px-4 py-2.5 bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-[#00c0ff]/30 focus:border-[#00c0ff] outline-none transition-all duration-200 text-slate-700 shadow-sm sm:text-sm";
  const labelStyle = "flex items-center gap-2 text-sm font-semibold text-slate-700 mb-1.5";

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8 flex justify-center items-center font-sans">
      <div className="w-full max-w-3xl">
        <form onSubmit={handleSubmit} className="bg-white p-6 md:p-10 rounded-md shadow-xl border border-slate-200">

          <div className="mb-8 border-b border-slate-100 pb-6 text-center md:text-left">
            <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tight">
              Presensi Kehadiran
            </h2>
            <p className="mt-1 text-slate-500 text-sm">Lengkapi identitas dan lokasi anda secara akurat.</p>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelStyle}><User size={16} className="text-[#00c0ff]" /> Nama Lengkap</label>
                <input type="text" placeholder="Nama lengkap..." className={inputStyle}
                  value={formData.nama} // Ditambahkan value agar bisa di-reset
                  onChange={e => setFormData({ ...formData, nama: e.target.value })} required />
              </div>
              <div>
                <label className={labelStyle}><Phone size={16} className="text-[#00c0ff]" /> Nomor Telepon</label>
                <input type="tel" placeholder="0812..." className={inputStyle}
                  value={formData.telepon} // Ditambahkan value
                  onChange={e => setFormData({ ...formData, telepon: e.target.value })} required />
              </div>
            </div>

            <div>
              <label className={labelStyle}><School size={16} className="text-[#00c0ff]" /> Asal Sekolah / Instansi</label>
              <input type="text" placeholder="Contoh: SMA Negeri 1..." className={inputStyle}
                value={formData.sekolah} // Ditambahkan value
                onChange={e => setFormData({ ...formData, sekolah: e.target.value })} required />
            </div>

            <div className="pt-4 border-t border-slate-100">
              <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
                <Navigation size={14} /> Detail Lokasi
              </h3>

              <div className="grid grid-cols-1 gap-5">
                <div>
                  <label className={labelStyle}><MapPin size={16} className="text-[#00c0ff]" /> Alamat Lengkap</label>
                  <textarea className={`${inputStyle} h-20 resize-none`} placeholder="Nama jalan, nomor rumah, RT/RW..."
                    value={formData.alamat} // Ditambahkan value
                    onChange={e => setFormData({ ...formData, alamat: e.target.value })} required />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelStyle}>Provinsi</label>
                    <select className={inputStyle} value={formData.provinsi} required onChange={e => {
                      const selected = regions.prov.find(p => p.name === e.target.value);
                      if (selected) handleProvChange(selected.id, selected.name);
                    }}>
                      <option value="">Pilih Provinsi</option>
                      {regions.prov.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className={labelStyle}>Kota / Kabupaten</label>
                    <select className={inputStyle} value={formData.kota} required disabled={!formData.provinsi}
                      onChange={e => {
                        const selected = regions.city.find(c => c.name === e.target.value);
                        if (selected) handleCityChange(selected.id, selected.name);
                      }}>
                      <option value="">Pilih Kota</option>
                      {regions.city.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className={labelStyle}>Kecamatan</label>
                    <select className={inputStyle} value={formData.kecamatan} required disabled={!formData.kota}
                      onChange={e => {
                        const selected = regions.dist.find(d => d.name === e.target.value);
                        if (selected) handleDistChange(selected.id, selected.name);
                      }}>
                      <option value="">Pilih Kecamatan</option>
                      {regions.dist.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className={labelStyle}>Kelurahan / Desa</label>
                    <select className={inputStyle} value={formData.kelurahan} required disabled={!formData.kecamatan}
                      onChange={e => setFormData({ ...formData, kelurahan: e.target.value })}>
                      <option value="">Pilih Kelurahan</option>
                      {regions.village.map(v => <option key={v.id} value={v.name}>{v.name}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full mt-8 bg-[#00c0ff] text-white py-3 rounded-md font-bold text-base shadow-md hover:brightness-105 active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2">
            {loading ? <Loader2 className="animate-spin" size={20} /> : <><Send size={18} /> KIRIM DATA</>}
          </button>
        </form>

        {/* Modal Sukses */}
        {showSuccess && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-md shadow-2xl max-w-sm w-full p-8 text-center border-t-4 border-[#00c0ff]">
              <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-cyan-50 mb-6">
                <div className="h-16 w-16 rounded-full bg-[#00c0ff] flex items-center justify-center shadow-lg shadow-[#00c0ff]/40 text-white">
                   <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-black text-slate-800 mb-2 uppercase">Berhasil!</h3>
              <p className="text-slate-500 mb-8">Data absensi Anda telah kami terima.</p>
              <button onClick={() => setShowSuccess(false)} className="w-full bg-slate-800 text-white py-3 rounded-md font-bold hover:bg-slate-700 active:scale-95 transition-all">
                TUTUP
              </button>
            </div>
          </div>
        )}

        <p className="text-center mt-6 text-slate-400 text-xs tracking-wide uppercase">© 2024 Sistem Absensi Digital</p>
      </div>
    </div>
  );
};

export default AbsensiForm;