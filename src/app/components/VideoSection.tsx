import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf'; 
import './VideoSection.css'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronLeft, faBook, faStar } from '@fortawesome/free-solid-svg-icons';

const VideoSection = () => {
  const videos = [
    {
      id: 1,
      title: "LABORATORIUM INOVASI",
      views: 169,
      src: "https://youtube.com/embed/n9JVaNiQ8Rg",
      description: "Laboratorium Inovasi merupakan salah satu terobosan Lembaga Administrasi Negara (LAN) dalam mendorong Reformasi Birokrasi di tingkat daerah. Hal ini sejalan dengan pesan Presiden RI Joko Widodo yang meminta seluruh elemen pemerintah untuk bekerja tidak menggunakan cara-cara biasa namun menggagas terobosan baru untuk mempercepat pelayanan kepada masyarakat.",
      quiz: {
        question: "Apa tujuan utama dari Laboratorium Inovasi yang digagas oleh LAN?",
        options: ["Meningkatkan anggaran pemerintah daerah",
           "Mendorong Reformasi Birokrasi di tingkat daerah",
           "Mengadakan pelatihan bagi pegawai pemerintah",
           "Menambah jumlah pegawai pemerintah daerah"],
        correctAnswer: "Mendorong Reformasi Birokrasi di tingkat daerah",
      },
    },
    {
      id: 2,
      title: "DRUMP UP",
      views: 169,
      src: "https://youtube.com/embed/gJ0jAmLssjc",
      description: "Tahap Drum Up adalah tahap membangun kesadaran dan keinginan untuk berinovasi. Tahapan Drum Up bertujuan untuk menginspirasi dan mengembangkan semangat inovasi peserta Labinov baik secara individu mapun kolektif. Dengan demikian, willingness to innovate atau kemauan berinovasi akan terbentuk yang merupakan modal awal untuk melanjutkan ke tahap-tahap Labinov berikutnya.",
      quiz: {
        question: "Apa tujuan dari Tahap Drum Up dalam Laboratorium Inovasi?",
        options: ["Menyusun rencana aksi inovasi",
          "Mengidentifikasi kesenjangan layanan publik",
          "Membangun kesadaran dan keinginan untuk berinovasi",
          "Melakukan monitoring inovasi yang sudah diterapkan"],
        correctAnswer: "Membangun kesadaran dan keinginan untuk berinovasi",
      },
    },
    {
      id: 3,
      title: "DIAGNOSE",
      views: 169,
      src: ["https://youtube.com/embed/QExvuVbnMwM",
        "https://youtube.com/embed/2LNeEwhr0tQ",
        "https://youtube.com/embed/lqAaNZ2oMFw"],
      description: "Tahap Diagnose adalah tahap proses mengidentifikasi kesenjangan antara kondisi saat ini dan kondisi yang seharusnya/diharapkan terjadi, yang hal tersebut dapat dijadikan sebagai pijakan untuk adanya inovasi. Tahap Diagnose ini bertujuan untuk memfasilitasi peserta untuk menemukan ide inovasi, yaitu gagasan-gagasan yang mengandung unsur kebaruan, serta diharapkan akan dapat meningkatkan kinerja organisasinya.",
      quiz: {
        question: "Apa yang menjadi fokus utama dalam Tahap Diagnose?",
        options: ["Mencari pendanaan untuk inovasi",
          "Mengidentifikasi kesenjangan antara kondisi saat ini dan kondisi yang diharapkan",
          "Menyusun jadwal pelaksanaan inovasi",
          "Menyebarluaskan hasil inovasi"],
        correctAnswer: "Mengidentifikasi kesenjangan antara kondisi saat ini dan kondisi yang diharapkan",
      },
    },
    {
      id: 4,
      title: "DESAIN",
      views: 169,
      src: "https://youtube.com/embed/rei_mhPsCm0",
      description: "Tahap Design merupakan penuangan ide inovasi yang telah dihasilkan pada Tahap Diagnose ke dalam suatu rancangan rencana aksi yang teknis dan detail. Tahap Design inovasi sangat penting karena akan mendetailkan langkah-langkah mewujudkan ide inovasi yang sudah digagas.",
      quiz: {
        question: "Apa yang dihasilkan pada Tahap Design dalam Laboratorium Inovasi?",
        options: ["Ide inovasi baru",
           "Penyebarluasan hasil inovasi",
           "Rancangan rencana aksi yang teknis dan detail",
           "Kesadaran untuk berinovasi"],
        correctAnswer: "Rancangan rencana aksi yang teknis dan detail",
      },
    },
    {
      id: 5,
      title: "DELIVER",
      views: 169,
      src: ["https://youtube.com/embed/1EA5t8j4YhY","https://youtube.com/embed/_wMeuWXedLI"],
      description: "Tahap Deliver atau tahap pelaksanaan inovasi merupakan tahap dimana peserta Labinov mulai melaksanakan ide inovasi yang dihasilkan pada tahap Diagnose berdasarkan jadwal atau agenda Rencana Aksi Inovasi yang telah disusun pada tahap Design. Pada Tahap Deliver terdapat 2 (dua) kegiatan utama, yaitu Launching Inovasi dan Monitoring Inovasi.",
      quiz: {
        question: "Apa saja kegiatan utama yang dilakukan pada Tahap Deliver?",
        options: ["Drum Up dan Diagnose",
          "Penyusunan rencana dan identifikasi ide",
          "Launching Inovasi dan Monitoring Inovasi",
          "Penilaian hasil inovasi"],
        correctAnswer: "Launching Inovasi dan Monitoring Inovasi",
      },
    },
   {
      id: 6,
      title: "DISPLAY",
      views: 250,
      src: "https://youtube.com/embed/KArqARoQI5w",
      description: "Display Inovasi yaitu kegiatan penyebarluasan hasil pelaksanaan atau implementasi inovasi yang telah diperjanjikan oleh Pimpinan Tertinggi Instansi Pemerintah dan Pimpinan Unit Organisasi instansi pemerintah yang didampingi. Hal ini merupakan salah satu bentuk akuntabilitas pemerintah kepada masyarakat dalam meningkatkan kinerja pemberian layanan pada masyarakat.",
      quiz: {
        question: "Apa tujuan utama dari Display Inovasi dalam Laboratorium Inovasi?",
        options: [
          "Memperkenalkan inovasi kepada pimpinan",
          "Meminta masukan dari masyarakat",
          "Menyebarluaskan hasil implementasi inovasi kepada masyarakat sebagai bentuk akuntabilitas",
          "Mengidentifikasi ide-ide baru untuk inovasi lanjutan"
        ],
        correctAnswer: "Menyebarluaskan hasil implementasi inovasi kepada masyarakat sebagai bentuk akuntabilitas",
      },
    },
  ];

  const Quiz = ({ quiz, onQuizComplete }) => {
    const [selectedOption, setSelectedOption] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleOptionChange = (event) => {
      setSelectedOption(event.target.value);
    };

    const handleSubmit = (event) => {
      event.preventDefault();
      setIsSubmitted(true);
      if (selectedOption === quiz.correctAnswer) {
        onQuizComplete();
      }
    };

    return (
      <div className="quiz-section p-4 bg-gray-100 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">{quiz.question}</h3>
      <form onSubmit={handleSubmit}>
        {quiz.options.map((option, index) => (
        <div key={index} className="mb-2">
          <label className="flex items-center">
          <input
            type="radio"
            value={option}
            checked={selectedOption === option}
            onChange={handleOptionChange}
            className="mr-2"
          />
          <span className="text-gray-700">{option}</span>
          </label>
        </div>
        ))}
        <button 
        type="submit" 
        disabled={!selectedOption} 
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
        >
        Kirim
        </button>
      </form>
      {isSubmitted && (
        <div className="quiz-result mt-4 p-3 rounded-lg" style={{ backgroundColor: selectedOption === quiz.correctAnswer ? '#d4edda' : '#f8d7da' }}>
        {selectedOption === quiz.correctAnswer ? (
          <p className="text-green-800">Jawaban Anda Benar!</p>
        ) : (
          <p className="text-red-800">Jawaban Anda Salah. Jawaban yang benar adalah: {quiz.correctAnswer}</p>
        )}
        </div>
      )}
      </div>
    );
  };

  const [selectedVideo, setSelectedVideo] = useState(videos[0]);
  const [completedQuizzes, setCompletedQuizzes] = useState(new Array(videos.length).fill(false));
  const [allQuizzesCompleted, setAllQuizzesCompleted] = useState(false);
  const [userName, setUserName] = useState('');

  // Load progress from localStorage
  useEffect(() => {
    const savedProgress = JSON.parse(localStorage.getItem('quizProgress'));
    if (savedProgress) {
      setCompletedQuizzes(savedProgress);
    }
  }, []);

  // Save progress to localStorage
  useEffect(() => {
    localStorage.setItem('quizProgress', JSON.stringify(completedQuizzes));
    if (completedQuizzes.every(completed => completed)) {
      setAllQuizzesCompleted(true);
    }
  }, [completedQuizzes]);

  const handleQuizComplete = (videoIndex) => {
    const newCompletedQuizzes = [...completedQuizzes];
    newCompletedQuizzes[videoIndex] = true;
    setCompletedQuizzes(newCompletedQuizzes);
  };

  const handleDownloadCertificate = () => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [600, 400], // Adjust the certificate size
    });

    const img = new Image();
    img.src = '/certificate_template.png';

    img.onload = () => {
      doc.addImage(img, 'JPEG', 0, 0, 600, 400); // Add the image as a background
  
    // Add text over the image
    doc.setFontSize(28);
    doc.setTextColor('#000');
    doc.setFont('helvetica', 'bold');
    doc.text(`SERTIFIKAT`, 300, 100, { align: 'center' });
    doc.setFontSize(16);
    doc.text(`Pembelajaran Mandiri Lab Inovasi`, 300, 120, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.text(`Diberikan Kepada`, 300, 150, { align: 'center' });
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text(`${userName}`, 300, 200, { align: 'center' });
    doc.setFontSize(16);
    doc.setFont('helvetica', 'normal');
    doc.text(`Telah Mengikuti Pembelajaran Mandiri Laboratorium Inovasi`, 300, 240, { align: 'center' });
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = new Date().toLocaleDateString('id-ID', options);
    doc.text('pada tanggal ' + formattedDate, 300, 260, { align: 'center' });
    doc.setFontSize(12);
    doc.text('Jakarta, ' + formattedDate, 420, 300, { align: 'center' });
    doc.text('Kepala Pusat Inovasi Administrasi Negara', 420, 340, { align: 'center' });
    doc.save(`Sertifikat-Lab Inovasi-${userName}.pdf`);
  };
};

