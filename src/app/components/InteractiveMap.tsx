import { useState, useEffect } from "react";

function InteractiveMap() {
  interface Inovasi {
    id: number;
    judul_inovasi: string;
    tahun: number;
    inovator: string;
    deskripsi: string;
    id_kabkot: number;
  }

  interface Province {
    id_provinsi: number;
    nama: string;
    jumlah_inovasi?: number;
    svg_path?: string;
  }

  interface Kabupaten {
    id_kabkot: number;
    nama: string;
    jumlah_inovasi?: number;
    svg_path?: string;
  }

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [kabupaten, setKabupaten] = useState<Kabupaten[]>([]);
  const [selectedProvinsi, setSelectedProvinsi] = useState<number | null>(null);
  const [selectedKabkot, setSelectedKabkot] = useState<number | null>(null);
  const [hoveredArea, setHoveredArea] = useState({ visible: false, text: '', x: 0, y: 0 });
  const [inovasiKabupaten, setInovasiKabupaten] = useState<Inovasi[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [expandedIds, setExpandedIds] = useState<number[]>([]);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const provincesResponse = await fetch('/api/provinsis');
        const provincesData = await provincesResponse.json();

        const provinsiResponse = await fetch('/api/provinsi');
        const provinsiData = await provinsiResponse.json();

        const combinedData = provincesData.map((prov: Province) => ({
          ...prov,
          jumlah_inovasi: provinsiData.find((p: Province) => p.id_provinsi === prov.id_provinsi)?.jumlah_inovasi || 0,
        }));

        setProvinces(combinedData);
      } catch (err) {
        if (err instanceof Error) {
          console.error("Error fetching provinces:", err.message);
          alert(`Failed to fetch provinces: ${err.message}`);
        } else {
          console.error("Error fetching provinces:", err);
          alert("Failed to fetch provinces");
        }
      }
    };

    fetchProvinces();
  }, []);

  const loadKabupaten = async (id_provinsi: number) => {
    try {
      const kabupatenResponse = await fetch(`/api/kabupaten_maps?id_provinsi=${id_provinsi}`);
      const kabupatenData = await kabupatenResponse.json();

      const kabkotResponse = await fetch(`/api/kabkot?id_kabkot=${Array.isArray(kabupatenData) ? kabupatenData.map((kab: Kabupaten) => kab.id_kabkot).join(',') : ''}`);
      const kabkotData = await kabkotResponse.json();

      const combinedKabupaten = kabupatenData.map((kab: Kabupaten) => ({
        ...kab,
        jumlah_inovasi: kabkotData.find((k: Kabupaten) => k.id_kabkot === kab.id_kabkot)?.jumlah_inovasi || 0,
      }));

      setKabupaten(combinedKabupaten);
      setSelectedProvinsi(id_provinsi);
    } catch (err) {
      if (err instanceof Error) {
        console.error("Error fetching kabupaten or inovasi:", err.message);
      } else {
        console.error("Error fetching kabupaten or inovasi:", err);
      }
    }
  };

  const loadInovasi = async (id_kabkot: number) => {
    try {
      const inovasiResponse = await fetch(`/api/inolands?id_kabkot=${id_kabkot}`);
      const inovasiData = await inovasiResponse.json();
      setInovasiKabupaten(inovasiData);
      setSelectedKabkot(id_kabkot);
    } catch (err) {
      if (err instanceof Error) {
        console.error("Error fetching inovasi:", err.message);
      } else {
        console.error("Error fetching inovasi:", err);
      }
    }
  };

  const getChoroplethColor = (jumlah_inovasi: number) => {
    if (jumlah_inovasi > 200) return '#800026'; // dark red
    if (jumlah_inovasi > 150) return '#BD0026';
    if (jumlah_inovasi > 100) return '#E31A1C';
    if (jumlah_inovasi > 50) return '#FC4E2A';
    if (jumlah_inovasi > 0) return '#FD8D3C';
    return '#FFEDA0'; // lightest color for no innovation
  };

  const handleMouseEnter = (event: React.MouseEvent<SVGPathElement>, text: string) => {
    const x = 750; // Adjust this value based on your box width and desired margin
    const y = 20; // Adjust this value based on your desired margin from the top
    setHoveredArea({ visible: true, text, x, y });
  };

  const handleMouseLeave = () => {
    setHoveredArea({ ...hoveredArea, visible: false });
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const maxLength = 50;

  const truncateText = (text: string, id: number) => {
    if (!text) return 'Tidak ada deskripsi';
    if (text.length > maxLength && !expandedIds.includes(id)) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  };

  const toggleExpand = (id: number) => {
    if (expandedIds.includes(id)) {
      setExpandedIds(expandedIds.filter((itemId) => itemId !== id));
    } else {
      setExpandedIds([...expandedIds, id]);
    }
  };

  const totalPages = Math.ceil(inovasiKabupaten.length / itemsPerPage);
  const currentInovasi = inovasiKabupaten.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="app">
      <div className="flex flex-col items-center">
        <div className="border border-gray-300 p-4 rounded-lg w-full shadow-md">
          <h1 className="font-poppins font-bold text-2xl text-center my-5">
            SEBARAN LABORATORIUM INOVASI
          </h1>
          <hr className="w-24 border-none h-2 bg-gradient-to-r from-red-500 to-black mx-auto mb-5" />
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
              >
                <title>{province.nama}</title>
              </path>
            ))}

            {hoveredArea.visible && (
              <foreignObject x={hoveredArea.x} y={hoveredArea.y} width="200" height="75">
                <div className="bg-white border border-gray-300 rounded p-1">
                  <strong>{hoveredArea.text.split('  ')[0]}</strong>
                  <br />
                  {hoveredArea.text.split('  ')[1]}
                  <br />
                </div>
              </foreignObject>
            )}
          </svg>
        </div>

        {selectedProvinsi !== null && (
          <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-2xl p-5 relative animate-fadeIn">
              <button
                onClick={() => setSelectedProvinsi(null)}
                className="absolute top-2 right-2 bg-transparent border-none text-2xl cursor-pointer"
              >
                ✖
              </button>

              <h1 className="font-poppins font-bold text-2xl text-center mb-5">
                Daftar Inovasi di {provinces.find((prov) => prov.id_provinsi === selectedProvinsi)?.nama}
              </h1>
              <hr className="w-24 border-none h-2 bg-gradient-to-r from-red-500 to-black mx-auto mb-5" />

              <div className="flex gap-5">
                <svg
                  className="map-kabupaten border border-gray-300 rounded-lg shadow-md"
                  baseProfile="tiny"
                  viewBox="0 0 800 600"
                  width="42%"
                  height="auto"
                  preserveAspectRatio="xMidYMid meet"
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

                <div className="flex-grow">
                  {selectedProvinsi && (
                    <div className="flex justify-between mb-5">
                      <div className="p-2 border border-gray-300 rounded shadow-md w-1/2 text-center">
                        <strong>{provinces.find(prov => prov.id_provinsi === selectedProvinsi)?.nama}</strong>
                        <br />
                        {provinces.find(prov => prov.id_provinsi === selectedProvinsi)?.jumlah_inovasi} inovasi
                      </div>
                      {(kabupaten.length > 0 && (
                        <div className="p-2 border border-gray-300 rounded shadow-md w-1/2 text-center">
                          <strong>{kabupaten.find(kab => kab.id_kabkot === inovasiKabupaten[0]?.id_kabkot)?.nama}</strong>
                          <br />
                          {inovasiKabupaten.length > 0 ? kabupaten.find(kab => kab.id_kabkot === inovasiKabupaten[0]?.id_kabkot)?.jumlah_inovasi : 'NA'} inovasi
                        </div>
                      )) || (kabupaten.length === 0 && <div className="p-2 border border-gray-300 rounded shadow-md w-1/2 text-center">
                        <strong>{kabupaten.find(kab => kab.id_kabkot === selectedKabkot)?.nama || 'NA'}</strong>
                        <br />
                        NA
                      </div>)}
                    </div>
                  )}
                  {currentInovasi.length > 0 ? (
                    <table className="w-full border-collapse shadow-md mb-5">
                      <thead>
                        <tr className="bg-gray-800 text-white text-left">
                          <th className="p-4 border-b">Judul Inovasi</th>
                          <th className="p-4 border-b">Tahun</th>
                          <th className="p-4 border-b">Inovator</th>
                          <th className="p-4 border-b">Deskripsi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentInovasi.map((inovasi) => (
                          <tr key={inovasi.id} className="bg-white border-b">
                            <td className="p-4">{inovasi.judul_inovasi}</td>
                            <td className="p-4">{inovasi.tahun}</td>
                            <td className="p-4">{inovasi.inovator}</td>
                            <td className="p-4">
                              <span>{truncateText(inovasi.deskripsi, inovasi.id)}</span>
                              {inovasi.deskripsi && inovasi.deskripsi.length > maxLength && (
                                <button
                                  onClick={() => toggleExpand(inovasi.id)}
                                  className="ml-2 text-blue-500 underline"
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
                    <div className="mt-2 flex justify-center">
                      {currentPage > 1 && (
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          className="px-3 py-1 mx-1 border rounded bg-gray-200 hover:bg-gray-300"
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
                            className={`px-3 py-1 mx-1 border rounded ${currentPage === pageNumber ? 'bg-gray-800 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                          >
                            {pageNumber}
                          </button>
                        );
                      })}
                      {currentPage < totalPages && (
                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          className="px-3 py-1 mx-1 border rounded bg-gray-200 hover:bg-gray-300"
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

        <div className="legend flex flex-row items-center p-2 rounded bg-gray-100 shadow-md mt-5 w-1/2 justify-center">
          <h3 className="mr-5">LEGENDA</h3>
          <div className="legend-item flex items-center mr-2">
            <div className="legend-color bg-[#FFEDA0] w-5 h-5 rounded mr-1"></div>
            <span>0</span>
          </div>
          <div className="legend-item flex items-center mr-2">
            <div className="legend-color bg-[#FD8D3C] w-5 h-5 rounded mr-1"></div>
            <span>1-50</span>
          </div>
          <div className="legend-item flex items-center mr-2">
            <div className="legend-color bg-[#FC4E2A] w-5 h-5 rounded mr-1"></div>
            <span>51-100</span>
          </div>
          <div className="legend-item flex items-center mr-2">
            <div className="legend-color bg-[#E31A1C] w-5 h-5 rounded mr-1"></div>
            <span>101-150</span>
          </div>
          <div className="legend-item flex items-center mr-2">
            <div className="legend-color bg-[#BD0026] w-5 h-5 rounded mr-1"></div>
            <span>151-200</span>
          </div>
          <div className="legend-item flex items-center mr-2">
            <div className="legend-color bg-[#800026] w-5 h-5 rounded mr-1"></div>
            <span>200+</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InteractiveMap;
