import { createContext, useContext, useState, ReactNode } from "react";

export type Course = {
  id: string;
  name: string;
  code: string;
  sks: number;
  type: "Wajib" | "Pilihan" | "KKN" | "Tugas Akhir";
  schedule: string;
  day: string;
  room: string;
  lecturer: string;
  semester: number;
  maxSks?: number;
};

export type EnrolledCourse = Course & {
  attendance: number;
  grade?: string;
  score?: number;
  totalMeetings?: number;
  attendedMeetings?: number;
};

export type Announcement = {
  id: string;
  title: string;
  date: string;
  type: "info" | "warning" | "success" | "error";
  category: string;
  content: string;
};

export type FinanceRecord = {
  id: string;
  description: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: "Lunas" | "Belum Lunas";
  type: "UKT" | "Denda" | "Beasiswa" | "Lainnya";
  receipt?: string;
};

export type AcademicCalendarEvent = {
  id: string;
  title: string;
  date: string;
  endDate?: string;
  type: "ujian" | "libur" | "pendaftaran" | "kegiatan" | "pengumuman";
  description?: string;
};

export type SemesterHistory = {
  semester: string;
  sksAmbil: number;
  sksTempuh: number;
  ips: number;
  year: string;
};

export type StudentProfile = {
  // Academic
  name: string;
  nim: string;
  major: string;
  faculty: string;
  semester: number;
  status: string;
  advisor: string;
  angkatan: string;
  // Personal
  nik: string;
  birthPlace: string;
  birthDate: string;
  gender: "Laki-laki" | "Perempuan";
  religion: string;
  nationality: string;
  maritalStatus: string;
  bloodType: string;
  // Contact
  email: string;
  phone: string;
  whatsapp: string;
  addressDomisili: string;
  addressKTP: string;
  postalCode: string;
  // Avatar
  avatarUrl: string;
};

export type RecentActivity = {
  id: string;
  type: "krs" | "jadwal" | "kehadiran" | "tugas" | "keuangan" | "layanan" | "pengumuman";
  title: string;
  description: string;
  timestamp: string;
  icon?: string;
};

type AppContextType = {
  isAuthenticated: boolean;
  login: (nim: string, password: string) => boolean;
  logout: () => void;
  student: StudentProfile;
  updateProfile: (data: Partial<Pick<StudentProfile, "email" | "phone" | "whatsapp" | "addressDomisili" | "avatarUrl">>) => void;
  availableCourses: Course[];
  myCourses: EnrolledCourse[];
  enrollCourse: (course: Course) => void;
  dropCourse: (courseId: string) => void;
  announcements: Announcement[];
  finances: FinanceRecord[];
  totalSks: number;
  ipk: number;
  ips: number;
  academicCalendar: AcademicCalendarEvent[];
  semesterHistory: SemesterHistory[];
  totalSksTempuh: number;
  targetSksLulus: number;
  recentActivities: RecentActivity[];
};

const availableCoursesSem6: Course[] = [
  { id: "c1", name: "Interaksi Manusia dan Komputer", code: "IF3201", sks: 3, type: "Wajib", schedule: "08:00 - 10:30", day: "Senin", room: "Ruang 301", lecturer: "Dr. Arif Wicaksono, M.Kom", semester: 6 },
  { id: "c2", name: "Data Mining", code: "IF3202", sks: 3, type: "Pilihan", schedule: "13:00 - 15:30", day: "Selasa", room: "Lab Data Science", lecturer: "Dr. Siti Nurhaliza, M.T", semester: 6 },
  { id: "c3", name: "Sistem Enterprise", code: "IF3203", sks: 3, type: "Wajib", schedule: "08:00 - 10:30", day: "Rabu", room: "Ruang 402", lecturer: "Prof. Budi Rahardjo, Ph.D", semester: 6 },
  { id: "c4", name: "Pemodelan Proses Bisnis", code: "IF3204", sks: 3, type: "Wajib", schedule: "10:00 - 12:30", day: "Kamis", room: "Ruang 302", lecturer: "Ir. Hendro Sutanto, M.M", semester: 6 },
  { id: "c5", name: "Keamanan Jaringan", code: "IF3205", sks: 3, type: "Pilihan", schedule: "13:00 - 15:30", day: "Jumat", room: "Lab Keamanan", lecturer: "Dr. Ratna Dewi, M.Ak", semester: 6 },
  { id: "c6", name: "Kewirausahaan", code: "IF3206", sks: 2, type: "Wajib", schedule: "15:30 - 17:10", day: "Rabu", room: "Aula B", lecturer: "Drs. Wahyu Santoso, M.Hum", semester: 6 },
  { id: "c7", name: "Metodologi Penelitian", code: "IF3207", sks: 3, type: "Wajib", schedule: "13:00 - 15:30", day: "Senin", room: "Ruang 201", lecturer: "Dr. Maya Putri, M.Kom", semester: 6 },
  { id: "c8", name: "Pengembangan Aplikasi Web", code: "IF3208", sks: 3, type: "Wajib", schedule: "10:00 - 12:30", day: "Selasa", room: "Lab Pemrograman", lecturer: "Bpk. Fajar Hidayat, M.T", semester: 6 },
];