const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

const toggleSidebar = () => {
  setIsSidebarOpen(!isSidebarOpen);
};

const [currentSrcIndex, setCurrentSrcIndex] = useState(0);

const handleNextVideo = () => {
  if (Array.isArray(selectedVideo.src)) {
    setCurrentSrcIndex((prevIndex) => (prevIndex + 1) % selectedVideo.src.length);
  }
};

const handlePreviousVideo = () => {
  if (Array.isArray(selectedVideo.src)) {
    setCurrentSrcIndex((prevIndex) => (prevIndex - 1 + selectedVideo.src.length) % selectedVideo.src.length);
  }
};

const handleVideoSelect = (video) => {
  setSelectedVideo(video);
  setCurrentSrcIndex(0); // Reset ke video pertama
};


  return (
    <div style={{ display: 'flex'}}>
      <div style={{ 
        width: isSidebarOpen ? '250px' : '50px', 
        transition: 'width 0.3s', 
        overflow: 'hidden', 
        backgroundColor: '#333', 
        color: '#fff', 
        padding: '10px' 
      }}>
        <button 
          onClick={toggleSidebar} 
          style={{
            backgroundColor: '#444',
            color: '#fff',
            border: 'none',
            padding: '10px 20px',
            cursor: 'pointer',
            borderRadius: '5px',
            width: '100%',
            marginBottom: '10px',
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          <FontAwesomeIcon icon={isSidebarOpen ? faChevronLeft : faChevronRight} />
        </button>
        <ul style={{ listStyleType: 'none', padding: '0' }}>
          {videos.map((video, index) => (
            <li key={video.id} style={{ marginBottom: '10px' }}>
              <button 
                onClick={() => setSelectedVideo(video)}
                style={{
                  backgroundColor: '#444',
                  color: '#fff',
                  border: 'none',
                  padding: '10px 20px',
                  cursor: 'pointer',
                  borderRadius: '5px',
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: isSidebarOpen ? 'flex-start' : 'center'
                }}
              >
                <FontAwesomeIcon icon={faBook} /> 
                {isSidebarOpen && <span style={{ marginLeft: '10px' }}>{video.title + '  '}    
                  {completedQuizzes[index] && (
                  <FontAwesomeIcon icon={faStar} />
                )}</span>}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div style={{ flex: 1, padding: '20px', backgroundColor: '#ecf0f1' }}>
        <section className="video-section p-4 w-full md:w-2/3 mx-auto bg-white shadow-lg rounded-lg">
        <h1 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 'bold', fontSize: '2rem', textAlign: 'center', margin: '20px 0 10px 0' }}>
        {selectedVideo.title}
    </h1>
    <hr style={{ width: '100px', border: 'none', height: '2px', background: 'linear-gradient(to right, red, black, red)', margin: '0 auto 20px auto' }} />
    
          <p className="text-lg text-gray-700 mb-4">{selectedVideo.description}</p>
         
          <div className="video-wrapper mb-4">
          {Array.isArray(selectedVideo.src) && (
    <div className="video-carousel">
      <div className="carousel-buttons">
  <button onClick={handlePreviousVideo} className="carousel-button">
    <FontAwesomeIcon icon={faChevronLeft} />
  </button>
  <button onClick={handleNextVideo} className="carousel-button">
    <FontAwesomeIcon icon={faChevronRight} />
  </button>
</div>


    </div>
  )}
  <iframe
    width="100%"
    height="500"
    src={
      Array.isArray(selectedVideo.src)
        ? selectedVideo.src[currentSrcIndex]
        : selectedVideo.src
    }
    title={selectedVideo.title}
    frameBorder={0}
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowFullScreen
    className="mb-4 rounded-lg"
  ></iframe>
<div className="video-info mb-4">
                <p className="video-views text-gray-600">{selectedVideo.views} views</p>
              </div>
              <Quiz 
                quiz={selectedVideo.quiz} 
                onQuizComplete={() => handleQuizComplete(selectedVideo.id - 1)} 
              />
            </div>


          {allQuizzesCompleted && (
            <div className="certificate-section mt-6">
              <input 
                type="text" 
                placeholder="Masukkan Nama" 
                value={userName} 
                onChange={(e) => setUserName(e.target.value)}
                className="border p-2 mb-4 w-full rounded-lg"
              />
              <button 
                onClick={handleDownloadCertificate} 
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full"
                disabled={!userName}
              >
                Unduh Sertifikat
              </button>
            </div>
          )}
        </section>
      </div>
      </div>
  );
};

export default VideoSection;
