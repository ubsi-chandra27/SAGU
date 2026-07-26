"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Badge, Button, Card, Input } from "@/components/ui";
import { PageHeader, RoleBadge } from "@/components/dashboard/dashboard-widgets";
import styles from "./teacher-attendance.module.css";

type Status = "HADIR" | "IZIN" | "SAKIT" | "ALPHA" | "TERLAMBAT";

type AttendancePayload = {
  meeting: {
    id: string;
    endTime: string;
    meetingDate: string;
    meetingNumber: number;
    startTime: string;
    topicSummary: string | null;
    teachingAssignment: {
      academicYear: { name: string };
      class: { name: string };
      rombel: { name: string };
      semester: { name: string };
      subject: { name: string };
      teacher: { user: { profile: { fullName: string } | null; username: string } };
    };
  };
  rows: {
    note: string;
    status: Status;
    student: {
      id: string;
      nis: string;
      nisn: string;
      user: { profile: { fullName: string } | null; username: string };
    };
  }[];
  statuses: Status[];
  summary: AttendanceSummary;
};

type AttendanceSummary = {
  alpha: number;
  hadir: number;
  izin: number;
  persentase: number;
  sakit: number;
  terlambat: number;
  total: number;
};

async function fetchJson<T>(url: string, init?: RequestInit) {
  const response = await fetch(url, {
    cache: "no-store",
    headers: init?.body ? { "Content-Type": "application/json" } : undefined,
    ...init,
  });
  const payload = await response.json();
  if (!response.ok || !payload.success) throw new Error(payload.message || "Permintaan gagal");
  return payload.data as T;
}

function countSummary(rows: AttendancePayload["rows"]): AttendanceSummary {
  const summary = rows.reduce(
    (acc, row) => {
      if (row.status === "HADIR") acc.hadir += 1;
      if (row.status === "IZIN") acc.izin += 1;
      if (row.status === "SAKIT") acc.sakit += 1;
      if (row.status === "ALPHA") acc.alpha += 1;
      if (row.status === "TERLAMBAT") acc.terlambat += 1;
      acc.total += 1;
      return acc;
    },
    { alpha: 0, hadir: 0, izin: 0, persentase: 0, sakit: 0, terlambat: 0, total: 0 }
  );
  summary.persentase = summary.total
    ? Math.round(((summary.hadir + summary.terlambat) / summary.total) * 100)
    : 0;
  return summary;
}

function timeOnly(value: string) {
  return new Date(value).toTimeString().slice(0, 5);
}