const initialMyCoursesSem6: EnrolledCourse[] = [
  { ...availableCoursesSem6[0], attendance: 90, grade: "A", score: 4.0, totalMeetings: 16, attendedMeetings: 14 },
  { ...availableCoursesSem6[1], attendance: 87, grade: "A-", score: 3.7, totalMeetings: 16, attendedMeetings: 14 },
  { ...availableCoursesSem6[2], attendance: 81, grade: "B+", score: 3.3, totalMeetings: 16, attendedMeetings: 13 },
  { ...availableCoursesSem6[3], attendance: 75, totalMeetings: 16, attendedMeetings: 12 },
  { ...availableCoursesSem6[4], attendance: 94, totalMeetings: 16, attendedMeetings: 15 },
  { ...availableCoursesSem6[5], attendance: 88, totalMeetings: 16, attendedMeetings: 14 },
];

const initialAnnouncements: Announcement[] = [
  { id: "a1", title: "Pendaftaran KRS Semester Genap 2026/2027", date: "20 Jun 2026", type: "warning", category: "KRS", content: "Pendaftaran KRS semester Genap 2026/2027 dibuka mulai 25 Juni - 5 Juli 2026. Pastikan tidak ada tunggakan UKT sebelum mendaftar." },
  { id: "a2", title: "Pembayaran UKT Semester Ganjil 2026/2027", date: "15 Jun 2026", type: "info", category: "Keuangan", content: "Pembayaran UKT Semester Ganjil 2026/2027 telah dibuka. Batas akhir pembayaran adalah 20 Agustus 2026." },
  { id: "a3", title: "Jadwal Ujian Tengah Semester (UTS) Ganjil 2026", date: "12 Jun 2026", type: "info", category: "Akademik", content: "Jadwal UTS Semester Ganjil 2026/2027 telah dirilis. UTS dilaksanakan pada 14 - 25 Juli 2026." },
  { id: "a4", title: "Libur Idul Adha 1447 H", date: "05 Jun 2026", type: "success", category: "Kalender", content: "Kampus libur dalam rangka Hari Raya Idul Adha 1447 H pada 17-18 Juni 2026." },
  { id: "a5", title: "Kuota Mahasiswa KKN Periode Juli 2026", date: "03 Jun 2026", type: "warning", category: "KKN", content: "Pendaftaran KKN Periode Juli 2026 dibuka mulai 10-20 Juni 2026. Kuota terbatas 120 mahasiswa." },
  { id: "a6", title: "Workshop Penulisan Tugas Akhir", date: "01 Jun 2026", type: "info", category: "Akademik", content: "Workshop Penulisan TA pada 28 Juni 2026 pukul 09.00-15.00 di Aula Utama. Terbuka untuk seluruh mahasiswa Ilmu Komputer." },
];

const initialFinances: FinanceRecord[] = [
  { id: "f1", description: "UKT Semester Ganjil 2026/2027", amount: 5500000, dueDate: "2026-08-20", status: "Belum Lunas", type: "UKT" },
  { id: "f2", description: "UKT Semester Genap 2025/2026", amount: 5500000, dueDate: "2026-02-20", paidDate: "2026-02-15", status: "Lunas", type: "UKT", receipt: "RCP-2026-0215-001" },
  { id: "f3", description: "UKT Semester Ganjil 2025/2026", amount: 5500000, dueDate: "2025-08-20", paidDate: "2025-08-10", status: "Lunas", type: "UKT", receipt: "RCP-2025-0810-002" },
  { id: "f4", description: "UKT Semester Genap 2024/2025", amount: 5000000, dueDate: "2025-02-20", paidDate: "2025-02-18", status: "Lunas", type: "UKT", receipt: "RCP-2025-0218-003" },
  { id: "f5", description: "Beasiswa Peningkatan Prestasi Akademik (PPA)", amount: -2500000, dueDate: "2026-03-01", paidDate: "2026-03-01", status: "Lunas", type: "Beasiswa" },
  { id: "f6", description: "Denda Keterlambatan Pengembalian Buku Perpustakaan", amount: 15000, dueDate: "2026-05-30", status: "Belum Lunas", type: "Denda" },
];

