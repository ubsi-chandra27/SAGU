"use client";

import type { CSSProperties, FormEvent } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Badge, Button, Card, Input } from "@/components/ui";
import { tokens } from "@/styles/tokens";
import styles from "./academic-period-manager.module.css";

type Semester = {
  academicYearId: string;
  deletedAt: string | null;
  endDate: string;
  id: string;
  isActive: boolean;
  name: string;
  startDate: string;
};

type AcademicYear = {
  deletedAt: string | null;
  endDate: string;
  id: string;
  isActive: boolean;
  name: string;
  semesters?: Semester[];
  startDate: string;
};

type YearForm = {
  endDate: string;
  isActive: boolean;
  name: string;
  startDate: string;
};

type SemesterForm = YearForm;

type Message = {
  text: string;
  tone: "success" | "danger" | "info";
} | null;

type ArchiveRequest =
  | { item: AcademicYear; type: "year" }
  | { item: Semester; type: "semester" }
  | null;

const emptyYearForm: YearForm = {
  endDate: "",
  isActive: false,
  name: "",
  startDate: "",
};

const emptySemesterForm: SemesterForm = {
  endDate: "",
  isActive: false,
  name: "",
  startDate: "",
};

const cssVars = {
  "--color-primary": tokens.color.primary,
  "--color-primary-soft": tokens.color.primarySoft,
  "--color-surface": tokens.color.surface,
  "--color-surface-muted": tokens.color.surfaceMuted,
  "--color-text-primary": tokens.color.textPrimary,
  "--color-text-secondary": tokens.color.textSecondary,
  "--color-border": tokens.color.border,
  "--color-divider": tokens.color.divider,
} as CSSProperties;

