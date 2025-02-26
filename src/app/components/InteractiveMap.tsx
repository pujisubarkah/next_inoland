import { useState, useEffect } from "react";
import './InteractiveMap.css';
import { supabase } from '../supabaseClient';

function InteractiveMap() {
  const [provinces, setProvinces] = useState([]);
  const [kabupaten, setKabupaten] = useState([]);
  const [selectedProvinsi, setSelectedProvinsi] = useState(null);
  const [selectedKabkot, setSelectedKabkot] = useState(null);
  const [hoveredArea, setHoveredArea] = useState({ visible: false, text: '', x: 0, y: 0 });
  const [inovasiKabupaten, setInovasiKabupaten] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const { data: provincesData, error: provincesError } = await supabase
          .from('provinsis')
          .select('*');

        if (provincesError) throw provincesError;

        const provinceIds = provincesData.map(prov => prov.id_provinsi).filter(id => id);
        const { data: provinsiData, error: provinsiError } = await supabase
          .from('provinsi')
          .select('id_provinsi, jumlah_inovasi')
          .in('id_provinsi', provinceIds);

        if (provinsiError) throw provinsiError;

        const combinedData = provincesData.map(prov => ({
          ...prov,
          jumlah_inovasi: provinsiData.find(p => p.id_provinsi === prov.id_provinsi)?.jumlah_inovasi || 0,
        }));

        setProvinces(combinedData);
      } catch (err) {
        console.error("Error fetching provinces:", err.message);
        alert(`Failed to fetch provinces: ${err.message}`);
      }
    };

    fetchProvinces();
  }, []);

  const getChoroplethColor = (jumlah_inovasi) => {
    if (jumlah_inovasi > 200) return '#800026'; // dark red
    if (jumlah_inovasi > 150) return '#BD0026';
    if (jumlah_inovasi > 100) return '#E31A1C';
    if (jumlah_inovasi > 50) return '#FC4E2A';
    if (jumlah_inovasi > 0) return '#FD8D3C';
    return '#FFEDA0'; // lightest color for no innovation
  
  };

  const loadKabupaten = async (id_provinsi) => {
    try {
      const { data: kabupatenData, error: kabupatenError } = await supabase
        .from('kabupaten_maps')
        .select(`id_kabkot, id_provinsi, nama, svg_path`)
        .eq('id_provinsi', id_provinsi);

      if (kabupatenError) throw kabupatenError;

      console.log('kabupatenData:', kabupatenData);

      const kabupatenIds = kabupatenData.map(kab => kab.id_kabkot);
      const { data: kabkotData, error: kabkotError } = await supabase
        .from('kabkot') // Using views table 'kabkot'
        .select('id_kabkot, jumlah_inovasi')
        .in('id_kabkot', kabupatenIds);

      if (kabkotError) throw kabkotError;

      const { data: inovasiData, error:inovasiError } = await supabase
      .from('inolands')
      .select('*')
      .eq('id_provinsi', id_provinsi);

      if (inovasiError) {
        console.error("Error fetching inovasi:", inovasiError);
      } else {
        setInovasiKabupaten(inovasiData);
      }

      console.log('kabupatenData:', kabupatenData);

      const combinedKabupaten = kabupatenData.map(kab => ({
        ...kab,
        jumlah_inovasi: kabkotData.find(k => k.id_kabkot === kab.id_kabkot)?.jumlah_inovasi || 0,
      }));

      setKabupaten(combinedKabupaten);
      setSelectedProvinsi(id_provinsi);
    } catch (err) {
      console.error("Error fetching kabupaten or inovasi:", err.message);
    }
  };

  const loadInovasi = async (id_kabkot) => {
    const { data: inovasiData, error } = await supabase
      .from('inolands')
      .select('*')
      .eq('id_kabkot', id_kabkot);

    if (error) {
      console.error("Error fetching inovasi:", error);
    } else {
      setInovasiKabupaten(inovasiData);
      setSelectedKabkot(id_kabkot);
      setCurrentPage(1);
    }
  };

  const handleMouseEnter = (event, text) => {
    const x = 750; // Adjust this value based on your box width and desired margin
    const y = 20; // Adjust this value based on your desired margin from the top

    setHoveredArea({ visible: true, text, x, y });
  };

  const handleMouseLeave = () => {
    setHoveredArea({ ...hoveredArea, visible: false });
  };

  const totalPages = Math.ceil(inovasiKabupaten.length / itemsPerPage);
  const currentInovasi = inovasiKabupaten.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };


  const [expandedIds, setExpandedIds] = useState([]); // State untuk menyimpan ID yang diperluas

  const maxLength = 50; // Batas karakter untuk teks terpotong

  // Fungsi untuk memotong teks jika lebih panjang dari maxLength
  const truncateText = (text, id) => {
    if (!text) return 'Tidak ada deskripsi'; // Jika deskripsi null atau undefined
    if (text.length > maxLength && !expandedIds.includes(id)) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  };

  // Fungsi untuk toggle tampilan deskripsi
  const toggleExpand = (id) => {
    if (expandedIds.includes(id)) {
      setExpandedIds(expandedIds.filter((itemId) => itemId !== id)); // Hapus ID jika sudah diperluas
    } else {
      setExpandedIds([...expandedIds, id]); // Tambahkan ID ke daftar expanded
    }
  };

  
  return (
 <div className="app">
   

    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    
      {/* Peta Provinsi */}
      <div style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px', width: '100%', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <h1 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 'bold', fontSize: '2rem', textAlign: 'center', margin: '20px 0 10px 0' }}>
      SEBARAN LABORATORIUM INOVASI
    </h1>
    <hr style={{ width: '100px', border: 'none', height: '2px', background: 'linear-gradient(to right, red, black, red)', margin: '0 auto 20px auto' }} />
    
       <svg baseProfile="tiny" viewBox="0 0 981.98602 441.06508" width="100%" height="auto" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="grad-red" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#ff0000', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#ffcccc', stopOpacity: 1 }} />
            </linearGradient>
            <linearGradient id="grad-orange" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#ff9900', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#ffe5b5', stopOpacity: 1 }} />
            </linearGradient>
            <linearGradient id="grad-green" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#00ff00', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#ccffcc', stopOpacity: 1 }} />
            </linearGradient>
          </defs>

          {provinces.map((province) => (
            <path
              key={province.id_provinsi}
              d={province.svg_path ? province.svg_path.replace(/"/g, '') : ''}
              fill={getChoroplethColor(province.jumlah_inovasi || 0)}
              stroke="black"
              strokeWidth="0.5"
              onClick={() => loadKabupaten(province.id_provinsi)}
              onMouseEnter={(event) => handleMouseEnter(event, `${province.nama || ''}  ${province.jumlah_inovasi} inovasi`)}
              onMouseLeave={handleMouseLeave}
            ><title>{province.nama}</title></path>
          ))}

          {hoveredArea.visible && (
            <foreignObject x={hoveredArea.x} y={hoveredArea.y} width="200" height="75">
              <div style={{ background: 'white', border: 'solid #ccc', borderRadius: '5px', padding: '5px' }}>
                <strong>{hoveredArea.text.split('  ')[0]}</strong>
                <br />
                {hoveredArea.text.split('  ')[1]}
                <br/>
              </div>
            </foreignObject>
          )}
        </svg>
      </div>
      
      {selectedProvinsi !== null && (
  <div
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 999,
    }}
  >
    {/* Popup Box */}
    <div
      style={{
        backgroundColor: '#fff',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        width: '80vw',
        maxWidth: '1000px',
        padding: '20px',
        position: 'relative',
        animation: 'fadeIn 0.3s ease-in-out',
      }}
    >
      {/* Close Button */}
      <button
        onClick={() => setSelectedProvinsi(null)} // Menutup popup
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: 'transparent',
          border: 'none',
          fontSize: '20px',
          cursor: 'pointer',
        }}
      >
        ✖
      </button>

      {/* Judul */}
      <h1
        style={{
          fontFamily: 'Poppins, sans-serif',
          fontWeight: 'bold',
          fontSize: '2rem',
          textAlign: 'center',
          marginBottom: '20px',
        }}
      >
        Daftar Inovasi di {provinces.find((prov) => prov.id_provinsi === selectedProvinsi)?.nama}
      </h1>
      <hr
        style={{
          width: '100px',
          border: 'none',
          height: '2px',
          background: 'linear-gradient(to right, red, black, red)',
          margin: '0 auto 20px auto',
        }}
      />

      {/* Konten Popup */}
      <div style={{ display: 'flex', gap: '20px' }}>
        
        {/* Peta Kabupaten */}
        <svg
          className="map-kabupaten"
          baseProfile="tiny"
          viewBox="0 0 800 600"
          width="42%"
          height="auto"
          preserveAspectRatio="xMidYMid meet"
          style={{
            border: '1px solid #ccc',
            borderRadius: '10px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          }}
        >
          {kabupaten.map((kab) =>
            kab.svg_path ? (
              <path
                key={kab.id_kabkot}
                d={kab.svg_path.replace(/"/g, '')}
                fill={getChoroplethColor(kab.jumlah_inovasi || 0)}
                stroke="black"
                strokeWidth="1"
                onClick={() => loadInovasi(kab.id_kabkot)}
              >
                <title>{kab.nama}</title>
              </path>
            ) : null
          )}
        </svg>
        

        {/* Tabel Daftar Inovasi */}
        <div style={{ flexGrow: 1 }}>
        {selectedProvinsi && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                      <div style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', width: '48%', textAlign: 'center' }}>
                        <strong>{provinces.find(prov => prov.id_provinsi === selectedProvinsi)?.nama}</strong>
                        <br />
                        {provinces.find(prov => prov.id_provinsi === selectedProvinsi)?.jumlah_inovasi} inovasi
                      </div>
                      {(kabupaten.length > 0 && (
                        <div style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', width: '48%', textAlign: 'center' }}>
                          <strong>{kabupaten.find(kab => kab.id_kabkot === inovasiKabupaten[0]?.id_kabkot)?.nama}</strong>
                          <br />
                          {inovasiKabupaten.length > 0 ? kabupaten.find(kab => kab.id_kabkot === inovasiKabupaten[0]?.id_kabkot)?.jumlah_inovasi : 'NA'} inovasi
                        </div>
                      )) || (kabupaten.length === 0 && <div style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', width: '45%', textAlign: 'center' }}>
                      <strong>{kabupaten.find(kab => kab.id_kabkot === selectedKabkot)?.nama}</strong>
                      <br />
                      NA
                    </div>)}
                    </div>
                  )}
          {currentInovasi.length > 0 ? (
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                margin: '20px 0',
                fontSize: '0.8rem',
              }}
            >
              <thead>
                <tr
                  style={{
                    backgroundColor: '#444',
                    color: 'white',
                    textAlign: 'left',
                  }}
                >
                  <th style={{ padding: '15px', borderBottom: '1px solid #ddd' }}>
                    Judul Inovasi
                  </th>
                  <th style={{ padding: '15px', borderBottom: '1px solid #ddd' }}>
                    Tahun
                  </th>
                  <th style={{ padding: '15px', borderBottom: '1px solid #ddd' }}>
                    Inovator
                  </th>
                  <th style={{ padding: '15px', borderBottom: '1px solid #ddd' }}>
                    Deskripsi
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentInovasi.map((inovasi) => (
                  <tr
                    key={inovasi.id}
                    style={{
                      backgroundColor: '#fff',
                      borderBottom: '1px solid #ddd',
                    }}
                  >
                    <td style={{ padding: '15px' }}>{inovasi.judul_inovasi}</td>
                    <td style={{ padding: '15px' }}>{inovasi.tahun}</td>
                    <td style={{ padding: '15px' }}>{inovasi.inovator}</td>
                    <td style={{ padding: '15px' }}>
              {/* Tampilkan deskripsi dengan logika pemotongan */}
              <span>{truncateText(inovasi.deskripsi, inovasi.id)}</span>
              {/* Tombol [More] hanya ditampilkan jika teks lebih panjang dari maxLength */}
              {inovasi.deskripsi && inovasi.deskripsi.length > maxLength && (
                <button
                  onClick={() => toggleExpand(inovasi.id)} // Toggle state expanded
                  style={{
                    marginLeft: '5px',
                    color: 'blue',
                    cursor: 'pointer',
                    border: 'none',
                    background: 'transparent',
                    textDecoration: 'underline',
                  }}
                >
                  {expandedIds.includes(inovasi.id) ? '[Less]' : '[More]'}
                </button>
              )}
            </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Kabupaten ini tidak memiliki inovasi.</p>
          )}

{totalPages > 1 && (
                        <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'center' }}>
                            {currentPage > 1 && (
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    style={{
                                        padding: '5px 10px',
                                        margin: '0 5px',
                                        border: 'none',
                                        borderRadius: '3px',
                                        backgroundColor: '#f9f9f9',
                                        color: '#000',
                                        cursor: 'pointer',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                    }}
                                >
                                    Prev
                                </button>
                            )}
                            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                const pageNumber = currentPage > 3 ? currentPage - 2 + i : i + 1;
                                return (
                                    <button
                                        key={pageNumber}
                                        onClick={() => handlePageChange(pageNumber)}
                                        style={{
                                            padding: '5px 10px',
                                            margin: '0 5px',
                                            border: 'none',
                                            borderRadius: '3px',
                                            backgroundColor: currentPage === pageNumber ? '#444' : '#f9f9f9',
                                            color: currentPage === pageNumber ? '#fff' : '#000',
                                            cursor: 'pointer',
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                        }}
                                    >
                                        {pageNumber}
                                    </button>
                                );
                            })}
                            {currentPage < totalPages && (
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    style={{
                                        padding: '5px 10px',
                                        margin: '0 5px',
                                        border: 'none',
                                        borderRadius: '3px',
                                        backgroundColor: '#f9f9f9',
                                        color: '#000',
                                        cursor: 'pointer',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                    }}
                                >
                                    Next
                                </button>
                            )}
                        </div>
                    )}
        </div>
      </div>
    </div>
  </div>
)}
      <div className="legend" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', padding: '10px', borderRadius: '5px', backgroundColor: '#f9f9f9', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginTop: '20px', width: '50%', justifyContent: 'center' }}>
        <h3 style={{ marginRight: '20px' }}>LEGENDA</h3>
        <div className="legend-item" style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}>
          <div className="legend-color" style={{ backgroundColor: '#FFEDA0', width: '20px', height: '20px', borderRadius: '3px', marginRight: '5px' }}></div>
          <span>0</span>
        </div>
        <div className="legend-item" style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}>
          <div className="legend-color" style={{ backgroundColor: '#FD8D3C', width: '20px', height: '20px', borderRadius: '3px', marginRight: '5px' }}></div>
          <span>1-50</span>
        </div>
        <div className="legend-item" style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}>
          <div className="legend-color" style={{ backgroundColor: '#FC4E2A', width: '20px', height: '20px', borderRadius: '3px', marginRight: '5px' }}></div>
          <span>51-100</span>
        </div>
        <div className="legend-item" style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}>
          <div className="legend-color" style={{ backgroundColor: '#E31A1C', width: '20px', height: '20px', borderRadius: '3px', marginRight: '5px' }}></div>
          <span>101-150</span>
        </div>
        <div className="legend-item" style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}>
          <div className="legend-color" style={{ backgroundColor: '#BD0026', width: '20px', height: '20px', borderRadius: '3px', marginRight: '5px' }}></div>
          <span>151-200</span>
        </div>
        <div className="legend-item" style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}>
          <div className="legend-color" style={{ backgroundColor: '#800026', width: '20px', height: '20px', borderRadius: '3px', marginRight: '5px' }}></div>
          <span>200+</span>
        </div>
      </div>
    </div>
  </div>
  );
  }


export default InteractiveMap;