export const academicCalendarEvents: AcademicCalendarEvent[] = [
  { id: "ev1", title: "Awal Semester Ganjil", date: "2026-08-25", type: "kegiatan", description: "Dimulainya perkuliahan semester ganjil 2026/2027" },
  { id: "ev2", title: "Batas Akhir KRS", date: "2026-09-05", type: "pendaftaran", description: "Batas akhir pengisian dan pengesahan KRS semester ganjil" },
  { id: "ev3", title: "UTS Semester Ganjil", date: "2026-10-12", endDate: "2026-10-23", type: "ujian", description: "Ujian Tengah Semester Ganjil 2026/2027" },
  { id: "ev4", title: "Libur Maulid Nabi", date: "2026-10-01", type: "libur", description: "Libur Maulid Nabi Muhammad SAW 1448 H" },
  { id: "ev5", title: "Batas Akhir Pembayaran UKT", date: "2026-08-20", type: "pendaftaran", description: "Batas akhir pembayaran UKT semester ganjil 2026/2027" },
  { id: "ev6", title: "UAS Semester Ganjil", date: "2026-12-07", endDate: "2026-12-18", type: "ujian", description: "Ujian Akhir Semester Ganjil 2026/2027" },
  { id: "ev7", title: "Libur Natal & Tahun Baru", date: "2026-12-24", endDate: "2027-01-02", type: "libur", description: "Libur Natal dan Tahun Baru" },
  { id: "ev8", title: "Pengumuman Hasil Studi", date: "2027-01-10", type: "pengumuman", description: "Publikasi KHS Semester Ganjil 2026/2027" },
  { id: "ev9", title: "Pendaftaran KRS Sem Genap", date: "2026-06-25", endDate: "2026-07-05", type: "pendaftaran", description: "Periode pengisian KRS Semester Genap 2026/2027" },
  { id: "ev10", title: "Workshop Penulisan TA", date: "2026-06-28", type: "kegiatan", description: "Workshop terbuka untuk seluruh mahasiswa" },
  { id: "ev11", title: "Libur Idul Adha", date: "2026-06-17", endDate: "2026-06-18", type: "libur", description: "Libur Hari Raya Idul Adha 1447 H" },
  { id: "ev12", title: "UTS Sem Ganjil 2026", date: "2026-07-14", endDate: "2026-07-25", type: "ujian", description: "Ujian Tengah Semester - semester berjalan" },
  { id: "ev13", title: "Sidang TA Periode I", date: "2026-07-20", endDate: "2026-07-31", type: "kegiatan", description: "Periode sidang Tugas Akhir gelombang pertama" },
  { id: "ev14", title: "Pendaftaran KKN Juli 2026", date: "2026-06-10", endDate: "2026-06-20", type: "pendaftaran", description: "Pendaftaran KKN periode Juli 2026" },
  { id: "ev15", title: "Libur Kemerdekaan RI", date: "2026-08-17", type: "libur", description: "Hari Kemerdekaan Republik Indonesia ke-81" },
];

export const semesterHistoryData: SemesterHistory[] = [
  { semester: "Ganjil", year: "2023/2024", sksAmbil: 18, sksTempuh: 18, ips: 3.65 },
  { semester: "Genap", year: "2023/2024", sksAmbil: 20, sksTempuh: 20, ips: 3.78 },
  { semester: "Ganjil", year: "2024/2025", sksAmbil: 21, sksTempuh: 21, ips: 3.82 },
  { semester: "Genap", year: "2024/2025", sksAmbil: 22, sksTempuh: 22, ips: 3.89 },
  { semester: "Ganjil", year: "2025/2026", sksAmbil: 21, sksTempuh: 21, ips: 3.91 },
];

const initialActivities: RecentActivity[] = [
  { id: "act1", type: "keuangan", title: "Pembayaran UKT Genap 2025/2026", description: "Rp 5.500.000 berhasil dibayar via VA BNI", timestamp: "15 Feb 2026, 10:23" },
  { id: "act2", type: "layanan", title: "Pengajuan Surat Keterangan Aktif", description: "No. LAY-2026-0001 — Status: Selesai", timestamp: "01 Jun 2026, 09:05" },
  { id: "act3", type: "tugas", title: "Pengumpulan Tugas: Analisis Use Case IMK", description: "IF3201 Interaksi Manusia dan Komputer", timestamp: "28 Jun 2026, 23:41" },
  { id: "act4", type: "krs", title: "KRS Semester Genap 2025/2026 Dikunci", description: "6 mata kuliah, 17 SKS telah disahkan PA", timestamp: "10 Feb 2026, 14:00" },
  { id: "act5", type: "kehadiran", title: "Absensi: Data Mining", description: "Pertemuan 14 — Hadir", timestamp: "16 Jun 2026, 13:05" },
  { id: "act6", type: "pengumuman", title: "Pengumuman KRS Semester Ganjil 2026/2027", description: "Periode pengisian KRS dibuka 25 Jun - 5 Jul 2026", timestamp: "20 Jun 2026, 07:00" },
  { id: "act7", type: "jadwal", title: "Jadwal Kuliah Diperbarui", description: "Kuliah pengganti IF3203 — Sabtu 21 Jun 2026", timestamp: "19 Jun 2026, 11:30" },
];