export function AttendanceEditor({ meetingId }: { meetingId: string }) {
  const [data, setData] = useState<AttendancePayload | null>(null);
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState<{ text: string; tone: "danger" | "success" | "info" } | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const payload = await fetchJson<AttendancePayload>(`/api/v1/guru/meetings/${meetingId}/attendance`);
      setData(payload);
    } catch (error) {
      setMessage({ tone: "danger", text: error instanceof Error ? error.message : "Absensi gagal dimuat" });
    } finally {
      setLoading(false);
    }
  }, [meetingId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredRows = useMemo(() => {
    if (!data) return [];
    const search = query.toLowerCase();
    return data.rows.filter((row) => {
      const name = row.student.user.profile?.fullName || row.student.user.username;
      return (
        name.toLowerCase().includes(search) ||
        row.student.nis.toLowerCase().includes(search) ||
        row.student.nisn.toLowerCase().includes(search)
      );
    });
  }, [data, query]);

  const summary = data ? countSummary(data.rows) : null;

  function updateRow(studentId: string, patch: Partial<AttendancePayload["rows"][number]>) {
    setData((current) => {
      if (!current) return current;
      return {
        ...current,
        rows: current.rows.map((row) =>
          row.student.id === studentId ? { ...row, ...patch } : row
        ),
      };
    });
  }

  function markAllPresent() {
    setData((current) =>
      current
        ? {
            ...current,
            rows: current.rows.map((row) => ({ ...row, note: "", status: "HADIR" })),
          }
        : current
    );
  }

  async function saveAttendance() {
    if (!data || saving) return;
    setSaving(true);
    setMessage(null);
    try {
      await fetchJson(`/api/v1/guru/meetings/${meetingId}/attendance`, {
        body: JSON.stringify({
          rows: data.rows.map((row) => ({
            note: row.note,
            status: row.status,
            studentId: row.student.id,
          })),
        }),
        method: "PUT",
      });
      setMessage({ tone: "success", text: "Absensi berhasil disimpan" });
      await loadData();
    } catch (error) {
      setMessage({ tone: "danger", text: error instanceof Error ? error.message : "Absensi gagal disimpan" });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className={styles.empty}>Memuat absensi...</div>;
  }

  if (!data) {
    return <div className={styles.empty}>Data absensi tidak tersedia.</div>;
  }

  const assignment = data.meeting.teachingAssignment;

  return (
    <div className={styles.stack}>
      <PageHeader
        badge={<RoleBadge tone="success">Guru</RoleBadge>}
        description={`${assignment.subject.name} - ${assignment.rombel.name} - Pertemuan ${data.meeting.meetingNumber}`}
        title="Absensi Cepat"
      />

      {message ? <Badge tone={message.tone}>{message.text}</Badge> : null}

      <Card>
        <div className={styles.grid}>
          <p className={styles.meta}><strong>Tahun ajaran:</strong> {assignment.academicYear.name}</p>
          <p className={styles.meta}><strong>Semester:</strong> {assignment.semester.name}</p>
          <p className={styles.meta}><strong>Kelas/Rombel:</strong> {assignment.class.name} / {assignment.rombel.name}</p>
          <p className={styles.meta}><strong>Guru:</strong> {assignment.teacher.user.profile?.fullName || assignment.teacher.user.username}</p>
          <p className={styles.meta}><strong>Tanggal:</strong> {new Date(data.meeting.meetingDate).toLocaleDateString("id-ID")}</p>
          <p className={styles.meta}><strong>Waktu:</strong> {timeOnly(data.meeting.startTime)} - {timeOnly(data.meeting.endTime)}</p>
        </div>
      </Card>

      {summary ? (
        <div className={styles.stats}>
          <Stat label="Hadir" value={summary.hadir} />
          <Stat label="Izin" value={summary.izin} />
          <Stat label="Sakit" value={summary.sakit} />
          <Stat label="Alfa" value={summary.alpha} />
          <Stat label="Terlambat" value={summary.terlambat} />
          <Stat label="Kehadiran" value={`${summary.persentase}%`} />
        </div>
      ) : null}

      <Card>
        <div className={styles.stack}>
          <div className={styles.actions}>
            <Input label="Cari nama/NIS" onChange={(event) => setQuery(event.target.value)} value={query} />
            <Button onClick={markAllPresent} variant="secondary">Tandai Semua Hadir</Button>
            <Button disabled={saving} onClick={saveAttendance}>{saving ? "Menyimpan..." : "Simpan Absensi"}</Button>
            <Link href={`/dashboard/guru/pertemuan/${meetingId}/absensi/cetak`}>
              <Button variant="outline">Cetak</Button>
            </Link>
          </div>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>NIS</th>
                  <th>Nama</th>
                  <th>Status</th>
                  <th>Catatan</th>
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((row) => (
                  <tr key={row.student.id}>
                    <td>{row.student.nis}</td>
                    <td>{row.student.user.profile?.fullName || row.student.user.username}</td>
                    <td>
                      <select
                        onChange={(event) => updateRow(row.student.id, { status: event.target.value as Status })}
                        value={row.status}
                      >
                        {data.statuses.map((status) => <option key={status}>{status}</option>)}
                      </select>
                    </td>
                    <td>
                      <input
                        onChange={(event) => updateRow(row.student.id, { note: event.target.value })}
                        placeholder="Opsional"
                        value={row.note}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles.studentCards}>
            {filteredRows.map((row) => (
              <div className={styles.studentCard} key={row.student.id}>
                <strong>{row.student.user.profile?.fullName || row.student.user.username}</strong>
                <span>{row.student.nis} / {row.student.nisn}</span>
                <label className={styles.field}>
                  <span>Status</span>
                  <select onChange={(event) => updateRow(row.student.id, { status: event.target.value as Status })} value={row.status}>
                    {data.statuses.map((status) => <option key={status}>{status}</option>)}
                  </select>
                </label>
                <Input label="Catatan" onChange={(event) => updateRow(row.student.id, { note: event.target.value })} value={row.note} />
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
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
