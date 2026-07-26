"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui";
import styles from "./attendance-print.module.css";

type PrintRow = {
  note: string | null;
  status: string;
  student: {
    nis: string;
    nisn: string;
    user: { profile: { fullName: string } | null; username: string };
  };
};

type PrintPayload = {
  meeting: {
    endTime: string;
    meetingDate: string;
    meetingNumber: number;
    startTime: string;
    topicSummary: string | null;
    teachingAssignment: {
      academicYear: { name: string };
      class: { name: string };
      rombel: {
        homeroomTeacher?: { profile: { fullName: string } | null; username: string } | null;
        name: string;
      };
      semester: { name: string };
      subject: { name: string };
      teacher: { user: { profile: { fullName: string } | null; username: string } };
    };
  };
  rows?: { note: string | null; status: string; student: PrintRow["student"] }[];
  school: { address: string; logoUrl?: string | null; name: string } | null;
  summary: { hadir: number; izin: number; sakit: number; alpha: number; terlambat: number; persentase: number };
};

async function fetchJson<T>(url: string) {
  const response = await fetch(url, { cache: "no-store" });
  const payload = await response.json();
  if (!response.ok || !payload.success) throw new Error(payload.message || "Data cetak gagal dimuat");
  return payload.data as T;
}

function timeOnly(value: string) {
  return new Date(value).toTimeString().slice(0, 5);
}

export function AttendanceMeetingPrint({ endpoint }: { endpoint: string }) {
  const [data, setData] = useState<PrintPayload | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchJson<PrintPayload>(endpoint)
      .then((payload) => {
        if (!payload.rows && "attendances" in payload.meeting) {
          const meeting = payload.meeting as PrintPayload["meeting"] & { attendances: PrintRow[] };
          setData({ ...payload, rows: meeting.attendances });
        } else {
          setData(payload);
        }
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Data cetak gagal dimuat"));
  }, [endpoint]);

  if (error) return <main className={styles.page}>{error}</main>;
  if (!data) return <main className={styles.page}>Memuat cetak absensi...</main>;

  const assignment = data.meeting.teachingAssignment;
  const rows = data.rows || [];
  const teacherName = assignment.teacher.user.profile?.fullName || assignment.teacher.user.username;
  const homeroomName = assignment.rombel.homeroomTeacher?.profile?.fullName || "-";

  return (
    <main className={styles.page}>
      <div className={styles.toolbar}>
        <Button onClick={() => window.print()}>Cetak</Button>
      </div>
      <section className={styles.header}>
        <div className={styles.logo}>{data.school?.logoUrl ? "Logo" : "SAGU"}</div>
        <div>
          <h1 className={styles.title}>{data.school?.name || "SAGU"}</h1>
          <p className={styles.subtitle}>{data.school?.address || "Alamat sekolah"}</p>
          <h2 className={styles.title}>DAFTAR HADIR SISWA</h2>
        </div>
      </section>

      <section className={styles.metaGrid}>
        <div><strong>Tahun Ajaran</strong><span>: {assignment.academicYear.name}</span></div>
        <div><strong>Semester</strong><span>: {assignment.semester.name}</span></div>
        <div><strong>Mata Pelajaran</strong><span>: {assignment.subject.name}</span></div>
        <div><strong>Kelas/Rombel</strong><span>: {assignment.class.name} / {assignment.rombel.name}</span></div>
        <div><strong>Guru</strong><span>: {teacherName}</span></div>
        <div><strong>Tanggal</strong><span>: {new Date(data.meeting.meetingDate).toLocaleDateString("id-ID")}</span></div>
        <div><strong>Waktu</strong><span>: {timeOnly(data.meeting.startTime)} - {timeOnly(data.meeting.endTime)}</span></div>
        <div><strong>Pertemuan</strong><span>: {data.meeting.meetingNumber}</span></div>
      </section>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>No</th>
            <th>NIS</th>
            <th>NISN</th>
            <th>Nama</th>
            <th>Status</th>
            <th>Catatan</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={row.student.nis}>
              <td>{index + 1}</td>
              <td>{row.student.nis}</td>
              <td>{row.student.nisn}</td>
              <td>{row.student.user.profile?.fullName || row.student.user.username}</td>
              <td>{row.status}</td>
              <td>{row.note || ""}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <section className={styles.summary}>
        <strong>H: {data.summary.hadir}</strong>
        <strong>I: {data.summary.izin}</strong>
        <strong>S: {data.summary.sakit}</strong>
        <strong>A: {data.summary.alpha}</strong>
        <strong>T: {data.summary.terlambat}</strong>
        <strong>Kehadiran: {data.summary.persentase}%</strong>
      </section>

      <section className={styles.signature}>
        <div>
          <p>Wali Kelas</p>
          <strong>{homeroomName}</strong>
        </div>
        <div>
          <p>Guru Mata Pelajaran</p>
          <strong>{teacherName}</strong>
        </div>
      </section>
    </main>
  );
}
