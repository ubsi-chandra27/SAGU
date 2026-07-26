"use client";

import Link from "next/link";
import type { Dispatch, SetStateAction } from "react";
import { useEffect, useMemo, useState } from "react";
import { Badge, Button, Card, Input } from "@/components/ui";
import { PageHeader, RoleBadge } from "@/components/dashboard/dashboard-widgets";
import styles from "@/components/teacher/teacher-attendance.module.css";

type Recap = {
  meetings: {
    id: string;
    meetingDate: string;
    meetingNumber: number;
    summary: { hadir: number; izin: number; sakit: number; alpha: number; terlambat: number; persentase: number };
    teachingAssignment: {
      rombel: { name: string };
      subject: { name: string };
      teacher: { user: { profile: { fullName: string } | null; username: string } };
    };
  }[];
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
  summary: { hadir: number; izin: number; sakit: number; alpha: number; terlambat: number; persentase: number; total: number };
};

type RefItem = { id: string; name: string };

type FilterState = {
  academicYearId: string;
  from: string;
  rombelId: string;
  semesterId: string;
  subjectId: string;
  to: string;
};

async function fetchJson<T>(url: string) {
  const response = await fetch(url, { cache: "no-store" });
  const payload = await response.json();
  if (!response.ok || !payload.success) throw new Error(payload.message || "Permintaan gagal");
  return payload.data as T;
}

export function AttendanceRecapPage() {
  const [refs, setRefs] = useState<Record<string, RefItem[]>>({});
  const [recap, setRecap] = useState<Recap | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    academicYearId: "",
    from: "",
    rombelId: "",
    semesterId: "",
    subjectId: "",
    to: "",
  });

  const query = useMemo(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    return params.toString();
  }, [filters]);

  async function loadRefs() {
    const [academicYears, semesters, rombels, subjects] = await Promise.all([
      fetchJson<RefItem[]>("/api/v1/tahun-ajaran"),
      fetchJson<RefItem[]>("/api/v1/semester"),
      fetchJson<RefItem[]>("/api/v1/admin/master/rombels"),
      fetchJson<RefItem[]>("/api/v1/admin/master/subjects"),
    ]);
    setRefs({ academicYears, rombels, semesters, subjects });
  }

  async function loadRecap() {
    setMessage(null);
    try {
      const data = await fetchJson<Recap>(`/api/v1/admin/attendance/recap?${query}`);
      setRecap(data);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Rekap gagal dimuat");
    }
  }

  useEffect(() => {
    loadRefs().catch((error) => setMessage(error instanceof Error ? error.message : "Referensi gagal dimuat"));
    loadRecap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.stack}>
      <PageHeader
        badge={<RoleBadge tone="info">Admin</RoleBadge>}
        description="Pantau absensi per pertemuan dan rekap periode."
        title="Rekap Absensi"
      />

      {message ? <Badge tone="danger">{message}</Badge> : null}

      <Card>
        <div className={styles.grid}>
          <Select label="Tahun ajaran" name="academicYearId" onChange={setFilters} options={refs.academicYears || []} value={filters.academicYearId} />
          <Select label="Semester" name="semesterId" onChange={setFilters} options={refs.semesters || []} value={filters.semesterId} />
          <Select label="Rombel" name="rombelId" onChange={setFilters} options={refs.rombels || []} value={filters.rombelId} />
          <Select label="Mata pelajaran" name="subjectId" onChange={setFilters} options={refs.subjects || []} value={filters.subjectId} />
          <Input label="Dari tanggal" onChange={(event) => setFilters((current) => ({ ...current, from: event.target.value }))} type="date" value={filters.from} />
          <Input label="Sampai tanggal" onChange={(event) => setFilters((current) => ({ ...current, to: event.target.value }))} type="date" value={filters.to} />
        </div>
        <div className={styles.actions}>
          <Button onClick={loadRecap}>Terapkan Filter</Button>
          <Link href={`/dashboard/admin/rekap-absensi/cetak?${query}`}>
            <Button variant="outline">Cetak Rekap</Button>
          </Link>
        </div>
      </Card>

      {recap ? (
        <>
          <div className={styles.stats}>
            <Stat label="Hadir" value={recap.summary.hadir} />
            <Stat label="Izin" value={recap.summary.izin} />
            <Stat label="Sakit" value={recap.summary.sakit} />
            <Stat label="Alfa" value={recap.summary.alpha} />
            <Stat label="Terlambat" value={recap.summary.terlambat} />
            <Stat label="Kehadiran" value={`${recap.summary.persentase}%`} />
          </div>

          <Card>
            <div className={styles.stack}>
              <h2>Rekap Per Siswa</h2>
              {recap.students.length === 0 ? (
                <div className={styles.empty}>Belum ada data absensi.</div>
              ) : (
                <div className={styles.tableWrap}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>NIS</th>
                        <th>NISN</th>
                        <th>Nama</th>
                        <th>H</th>
                        <th>I</th>
                        <th>S</th>
                        <th>A</th>
                        <th>T</th>
                        <th>Total</th>
                        <th>%</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recap.students.map((row) => (
                        <tr key={row.student.nis}>
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
                </div>
              )}
            </div>
          </Card>

          <Card>
            <div className={styles.stack}>
              <h2>Rekap Per Pertemuan</h2>
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Tanggal</th>
                      <th>Pertemuan</th>
                      <th>Mapel/Rombel</th>
                      <th>Guru</th>
                      <th>H/I/S/A/T</th>
                      <th>Cetak</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recap.meetings.map((meeting) => (
                      <tr key={meeting.id}>
                        <td>{new Date(meeting.meetingDate).toLocaleDateString("id-ID")}</td>
                        <td>{meeting.meetingNumber}</td>
                        <td>{meeting.teachingAssignment.subject.name} / {meeting.teachingAssignment.rombel.name}</td>
                        <td>{meeting.teachingAssignment.teacher.user.profile?.fullName || meeting.teachingAssignment.teacher.user.username}</td>
                        <td>{meeting.summary.hadir}/{meeting.summary.izin}/{meeting.summary.sakit}/{meeting.summary.alpha}/{meeting.summary.terlambat}</td>
                        <td>
                          <Link href={`/dashboard/admin/rekap-absensi/pertemuan/${meeting.id}/cetak`}>
                            <Button size="sm" variant="ghost">Cetak</Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        </>
      ) : null}
    </div>
  );
}

function Select({
  label,
  name,
  onChange,
  options,
  value,
}: {
  label: string;
  name: string;
  onChange: Dispatch<SetStateAction<FilterState>>;
  options: RefItem[];
  value: string;
}) {
  return (
    <label className={styles.field}>
      <span>{label}</span>
      <select onChange={(event) => onChange((current) => ({ ...current, [name]: event.target.value }))} value={value}>
        <option value="">Semua</option>
        {options.map((option) => <option key={option.id} value={option.id}>{option.name}</option>)}
      </select>
    </label>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className={styles.stat}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