async function requestJson<T>(url: string, init?: RequestInit) {
  const response = await fetch(url, {
    cache: "no-store",
    headers: init?.body ? { "Content-Type": "application/json" } : undefined,
    ...init,
  });
  const payload = await response.json();

  if (!response.ok || !payload.success) {
    throw new Error(payload.message || "Permintaan gagal diproses");
  }

  return payload.data as T;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00.000Z`));
}

function periodStatus(deletedAt: string | null, isActive: boolean) {
  if (deletedAt) return <Badge tone="neutral">Arsip</Badge>;
  if (isActive) return <Badge tone="success">Aktif</Badge>;
  return <Badge tone="info">Tersedia</Badge>;
}

export function AcademicPeriodManager() {
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [selectedYearId, setSelectedYearId] = useState("");
  const [editingYearId, setEditingYearId] = useState<string | null>(null);
  const [editingSemesterId, setEditingSemesterId] = useState<string | null>(null);
  const [yearForm, setYearForm] = useState<YearForm>(emptyYearForm);
  const [semesterForm, setSemesterForm] = useState<SemesterForm>(emptySemesterForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [message, setMessage] = useState<Message>(null);
  const [archiveRequest, setArchiveRequest] = useState<ArchiveRequest>(null);

  const selectedYear = useMemo(
    () => academicYears.find((year) => year.id === selectedYearId) || null,
    [academicYears, selectedYearId]
  );
  const semesters = selectedYear?.semesters || [];

  const loadPeriods = useCallback(async (nextSelectedYearId?: string) => {
    setLoading(true);
    try {
      const query = showArchived ? "?includeArchived=true" : "";
      const data = await requestJson<AcademicYear[]>(`/api/v1/tahun-ajaran${query}`);
      setAcademicYears(data);

      const fallback =
        nextSelectedYearId ||
        data.find((year) => year.isActive && !year.deletedAt)?.id ||
        data.find((year) => !year.deletedAt)?.id ||
        data[0]?.id ||
        "";

      setSelectedYearId(fallback);
    } finally {
      setLoading(false);
    }
  }, [showArchived]);

  useEffect(() => {
    loadPeriods().catch((error) => {
      setLoading(false);
      setMessage({
        tone: "danger",
        text: error instanceof Error ? error.message : "Data periode gagal dimuat.",
      });
    });
  }, [loadPeriods]);

  function resetYearForm() {
    setEditingYearId(null);
    setYearForm(emptyYearForm);
  }

  function resetSemesterForm() {
    setEditingSemesterId(null);
    setSemesterForm(emptySemesterForm);
  }

  function refreshActivePeriod() {
    window.dispatchEvent(new Event("sagu-active-period-changed"));
  }

  function toggleArchived(checked: boolean) {
    setShowArchived(checked);
  }

  async function handleYearSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      if (editingYearId) {
        await requestJson<AcademicYear>(`/api/v1/tahun-ajaran/${editingYearId}`, {
          body: JSON.stringify(yearForm),
          method: "PUT",
        });
        setMessage({ tone: "success", text: "Tahun ajaran berhasil diperbarui." });
      } else {
        const created = await requestJson<AcademicYear>("/api/v1/tahun-ajaran", {
          body: JSON.stringify(yearForm),
          method: "POST",
        });
        setSelectedYearId(created.id);
        setMessage({ tone: "success", text: "Tahun ajaran berhasil dibuat." });
      }

      const nextSelectedId = editingYearId || selectedYearId;
      resetYearForm();
      await loadPeriods(nextSelectedId);
      if (yearForm.isActive) refreshActivePeriod();
    } catch (error) {
      setMessage({
        tone: "danger",
        text: error instanceof Error ? error.message : "Tahun ajaran gagal disimpan.",
      });
    } finally {
      setSaving(false);
    }
  }

  async function handleSemesterSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedYear) return;

    setSaving(true);
    setMessage(null);

    const payload = {
      ...semesterForm,
      academicYearId: selectedYear.id,
    };

    try {
      if (editingSemesterId) {
        await requestJson<Semester>(`/api/v1/semester/${editingSemesterId}`, {
          body: JSON.stringify(payload),
          method: "PUT",
        });
        setMessage({ tone: "success", text: "Semester berhasil diperbarui." });
      } else {
        await requestJson<Semester>("/api/v1/semester", {
          body: JSON.stringify(payload),
          method: "POST",
        });
        setMessage({ tone: "success", text: "Semester berhasil dibuat." });
      }

      resetSemesterForm();
      await loadPeriods(selectedYear.id);
      if (semesterForm.isActive) refreshActivePeriod();
    } catch (error) {
      setMessage({
        tone: "danger",
        text: error instanceof Error ? error.message : "Semester gagal disimpan.",
      });
    } finally {
      setSaving(false);
    }
  }

  function startEditYear(year: AcademicYear) {
    setEditingYearId(year.id);
    setYearForm({
      endDate: year.endDate,
      isActive: year.isActive,
      name: year.name,
      startDate: year.startDate,
    });
  }

  function startEditSemester(semester: Semester) {
    setEditingSemesterId(semester.id);
    setSemesterForm({
      endDate: semester.endDate,
      isActive: semester.isActive,
      name: semester.name,
      startDate: semester.startDate,
    });
  }

  async function activateYear(year: AcademicYear) {
    setSaving(true);
    setMessage(null);

    try {
      await requestJson<AcademicYear>(`/api/v1/tahun-ajaran/${year.id}/activate`, {
        method: "POST",
      });
      await loadPeriods(year.id);
      refreshActivePeriod();
      setMessage({ tone: "success", text: `${year.name} berhasil diaktifkan.` });
    } catch (error) {
      setMessage({
        tone: "danger",
        text: error instanceof Error ? error.message : "Tahun ajaran gagal diaktifkan.",
      });
    } finally {
      setSaving(false);
    }
  }

  async function activateSemester(semester: Semester) {
    setSaving(true);
    setMessage(null);

    try {
      await requestJson<Semester>(`/api/v1/semester/${semester.id}/activate`, {
        method: "POST",
      });
      await loadPeriods(semester.academicYearId);
      refreshActivePeriod();
      setMessage({ tone: "success", text: `${semester.name} berhasil diaktifkan.` });
    } catch (error) {
      setMessage({
        tone: "danger",
        text: error instanceof Error ? error.message : "Semester gagal diaktifkan.",
      });
    } finally {
      setSaving(false);
    }
  }

  function archiveYear(year: AcademicYear) {
    setArchiveRequest({ type: "year", item: year });
  }

  function archiveSemester(semester: Semester) {
    setArchiveRequest({ type: "semester", item: semester });
  }

  async function confirmArchive() {
    if (!archiveRequest) return;
    setSaving(true);
    setMessage(null);

    try {
      if (archiveRequest.type === "year") {
        const year = archiveRequest.item;
        await requestJson<AcademicYear>(`/api/v1/tahun-ajaran/${year.id}`, {
          method: "DELETE",
        });
        await loadPeriods();
        refreshActivePeriod();
        setMessage({ tone: "success", text: `${year.name} berhasil diarsipkan.` });
      } else {
        const semester = archiveRequest.item;
        await requestJson<Semester>(`/api/v1/semester/${semester.id}`, {
          method: "DELETE",
        });
        await loadPeriods(semester.academicYearId);
        refreshActivePeriod();
        setMessage({ tone: "success", text: `${semester.name} berhasil diarsipkan.` });
      }

      setArchiveRequest(null);
    } catch (error) {
      const fallback =
        archiveRequest.type === "year"
          ? "Tahun ajaran gagal diarsipkan."
          : "Semester gagal diarsipkan.";
      setMessage({
        tone: "danger",
        text: error instanceof Error ? error.message : fallback,
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className={styles.manager} style={cssVars}>
      {message ? (
        <div className={styles.message} role="status">
          <Badge tone={message.tone}>{message.text}</Badge>
        </div>
      ) : null}

      <div className={styles.panelGrid}>
        <Card>
          <form className={styles.form} onSubmit={handleYearSubmit}>
            <div>
              <h2 className={styles.sectionTitle}>
                {editingYearId ? "Ubah Tahun Ajaran" : "Tambah Tahun Ajaran"}
              </h2>
              <p className={styles.sectionDescription}>
                Gunakan format nama singkat seperti 2026/2027.
              </p>
            </div>
            <div className={styles.formGrid}>
              <Input
                disabled={saving}
                label="Nama tahun ajaran"
                maxLength={20}
                onChange={(event) =>
                  setYearForm((current) => ({ ...current, name: event.target.value }))
                }
                required
                value={yearForm.name}
              />
              <Input
                disabled={saving}
                label="Tanggal mulai"
                onChange={(event) =>
                  setYearForm((current) => ({
                    ...current,
                    startDate: event.target.value,
                  }))
                }
                required
                type="date"
                value={yearForm.startDate}
              />
              <Input
                disabled={saving}
                label="Tanggal selesai"
                onChange={(event) =>
                  setYearForm((current) => ({ ...current, endDate: event.target.value }))
                }
                required
                type="date"
                value={yearForm.endDate}
              />
              <label className={styles.checkboxLabel}>
                <input
                  checked={yearForm.isActive}
                  disabled={saving}
                  onChange={(event) =>
                    setYearForm((current) => ({
                      ...current,
                      isActive: event.target.checked,
                    }))
                  }
                  type="checkbox"
                />
                Jadikan tahun ajaran aktif
              </label>
            </div>
            <div className={styles.actions}>
              <Button disabled={saving} type="submit" variant="primary">
                {saving ? "Menyimpan..." : editingYearId ? "Simpan Perubahan" : "Tambah"}
              </Button>
              {editingYearId ? (
                <Button
                  disabled={saving}
                  onClick={resetYearForm}
                  type="button"
                  variant="outline"
                >
                  Batal
                </Button>
              ) : null}
            </div>
          </form>
        </Card>

        <Card>
          <div className={styles.cardStack}>
            <div className={styles.tableHeader}>
              <div>
                <h2 className={styles.sectionTitle}>Daftar Tahun Ajaran</h2>
                <p className={styles.sectionDescription}>
                  Pilih tahun ajaran untuk mengelola semester di dalamnya.
                </p>
              </div>
              <label className={styles.checkboxLabel}>
                <input
                  checked={showArchived}
                  disabled={saving || loading}
                  onChange={(event) => toggleArchived(event.target.checked)}
                  type="checkbox"
                />
                Tampilkan arsip
              </label>
            </div>

            {loading ? (
              <p className={styles.sectionDescription}>Memuat tahun ajaran...</p>
            ) : academicYears.length === 0 ? (
              <div className={styles.emptyState}>Belum ada tahun ajaran.</div>
            ) : (
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Nama</th>
                      <th>Periode</th>
                      <th>Status</th>
                      <th>Semester</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {academicYears.map((year) => (
                      <tr
                        className={`${year.isActive ? styles.rowActive : ""} ${
                          year.deletedAt ? styles.rowArchived : ""
                        }`}
                        key={year.id}
                      >
                        <td>
                          <button
                            className={styles.rowButton}
                            onClick={() => setSelectedYearId(year.id)}
                            type="button"
                          >
                            {year.name}
                          </button>
                        </td>
                        <td>
                          {formatDate(year.startDate)} - {formatDate(year.endDate)}
                        </td>
                        <td>
                          <span className={styles.statusStack}>
                            {periodStatus(year.deletedAt, year.isActive)}
                            {selectedYearId === year.id ? (
                              <Badge tone="neutral">Dipilih</Badge>
                            ) : null}
                          </span>
                        </td>
                        <td>{year.semesters?.length || 0}</td>
                        <td>
                          <div className={styles.rowActions}>
                            {!year.deletedAt ? (
                              <>
                                <Button
                                  disabled={saving}
                                  onClick={() => startEditYear(year)}
                                  size="sm"
                                  type="button"
                                  variant="outline"
                                >
                                  Ubah
                                </Button>
                                {!year.isActive ? (
                                  <Button
                                    disabled={saving}
                                    onClick={() => activateYear(year)}
                                    size="sm"
                                    type="button"
                                    variant="secondary"
                                  >
                                    Aktifkan
                                  </Button>
                                ) : null}
                                <Button
                                  disabled={saving}
                                  onClick={() => archiveYear(year)}
                                  size="sm"
                                  type="button"
                                  variant="ghost"
                                >
                                  Arsipkan
                                </Button>
                              </>
                            ) : (
                              <Badge tone="neutral">Sudah arsip</Badge>
                            )}
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

      <div className={styles.panelGrid}>
        <Card>
          <form className={styles.form} onSubmit={handleSemesterSubmit}>
            <div>
              <h2 className={styles.sectionTitle}>
                {editingSemesterId ? "Ubah Semester" : "Tambah Semester"}
              </h2>
              <p className={styles.sectionDescription}>
                Semester harus berada dalam rentang tahun ajaran yang dipilih.
              </p>
            </div>
            <label className={styles.selectField}>
              <span>Tahun ajaran</span>
              <select
                disabled={saving || academicYears.length === 0}
                onChange={(event) => {
                  setSelectedYearId(event.target.value);
                  resetSemesterForm();
                }}
                value={selectedYearId}
              >
                {academicYears.map((year) => (
                  <option key={year.id} value={year.id}>
                    {year.name}
                    {year.deletedAt ? " (arsip)" : ""}
                  </option>
                ))}
              </select>
            </label>
            <div className={styles.formGrid}>
              <Input
                disabled={saving || !selectedYear || Boolean(selectedYear.deletedAt)}
                label="Nama semester"
                maxLength={10}
                onChange={(event) =>
                  setSemesterForm((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
                required
                value={semesterForm.name}
              />
              <Input
                disabled={saving || !selectedYear || Boolean(selectedYear.deletedAt)}
                label="Tanggal mulai"
                max={selectedYear?.endDate}
                min={selectedYear?.startDate}
                onChange={(event) =>
                  setSemesterForm((current) => ({
                    ...current,
                    startDate: event.target.value,
                  }))
                }
                required
                type="date"
                value={semesterForm.startDate}
              />
              <Input
                disabled={saving || !selectedYear || Boolean(selectedYear.deletedAt)}
                label="Tanggal selesai"
                max={selectedYear?.endDate}
                min={selectedYear?.startDate}
                onChange={(event) =>
                  setSemesterForm((current) => ({
                    ...current,
                    endDate: event.target.value,
                  }))
                }
                required
                type="date"
                value={semesterForm.endDate}
              />
              <label className={styles.checkboxLabel}>
                <input
                  checked={semesterForm.isActive}
                  disabled={saving || !selectedYear || Boolean(selectedYear.deletedAt)}
                  onChange={(event) =>
                    setSemesterForm((current) => ({
                      ...current,
                      isActive: event.target.checked,
                    }))
                  }
                  type="checkbox"
                />
                Jadikan semester aktif
              </label>
            </div>
            <div className={styles.actions}>
              <Button
                disabled={saving || !selectedYear || Boolean(selectedYear.deletedAt)}
                type="submit"
                variant="primary"
              >
                {saving
                  ? "Menyimpan..."
                  : editingSemesterId
                    ? "Simpan Perubahan"
                    : "Tambah"}
              </Button>
              {editingSemesterId ? (
                <Button
                  disabled={saving}
                  onClick={resetSemesterForm}
                  type="button"
                  variant="outline"
                >
                  Batal
                </Button>
              ) : null}
            </div>
          </form>
        </Card>

        <Card>
          <div className={styles.cardStack}>
            <div className={styles.semesterHeader}>
              <div>
                <h2 className={styles.sectionTitle}>Daftar Semester</h2>
                <p className={styles.sectionDescription}>
                  {selectedYear
                    ? `Semester untuk tahun ajaran ${selectedYear.name}.`
                    : "Pilih tahun ajaran terlebih dahulu."}
                </p>
              </div>
              {selectedYear ? periodStatus(selectedYear.deletedAt, selectedYear.isActive) : null}
            </div>

            {!selectedYear ? (
              <div className={styles.emptyState}>Belum ada tahun ajaran yang dipilih.</div>
            ) : semesters.length === 0 ? (
              <div className={styles.emptyState}>Belum ada semester.</div>
            ) : (
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Nama</th>
                      <th>Periode</th>
                      <th>Status</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {semesters.map((semester) => (
                      <tr
                        className={`${semester.isActive ? styles.rowActive : ""} ${
                          semester.deletedAt ? styles.rowArchived : ""
                        }`}
                        key={semester.id}
                      >
                        <td>{semester.name}</td>
                        <td>
                          {formatDate(semester.startDate)} - {formatDate(semester.endDate)}
                        </td>
                        <td>{periodStatus(semester.deletedAt, semester.isActive)}</td>
                        <td>
                          <div className={styles.rowActions}>
                            {!semester.deletedAt && !selectedYear.deletedAt ? (
                              <>
                                <Button
                                  disabled={saving}
                                  onClick={() => startEditSemester(semester)}
                                  size="sm"
                                  type="button"
                                  variant="outline"
                                >
                                  Ubah
                                </Button>
                                {!semester.isActive ? (
                                  <Button
                                    disabled={saving}
                                    onClick={() => activateSemester(semester)}
                                    size="sm"
                                    type="button"
                                    variant="secondary"
                                  >
                                    Aktifkan
                                  </Button>
                                ) : null}
                                <Button
                                  disabled={saving}
                                  onClick={() => archiveSemester(semester)}
                                  size="sm"
                                  type="button"
                                  variant="ghost"
                                >
                                  Arsipkan
                                </Button>
                              </>
                            ) : (
                              <Badge tone="neutral">Sudah arsip</Badge>
                            )}
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

      {archiveRequest ? (
        <div
          aria-labelledby="archive-period-title"
          aria-modal="true"
          className={styles.dialogBackdrop}
          role="dialog"
        >
          <div className={styles.dialog}>
            <div>
              <h2 className={styles.sectionTitle} id="archive-period-title">
                Konfirmasi Arsip
              </h2>
              <p className={styles.sectionDescription}>
                {archiveRequest.type === "year"
                  ? `Arsipkan tahun ajaran ${archiveRequest.item.name}? Semester di dalamnya ikut diarsipkan.`
                  : `Arsipkan semester ${archiveRequest.item.name}?`}
              </p>
            </div>
            <div className={styles.actions}>
              <Button disabled={saving} onClick={confirmArchive} type="button" variant="danger">
                {saving ? "Mengarsipkan..." : "Arsipkan"}
              </Button>
              <Button
                disabled={saving}
                onClick={() => setArchiveRequest(null)}
                type="button"
                variant="outline"
              >
                Batal
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
