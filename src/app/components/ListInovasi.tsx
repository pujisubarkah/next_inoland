'use client';

import { useState, useEffect } from "react";
import Image from 'next/image';

function InteractiveMap() {
    interface Inovasi {
        id: number;
        judul_inovasi: string;
        sdgs?: {
            image: string;
            sdgs: string;
        };
        tahun: number;
        kld: string;
        inovator: string;
        deskripsi: string;
    }

    const [inovasiData, setInovasiData] = useState<Inovasi[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [itemsPerPage] = useState(5);

    useEffect(() => {
        loadInovasi();
    }, []);

    const loadInovasi = async () => {
        try {
            const response = await fetch('/api/inolands');
            const data = await response.json();
            setInovasiData(data);
            setCurrentPage(1);
        } catch (error) {
            console.error("Error fetching inovasi:", error);
        }
    };

    const filteredInovasi = inovasiData.filter((inovasi) => {
        if (searchTerm === '') {
            return inovasi;
        } else {
            return (
                inovasi.judul_inovasi.toLowerCase().includes(searchTerm.toLowerCase()) ||
                inovasi.tahun.toString().includes(searchTerm.toLowerCase()) ||
                inovasi.kld.toLowerCase().includes(searchTerm.toLowerCase()) ||
                inovasi.inovator.toLowerCase().includes(searchTerm.toLowerCase()) ||
                inovasi.deskripsi.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
    });

    const currentInovasi = filteredInovasi.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="flex-4 h-full px-4 overflow-auto">
            <div className="text-center mb-10">
                <h3 className="text-lg font-bold font-poppins">TEMUKAN INOVASI</h3>
            </div>
            <hr className="my-4 border-gray-300" />
            <input
                type="text"
                placeholder="Cari Ide Inovasi/Pemda/Inovator"
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md mb-4"
            />
            {currentInovasi.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="w-full border border-[#3781c7] rounded-lg overflow-hidden my-5">
                        <thead>
                            <tr className="bg-[#3781c7] text-white">
                                <th className="p-3 border border-[#f2bd1d] text-left font-bold uppercase text-sm">Judul Inovasi</th>
                                <th className="p-3 border border-[#f2bd1d] text-left font-bold uppercase text-sm">SDGS</th>
                                <th className="p-3 border border-[#f2bd1d] text-left font-bold uppercase text-sm">Tahun</th>
                                <th className="p-3 border border-[#f2bd1d] text-left font-bold uppercase text-sm">Pemda</th>
                                <th className="p-3 border border-[#f2bd1d] text-left font-bold uppercase text-sm">Inovator</th>
                                <th className="p-3 border border-[#f2bd1d] text-left font-bold uppercase text-sm">Deskripsi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentInovasi.map((inovasi, index) => (
                                <tr key={inovasi.id} className={index % 2 === 0 ? "bg-[#87ceeb]" : "bg-white"}>
                                    <td className="px-4 py-2 border border-[#f2bd1d]">{inovasi.judul_inovasi}</td>
                                    <td className="px-4 py-2 border border-[#f2bd1d]">
                                        <Image width={75} height={75} src={inovasi.sdgs?.image || '/default-image.png'} alt="SDGS" />
                                        <div>{inovasi.sdgs?.sdgs || 'N/A'}</div>
                                    </td>
                                    <td className="px-4 py-2 border border-[#f2bd1d]">{inovasi.tahun}</td>
                                    <td className="px-4 py-2 border border-[#f2bd1d]">{inovasi.kld}</td>
                                    <td className="px-4 py-2 border border-[#f2bd1d]">{inovasi.inovator}</td>
                                    <td className="px-4 py-2 border border-[#f2bd1d]">{inovasi.deskripsi}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="no-results">Tidak ada inovasi yang ditemukan.</p>
            )}
        </div>
    );
}

export default InteractiveMap;
