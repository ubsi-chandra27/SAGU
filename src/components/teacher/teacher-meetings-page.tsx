"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { Badge, Button, Card, Input } from "@/components/ui";
import { PageHeader, RoleBadge } from "@/components/dashboard/dashboard-widgets";
import styles from "./teacher-attendance.module.css";

type Assignment = {
  id: string;
  academicYear: { name: string };
  class: { name: string };
  meetings: { id: string; meetingDate: string; meetingNumber: number; topicSummary: string | null }[];
  rombel: { name: string; _count: { students: number } };
  semester: { name: string };
  subject: { name: string };
};

type Meeting = {
  attendances: unknown[];
  id: string;
  meetingDate: string;
  meetingNumber: number;
  startTime: string;
  endTime: string;
  topicSummary: string | null;
  teachingAssignment: Assignment;
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

function dateOnly(value: Date) {
  return value.toISOString().slice(0, 10);
}

function timeOnly(value: Date) {
  return value.toTimeString().slice(0, 5);
}

export function TeacherMeetingsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [message, setMessage] = useState<{ text: string; tone: "danger" | "success" | "info" } | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    endTime: "09:30",
    meetingDate: dateOnly(new Date()),
    meetingNumber: "1",
    startTime: "08:00",
    teachingAssignmentId: "",
    topicSummary: "",
  });

  async function loadData() {
    setLoading(true);
    try {
      const [assignmentData, meetingData] = await Promise.all([
        fetchJson<Assignment[]>("/api/v1/guru/assignments"),
        fetchJson<Meeting[]>("/api/v1/guru/meetings"),
      ]);
      setAssignments(assignmentData);
      setMeetings(meetingData);
      setForm((current) => ({
        ...current,
        teachingAssignmentId: current.teachingAssignmentId || assignmentData[0]?.id || "",
      }));
    } catch (error) {
      setMessage({ tone: "danger", text: error instanceof Error ? error.message : "Data gagal dimuat" });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const meeting = await fetchJson<Meeting>("/api/v1/guru/meetings", {
        body: JSON.stringify(form),
        method: "POST",
      });
      window.location.href = `/dashboard/guru/pertemuan/${meeting.id}/absensi`;
    } catch (error) {
      setMessage({ tone: "danger", text: error instanceof Error ? error.message : "Pertemuan gagal dibuat" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className={styles.stack}>
      <PageHeader
        badge={<RoleBadge tone="success">Guru</RoleBadge>}
        description="Pilih penugasan, mulai pertemuan, lalu isi absensi siswa per pertemuan."
        title="Pertemuan Mengajar"
      />

      {message ? <Badge tone={message.tone}>{message.text}</Badge> : null}

      <Card>
        <form className={styles.stack} onSubmit={handleSubmit}>
          <div className={styles.grid}>
            <label className={styles.field}>
              <span>Penugasan mengajar</span>
              <select
                onChange={(event) => setForm((current) => ({ ...current, teachingAssignmentId: event.target.value }))}
                required
                value={form.teachingAssignmentId}
              >
                <option value="">Pilih penugasan</option>
                {assignments.map((assignment) => (
                  <option key={assignment.id} value={assignment.id}>
                    {assignment.subject.name} - {assignment.rombel.name} ({assignment.semester.name})
                  </option>
                ))}
              </select>
            </label>
            <Input label="Nomor pertemuan" min={1} onChange={(event) => setForm((current) => ({ ...current, meetingNumber: event.target.value }))} required type="number" value={form.meetingNumber} />
            <Input label="Tanggal" onChange={(event) => setForm((current) => ({ ...current, meetingDate: event.target.value }))} required type="date" value={form.meetingDate} />
            <Input label="Waktu mulai" onChange={(event) => setForm((current) => ({ ...current, startTime: event.target.value }))} required type="time" value={form.startTime} />
            <Input label="Waktu selesai" onChange={(event) => setForm((current) => ({ ...current, endTime: event.target.value }))} required type="time" value={form.endTime} />
            <label className={styles.field}>
              <span>Topik atau materi singkat</span>
              <textarea onChange={(event) => setForm((current) => ({ ...current, topicSummary: event.target.value }))} required value={form.topicSummary} />
            </label>
          </div>
          <Button disabled={saving || assignments.length === 0} type="submit">
            {saving ? "Membuat..." : "Mulai Pertemuan"}
          </Button>
        </form>
      </Card>

      <Card>
        <div className={styles.stack}>
          <h2>Penugasan Saya</h2>
          {loading ? (
            <div className={styles.empty}>Memuat penugasan...</div>
          ) : assignments.length === 0 ? (
            <div className={styles.empty}>Belum ada penugasan mengajar. Hubungi Admin.</div>
          ) : (
            <div className={styles.grid}>
              {assignments.map((assignment) => (
                <Card key={assignment.id}>
                  <div className={styles.stack}>
                    <Badge tone="info">{assignment.subject.name}</Badge>
                    <strong>{assignment.rombel.name}</strong>
                    <p className={styles.meta}>{assignment.academicYear.name} - {assignment.semester.name} - {assignment.rombel._count.students} siswa</p>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </Card>

      <Card>
        <div className={styles.stack}>
          <h2>Pertemuan Terakhir</h2>
          {meetings.length === 0 ? (
            <div className={styles.empty}>Belum ada pertemuan.</div>
          ) : (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Pertemuan</th>
                    <th>Tanggal</th>
                    <th>Mapel/Rombel</th>
                    <th>Topik</th>
                    <th>Absensi</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {meetings.map((meeting) => (
                    <tr key={meeting.id}>
                      <td>{meeting.meetingNumber}</td>
                      <td>{new Date(meeting.meetingDate).toLocaleDateString("id-ID")} {timeOnly(new Date(meeting.startTime))}-{timeOnly(new Date(meeting.endTime))}</td>
                      <td>{meeting.teachingAssignment.subject.name} / {meeting.teachingAssignment.rombel.name}</td>
                      <td>{meeting.topicSummary || "-"}</td>
                      <td><Badge tone={meeting.attendances.length ? "success" : "warning"}>{meeting.attendances.length ? "Sudah" : "Belum"}</Badge></td>
                      <td>
                        <div className={styles.actions}>
                          <Link href={`/dashboard/guru/pertemuan/${meeting.id}/absensi`}>
                            <Button size="sm" variant="outline">Absensi</Button>
                          </Link>
                          <Link href={`/dashboard/guru/pertemuan/${meeting.id}/absensi/cetak`}>
                            <Button size="sm" variant="ghost">Cetak</Button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