const initialStudent: StudentProfile = {
  name: "Sekar",
  nim: "2023101080",
  major: "S1 Sistem Informasi",
  faculty: "Ilmu Komputer",
  semester: 6,
  status: "Aktif",
  advisor: "Dr. Maya Putri, M.Kom",
  angkatan: "2023",
  nik: "3201234500062005",
  birthPlace: "Yogyakarta",
  birthDate: "2005-06-14",
  gender: "Perempuan",
  religion: "Islam",
  nationality: "Warga Negara Indonesia",
  maritalStatus: "Belum Menikah",
  bloodType: "A",
  email: "sekar@student.univ.ac.id",
  phone: "0857-2345-6789",
  whatsapp: "0857-2345-6789",
  addressDomisili: "Jl. Margonda Raya No. 18, Depok, Jawa Barat 16424",
  addressKTP: "Jl. Gajah Mada No. 5, Yogyakarta, DI Yogyakarta 55111",
  postalCode: "16424",
  avatarUrl: "https://images.unsplash.com/photo-1581065178047-8ee15951ede6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMGZlbWFsZSUyMHN0dWRlbnQlMjBwb3J0cmFpdCUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3ODI3MzU5NjJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [student, setStudent] = useState<StudentProfile>(initialStudent);

  const login = (nim: string, password: string): boolean => {
    if (nim.trim() === "2023101080" && password === "123456") {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => setIsAuthenticated(false);
  const [myCourses, setMyCourses] = useState<EnrolledCourse[]>(initialMyCoursesSem6);
  const [finances] = useState<FinanceRecord[]>(initialFinances);
  const [announcements] = useState<Announcement[]>(initialAnnouncements);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>(initialActivities);

  const updateProfile = (data: Partial<Pick<StudentProfile, "email" | "phone" | "whatsapp" | "addressDomisili" | "avatarUrl">>) => {
    setStudent((prev) => ({ ...prev, ...data }));
  };

  const totalSks = myCourses.reduce((sum, c) => sum + c.sks, 0);
  const gradedCourses = myCourses.filter((c) => c.score !== undefined);
  const ips = gradedCourses.length > 0
    ? gradedCourses.reduce((sum, c) => sum + c.score! * c.sks, 0) / gradedCourses.reduce((sum, c) => sum + c.sks, 0)
    : 0;
  const ipk = 3.85;
  const sksPrevious = semesterHistoryData.reduce((s, r) => s + r.sksTempuh, 0);
  const totalSksTempuh = sksPrevious + myCourses.reduce((s, c) => s + c.sks, 0);
  const targetSksLulus = 144;

  const enrollCourse = (course: Course) => {
    if (!myCourses.find((c) => c.id === course.id)) {
      const newCourse = { ...course, attendance: 0, totalMeetings: 0, attendedMeetings: 0 };
      setMyCourses((prev) => [...prev, newCourse]);
      setRecentActivities((prev) => [{
        id: `act-${Date.now()}`,
        type: "krs",
        title: `KRS: Menambahkan ${course.name}`,
        description: `${course.code} — ${course.sks} SKS ditambahkan`,
        timestamp: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }),
      }, ...prev.slice(0, 9)]);
    }
  };

  const dropCourse = (courseId: string) => {
    const course = myCourses.find((c) => c.id === courseId);
    setMyCourses((prev) => prev.filter((c) => c.id !== courseId));
    if (course) {
      setRecentActivities((prev) => [{
        id: `act-${Date.now()}`,
        type: "krs",
        title: `KRS: Membatalkan ${course.name}`,
        description: `${course.code} dihapus dari KRS`,
        timestamp: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }),
      }, ...prev.slice(0, 9)]);
    }
  };

  return (
    <AppContext.Provider value={{
      isAuthenticated,
      login,
      logout,
      student,
      updateProfile,
      availableCourses: availableCoursesSem6,
      myCourses,
      enrollCourse,
      dropCourse,
      announcements,
      finances,
      totalSks,
      ipk,
      ips,
      academicCalendar: academicCalendarEvents,
      semesterHistory: semesterHistoryData,
      totalSksTempuh,
      targetSksLulus,
      recentActivities,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) throw new Error("useAppContext must be used within an AppProvider");
  return context;
}
