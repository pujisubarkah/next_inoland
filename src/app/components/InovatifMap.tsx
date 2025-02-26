import { useState, useEffect } from "react";

import { supabase } from '../supabaseClient';

function InovatifMap() {
  const [provinces, setProvinces] = useState([]);
  const [kabupaten, setKabupaten] = useState([]);
  const [selectedProvinsi, setSelectedProvinsi] = useState(null);
  const [selectedKabkot, setSelectedKabkot] = useState(null);
  const [hoveredArea, setHoveredArea] = useState({ visible: false, text: '', x: 0, y: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [selectedYear, setSelectedYear] = useState(2023); // Default to 2023

  useEffect(() => {
    const fetchProvinces = async () => {
        try {
          const { data: provincesData, error: provincesError } = await supabase
            .from('provinsis')
            .select('*');
  
          if (provincesError) throw provincesError;
  
          const provinceIds = provincesData.map(prov => prov.id_provinsi).filter(id => id);
          const { data: provinsiData, error: provinsiError } = await supabase
            .from('indeks_inovasi')
            .select('id_provinsi, indeks_predikat')
            .eq('indeks_tahun', selectedYear)
            .eq('level','Provinsi')
            .in('id_provinsi', provinceIds);
  
          if (provinsiError) throw provinsiError;
  
          const combinedData = provincesData.map(prov => ({
            ...prov,
            indeks_predikat: provinsiData.find(p => p.id_provinsi === prov.id_provinsi)?.indeks_predikat || 0,
          }));
  
          setProvinces(combinedData);
        } catch (err) {
          console.error("Error fetching provinces:", err.message);
          alert(`Failed to fetch provinces: ${err.message}`);
        }
      };
  
      fetchProvinces();
  }, [selectedYear]); // Runs when selectedYear changes

  // Function to return choropleth color based on the selected year and its value
  const getChoroplethColor = (innovationValue) => {
    if (innovationValue === 'Belum Mengisi Data') return '#708090'; // Red for "No Data"
    if (innovationValue === 'Sangat Inovatif') return '#009688'; // Dark Green
    if (innovationValue === 'Kurang Inovatif') return '#FF9800'; // Red
    if (innovationValue === 'Inovatif') return '#FFEB3B'; // Light Green
    if (innovationValue === 'Tidak Dapat Dinilai') return '#708090'; // Dark Red
    return '#FFEDA0'; // Lightest color for undefined values
  };

  const loadKabupaten = async (id_provinsi) => {
    try {
      const { data: kabupatenData, error: kabupatenError } = await supabase
        .from('kabupaten_maps')
        .select(`id_kabkot, id_provinsi, nama, svg_path`)
        .eq('id_provinsi', id_provinsi);

      if (kabupatenError) throw kabupatenError;

      const kabupatenIds = kabupatenData.map(kab => kab.id_kabkot);
      const { data: kabkotData, error: kabkotError } = await supabase
        .from('indeks_inovasi') // Using views table 'kabkot'
        .select('id_kabkot, indeks_predikat, indeks_skor')
        .eq('indeks_tahun', selectedYear);

      if (kabkotError) throw kabkotError;

      const combinedKabupaten = kabupatenData.map(kab => ({
        ...kab,
        indeks_predikat: kabkotData.find(k => k.id_kabkot === kab.id_kabkot)?.indeks_predikat || 0,
        indeks_skor: kabkotData.find(k => k.id_kabkot === kab.id_kabkot)?.indeks_skor || 0,
      })).sort((a, b) => b.indeks_skor - a.indeks_skor);

      setKabupaten(combinedKabupaten);
      setSelectedProvinsi(id_provinsi);
    } catch (err) {
      console.error("Error fetching kabupaten or inovasi:", err.message);
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

  // Function to handle year button click
  const handleYearClick = (year) => {
    setSelectedYear(year);
  };

  const totalPages = Math.ceil(kabupaten.length / itemsPerPage);
  const currentInovasi = kabupaten.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="app">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        

        {/* Peta Provinsi */}
        <div style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px', width: '100%', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h1 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 'bold', fontSize: '2rem', textAlign: 'center', margin: '20px 0 10px 0' }}>
            PETA INDEKS INOVASI DAERAH
          </h1>
          <hr style={{ width: '100px', border: 'none', height: '2px', background: 'linear-gradient(to right, red, black, red)', margin: '0 auto 20px auto' }} />
         {/* Year Buttons */}
<div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
  {[2019, 2020, 2021, 2022, 2023].map((year) => (
    <button
      key={year}
      onClick={() => handleYearClick(year)}
      style={{
        padding: '10px',
        margin: '0 5px',
        backgroundColor: selectedYear === year ? '#8B0000' : '#333',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
      }}
    >
      {year} {/* Show the year part */}
    </button>
  ))}
</div>

          <svg baseProfile="tiny" viewBox="0 0 981.98602 441.06508" width="100%" height="auto" preserveAspectRatio="xMidYMid meet">
            {provinces.map((province) => {
              const innovationValue = province['indeks_predikat'] || 'Belum Mengisi Data'; // Get innovation value based on selected year
              return (
                <path
                  key={province.id_provinsi}
                  d={province.svg_path ? province.svg_path.replace(/"/g, '') : ''}
                  fill={getChoroplethColor(innovationValue)}
                  stroke="black"
                  strokeWidth="0.5"
                  onClick={() => loadKabupaten(province.id_provinsi)}
                  onMouseEnter={(event) => handleMouseEnter(event, `${province.nama || ''}  ${innovationValue}`)}
                  onMouseLeave={handleMouseLeave}
                >
                  <title>{province.nama}</title>
                </path>
              );
            })}
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
        Indeks Inovasi Daerah <br/> PROVINSI {provinces.find((prov) => prov.id_provinsi === selectedProvinsi)?.nama}
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
      <div style={{ display: 'flex', gap: '10px' }}>
        
        {/* Peta Kabupaten */}
        <svg
          width="42%"
          preserveAspectRatio="xMidYMid meet"
          className="map-kabupaten"
          baseProfile="tiny"
          viewBox="0 0 800 600"
          style={{border: '1px solid #ccc',
            borderRadius: '10px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',}}
        >
          {kabupaten.map((kab) =>
            kab.svg_path ? (
              <path
                key={kab.id_kabkot}
                d={kab.svg_path.replace(/"/g, '')}
                fill={getChoroplethColor(kab.indeks_predikat || 0)}
                stroke="black"
                strokeWidth="1"
              >
                <title>{kab.nama}</title>
              </path>
            ) : null
          )}
        </svg>

        {/* Tabel Daftar Inovasi */}
        <div style={{ flexGrow: 1 }}>
          {currentInovasi.length > 0 ? (
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                margin: '20px 0',
                fontSize: '1rem',
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
                    Kabupaten/Kota
                  </th>
                  <th style={{ padding: '15px', borderBottom: '1px solid #ddd' }}>
                    Skor IID
                  </th>
                  <th style={{ padding: '15px', borderBottom: '1px solid #ddd' }}>
                    Predikat IID
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
                    <td style={{ padding: '15px' }}>{inovasi.nama}</td>
                    <td style={{ padding: '15px' }}>{inovasi.indeks_skor}</td>
                    <td style={{ padding: '15px' }}>{inovasi.indeks_predikat}</td>
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
{/* Legend */}
<div style={{ marginTop: '30px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ margin: '0 15px', display: 'flex', alignItems: 'center' }}>
            <div style={{ width: '20px', height: '20px', backgroundColor: '#009688', marginRight: '10px' }}></div>
            <span>Sangat Inovatif</span>
          </div>
          <div style={{ margin: '0 15px', display: 'flex', alignItems: 'center' }}>
            <div style={{ width: '20px', height: '20px', backgroundColor: '#FFEB3B', marginRight: '10px' }}></div>
            <span>Inovatif</span>
          </div>
          <div style={{ margin: '0 15px', display: 'flex', alignItems: 'center' }}>
            <div style={{ width: '20px', height: '20px', backgroundColor: '#FF9800', marginRight: '10px' }}></div>
            <span>Kurang Inovatif</span>
          </div>
          <div style={{ margin: '0 15px', display: 'flex', alignItems: 'center' }}>
            <div style={{ width: '20px', height: '20px', backgroundColor: '#708090', marginRight: '10px' }}></div>
            <span>Tidak Ada Data</span>
          </div>
        </div>
      </div>
    </div>
  );
}
    

export default InovatifMap;
