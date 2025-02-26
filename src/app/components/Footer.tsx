import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faMailBulk, faPhone } from '@fortawesome/free-solid-svg-icons';

const Footer = () => {
  return (
    <footer className="bg-transparent p-0">
      <div className="max-w-[1200px] mx-auto">
        {/* Divider */}
        <hr className="border-t-2 bg-[#a3002b] h-px m-0 p-0" />

        {/* Footer Top */}
        <div className="flex flex-wrap justify-between items-center py-6">
          <Image src="/ino.png" alt="INO Logo" width={150} height={100} />
          <Image src="/ino.png" alt="INO Logo" width={150} height={100} />
          <div className="stakeholders">
            <h4 className="text-2xl mb-4">Pemangku Kepentingan INOLAND</h4>
            <div className="flex items-center space-x-5">
              <a href="https://lan.go.id/" target="_blank" rel="noopener noreferrer">
                <Image src="/lanri.png" alt="lanri Logo" width={80} height={80} />
              </a>
              <a href="https://menpan.go.id/" target="_blank" rel="noopener noreferrer">
                <Image src="/panrb.png" alt="panrb Logo" width={80} height={80} />
              </a>
              <a href="https://kemendagri.go.id/" target="_blank" rel="noopener noreferrer">
                <Image src="/kemendagri.png" alt="kemendagri Logo" width={80} height={80} />
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Section 1: Tentang Kami */}
          <div className="footer-section">
            <h4 className="text-2xl font-poppins mb-4"><b>Tentang Kami</b></h4>
            <ul className="list-none p-0">
              <li className="mb-2">
                <a href="https://tuxedovation.inovasi.litbang.kemendagri.go.id/" className="text-gray-800 hover:underline">
                  Kementerian Dalam Negeri
                </a>
              </li>
              <li className="mb-2">
                <a href="https://jippnas.menpan.go.id/" className="text-gray-800 hover:underline">
                  Kementerian PANRB
                </a>
              </li>
              <li className="mb-2">
                <a href="https://inoland.lan.go.id" className="text-gray-800 hover:underline">
                  Lembaga Administrasi Negara
                </a>
              </li>
            </ul>
          </div>

          {/* Section 2: Jelajahi */}
          <div className="footer-section">
            <h4 className="text-2xl font-poppins mb-4"><b>Jelajahi</b></h4>
            <ul className="list-none p-0">
              <li className="mb-2">
                <Link href="/" className="text-gray-800 hover:underline">Beranda</Link>
              </li>
              <li className="mb-2">
                <Link href="/layanan" className="text-gray-800 hover:underline">Layanan Inovasi</Link>
              </li>
              <li className="mb-2">
                <Link href="/cari" className="text-gray-800 hover:underline">Cari Inovasi</Link>
              </li>
              <li className="mb-2">
                <Link href="/referensi" className="text-gray-800 hover:underline">Referensi Inovasi</Link>
              </li>
            </ul>
          </div>

          {/* Section 3: Hubungi Kami */}
          <div className="footer-section">
            <h4 className="text-2xl font-poppins mb-4"><b>Hubungi Kami</b></h4>
            <ul className="list-none p-0">
              <li className="mb-2 flex items-center">
                <FontAwesomeIcon icon={faPhone} className="mr-2" /> (+6221) 3828601 - 89
              </li>
              <li className="mb-2 flex items-center">
                <FontAwesomeIcon icon={faMailBulk} className="mr-2" /> pian@lan.go.id
              </li>
              <li className="mb-2 flex items-center">
                <FontAwesomeIcon icon={faLocationDot} className="mr-2" /> Jl. Veteran No 10 Jakarta Pusat - 10110
              </li>
            </ul>
          </div>

          {/* Section 4: Ikuti Kami */}
          <div className="footer-section">
            <h4 className="text-2xl font-poppins mb-4"><b>Ikuti Kami</b></h4>
            <ul className="list-none p-0">
              <li className="mb-2 flex items-center">
                <a href="https://www.youtube.com/@InovasiLANRI" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2">
                  <Image src="/youtube-icon.png" alt="YouTube Icon" width={30} height={30} />
                  <span>Inovasi LANRI</span>
                </a>
              </li>
              <li className="mb-2 flex items-center">
                <a href="https://www.instagram.com/pian_lanri" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2">
                  <Image src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Instagram_icon.png/1024px-Instagram_icon.png" alt="Instagram Icon" width={30} height={30} />
                  <span>@pian_lanri</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer Copyright */}
      <div className="text-center bg-[darkred] text-[#f7f4f4] text-lg border-2 py-0.5 w-full m-0 font-poppins">
        <p>&copy; 2024 - Pusat Inovasi Administrasi Negara LANRI. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
