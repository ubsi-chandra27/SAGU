"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui";
import styles from "./attendance-print.module.css";

type RecapPayload = {
  school: { address: string; name: string } | null;
  students: {
    alpha: number;
    hadir: number;
    izin: number;
    percentage: number;
    sakit: number;
    student: { nis: string; nisn: string; user: { profile: { fullName: string } | null; username: string } };
    terlambat: number;
    total: number;
  }[];
};

async function fetchJson<T>(url: string) {
  const response = await fetch(url, { cache: "no-store" });
  const payload = await response.json();
  if (!response.ok || !payload.success) throw new Error(payload.message || "Data cetak gagal dimuat");
  return payload.data as T;
}

export function AttendanceRecapPrint({ query }: { query: string }) {
  const [data, setData] = useState<RecapPayload | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchJson<RecapPayload>(`/api/v1/admin/attendance/recap?${query}`)
      .then(setData)
      .catch((err) => setError(err instanceof Error ? err.message : "Data cetak gagal dimuat"));
  }, [query]);

  if (error) return <main className={`${styles.page} ${styles.landscape}`}>{error}</main>;
  if (!data) return <main className={`${styles.page} ${styles.landscape}`}>Memuat rekap...</main>;

  return (
    <main className={`${styles.page} ${styles.landscape}`}>
      <div className={styles.toolbar}>
        <Button onClick={() => window.print()}>Cetak</Button>
      </div>
      <section className={styles.header}>
        <div className={styles.logo}>SAGU</div>
        <div>
          <h1 className={styles.title}>{data.school?.name || "SAGU"}</h1>
          <p className={styles.subtitle}>{data.school?.address || "Alamat sekolah"}</p>
          <h2 className={styles.title}>REKAP ABSENSI SISWA</h2>
        </div>
      </section>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>No</th>
            <th>NIS</th>
            <th>NISN</th>
            <th>Nama</th>
            <th>Hadir</th>
            <th>Izin</th>
            <th>Sakit</th>
            <th>Alfa</th>
            <th>Terlambat</th>
            <th>Total Pertemuan</th>
            <th>Persentase Kehadiran</th>
          </tr>
        </thead>
        <tbody>
          {data.students.map((row, index) => (
            <tr key={row.student.nis}>
              <td>{index + 1}</td>
              <td>{row.student.nis}</td>
              <td>{row.student.nisn}</td>
              <td>{row.student.user.profile?.fullName || row.student.user.username}</td>
              <td>{row.hadir}</td>
              <td>{row.izin}</td>
              <td>{row.sakit}</td>
              <td>{row.alpha}</td>
              <td>{row.terlambat}</td>
              <td>{row.total}</td>
              <td>{row.percentage}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
