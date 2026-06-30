import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { DashboardPage } from "./components/DashboardPage";
import { KRSPage } from "./components/KRSPage";
import { JadwalPage } from "./components/JadwalPage";
import { AkademikPage } from "./components/AkademikPage";
import { KeuanganPage } from "./components/KeuanganPage";
import { PerkuliahanPage } from "./components/PerkuliahanPage";
import { LayananPage } from "./components/LayananPage";
import { InformasiPage } from "./components/InformasiPage";
import { ProfilePage } from "./components/ProfilePage";
import { SettingsPage } from "./components/SettingsPage";
import { BantuanPage } from "./components/BantuanPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: DashboardPage },
      { path: "krs", Component: KRSPage },
      { path: "jadwal", Component: JadwalPage },
      { path: "akademik", Component: AkademikPage },
      { path: "keuangan", Component: KeuanganPage },
      { path: "perkuliahan", Component: PerkuliahanPage },
      { path: "layanan", Component: LayananPage },
      { path: "informasi", Component: InformasiPage },
      { path: "profil", Component: ProfilePage },
      { path: "setelan", Component: SettingsPage },
      { path: "bantuan", Component: BantuanPage },
    ],
  },
]);
