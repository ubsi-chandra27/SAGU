"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { Badge, Button, Card, Input, useToast } from "@/components/ui";
import { DashboardIcon } from "@/components/dashboard/dashboard-icons";
import { PageHeader, RoleBadge } from "@/components/dashboard/dashboard-widgets";
import styles from "./master-data-page.module.css";

type EntityKey =
  | "classes"
  | "rombels"
  | "students"
  | "subjects"
  | "teachers"
  | "teaching-assignments";

type FieldType = "checkbox" | "email" | "number" | "password" | "select" | "textarea" | "text";

type FieldConfig = {
  label: string;
  name: string;
  optionLabel?: string;
  optionSource?: string;
  optionValue?: string;
  required?: boolean;
  type?: FieldType;
  valuePath?: string;
};

type ColumnConfig = {
  label: string;
  path: string;
};

type EntityConfig = {
  columns: ColumnConfig[];
  description: string;
  endpoint: string;
  fields: FieldConfig[];
  title: string;
};

type ApiPayload<T> = {
  data: T;
  message: string;
  success: boolean;
};

const configs: Record<EntityKey, EntityConfig> = {
  subjects: {
    title: "Mata Pelajaran",
    description: "Kelola mata pelajaran sebagai dasar penugasan mengajar dan absensi.",
    endpoint: "/api/v1/admin/master/subjects",
    fields: [
      { label: "Kode", name: "code", required: true },
      { label: "Nama", name: "name", required: true },
      { label: "Deskripsi", name: "description", type: "textarea" },
    ],
    columns: [
      { label: "Kode", path: "code" },
      { label: "Nama", path: "name" },
      { label: "Deskripsi", path: "description" },
    ],
  },
  teachers: {
    title: "Data Guru",
    description: "Kelola akun guru aktif yang dapat menerima penugasan mengajar.",
    endpoint: "/api/v1/admin/master/teachers",
    fields: [
      { label: "Nama lengkap", name: "fullName", required: true, valuePath: "user.profile.fullName" },
      { label: "Username", name: "username", required: true, valuePath: "user.username" },
      { label: "Email", name: "email", required: true, type: "email", valuePath: "user.email" },
      { label: "Password awal", name: "password", required: true, type: "password" },
      { label: "NIP", name: "nip" },
      { label: "Spesialisasi", name: "specialization" },
      { label: "Aktif", name: "isActive", type: "checkbox", valuePath: "user.isActive" },
    ],
    columns: [
      { label: "Nama", path: "user.profile.fullName" },
      { label: "Username", path: "user.username" },
      { label: "Email", path: "user.email" },
      { label: "NIP", path: "nip" },
      { label: "Status", path: "user.isActive" },
    ],
  },
  classes: {
    title: "Kelas",
    description: "Kelola tingkat kelas pada tahun ajaran aktif.",
    endpoint: "/api/v1/admin/master/classes",
    fields: [
      { label: "Nama kelas", name: "name", required: true },
      { label: "Tingkat", name: "level", required: true },
      { label: "Tahun ajaran", name: "academicYearId", optionLabel: "name", optionSource: "academicYears", required: true, type: "select" },
      { label: "Semester", name: "semesterId", optionLabel: "name", optionSource: "semesters", type: "select" },
      { label: "Kapasitas", name: "capacity", type: "number" },
    ],
    columns: [
      { label: "Nama", path: "name" },
      { label: "Tingkat", path: "level" },
      { label: "Tahun Ajaran", path: "academicYear.name" },
      { label: "Semester", path: "semester.name" },
      { label: "Kapasitas", path: "capacity" },
    ],
  },
  rombels: {
    title: "Rombel",
    description: "Kelola rombongan belajar dan wali kelas opsional.",
    endpoint: "/api/v1/admin/master/rombels",
    fields: [
      { label: "Nama rombel", name: "name", required: true },
      { label: "Kelas", name: "classId", optionLabel: "name", optionSource: "classes", required: true, type: "select" },
      { label: "Tahun ajaran", name: "academicYearId", optionLabel: "name", optionSource: "academicYears", required: true, type: "select" },
      { label: "Semester", name: "semesterId", optionLabel: "name", optionSource: "semesters", required: true, type: "select" },
      { label: "Wali kelas", name: "homeroomTeacherId", optionLabel: "user.profile.fullName", optionSource: "teachers", type: "select", optionValue: "userId" },
    ],
    columns: [
      { label: "Nama", path: "name" },
      { label: "Kelas", path: "class.name" },
      { label: "Tahun Ajaran", path: "academicYear.name" },
      { label: "Semester", path: "semester.name" },
      { label: "Siswa", path: "_count.students" },
    ],
  },
  students: {
    title: "Data Siswa",
    description: "Kelola siswa, rombel aktif, dan import CSV tanpa menyimpan file upload.",
    endpoint: "/api/v1/admin/master/students",
    fields: [
      { label: "NIS", name: "nis", required: true },
      { label: "NISN", name: "nisn", required: true },
      { label: "Nama lengkap", name: "fullName", required: true, valuePath: "user.profile.fullName" },
      { label: "Gender", name: "gender", optionSource: "genders", required: true, type: "select", valuePath: "user.profile.gender" },
      { label: "Rombel", name: "rombelId", optionLabel: "name", optionSource: "rombels", type: "select" },
      { label: "Nama orang tua", name: "parentName" },
      { label: "Telepon orang tua", name: "parentPhone" },
      { label: "Email orang tua", name: "parentEmail", type: "email" },
    ],
    columns: [
      { label: "NIS", path: "nis" },
      { label: "NISN", path: "nisn" },
      { label: "Nama", path: "user.profile.fullName" },
      { label: "Gender", path: "user.profile.gender" },
      { label: "Rombel", path: "rombel.name" },
    ],
  },
  "teaching-assignments": {
    title: "Penugasan Mengajar",
    description: "Hubungkan guru, mata pelajaran, kelas, rombel, dan periode akademik.",
    endpoint: "/api/v1/admin/master/teaching-assignments",
    fields: [
      { label: "Guru", name: "teacherId", optionLabel: "user.profile.fullName", optionSource: "teachers", required: true, type: "select" },
      { label: "Mata pelajaran", name: "subjectId", optionLabel: "name", optionSource: "subjects", required: true, type: "select" },
      { label: "Kelas", name: "classId", optionLabel: "name", optionSource: "classes", required: true, type: "select" },
      { label: "Rombel", name: "rombelId", optionLabel: "name", optionSource: "rombels", required: true, type: "select" },
      { label: "Tahun ajaran", name: "academicYearId", optionLabel: "name", optionSource: "academicYears", required: true, type: "select" },
      { label: "Semester", name: "semesterId", optionLabel: "name", optionSource: "semesters", required: true, type: "select" },
    ],
    columns: [
      { label: "Guru", path: "teacher.user.profile.fullName" },
      { label: "Mapel", path: "subject.name" },
      { label: "Kelas", path: "class.name" },
      { label: "Rombel", path: "rombel.name" },
      { label: "Periode", path: "semester.name" },
    ],
  },
};

const referenceEndpoints: Record<string, string> = {
  academicYears: "/api/v1/tahun-ajaran",
  classes: "/api/v1/admin/master/classes",
  rombels: "/api/v1/admin/master/rombels",
  semesters: "/api/v1/semester",
  subjects: "/api/v1/admin/master/subjects",
  teachers: "/api/v1/admin/master/teachers",
};

const staticOptions: Record<string, { id: string; name: string }[]> = {
  genders: [
    { id: "LAKI_LAKI", name: "LAKI_LAKI" },
    { id: "PEREMPUAN", name: "PEREMPUAN" },
  ],
};

function getValue(item: unknown, path: string) {
  return path.split(".").reduce<unknown>((current, key) => {
    if (!current || typeof current !== "object") return undefined;
    return (current as Record<string, unknown>)[key];
  }, item);
}

function displayValue(item: unknown, path: string) {
  const value = getValue(item, path);
  if (typeof value === "boolean") return value ? "Aktif" : "Nonaktif";
  if (value === null || value === undefined || value === "") return "-";
  return String(value);
}

function emptyForm(fields: FieldConfig[]) {
  return fields.reduce<Record<string, string | boolean>>((acc, field) => {
    acc[field.name] = field.type === "checkbox" ? true : "";
    return acc;
  }, {});
}

async function fetchJson<T>(url: string, init?: RequestInit) {
  const response = await fetch(url, {
    cache: "no-store",
    headers: init?.body ? { "Content-Type": "application/json" } : undefined,
    ...init,
  });
  const payload = (await response.json()) as ApiPayload<T>;
  if (!response.ok || !payload.success) throw new Error(payload.message || "Permintaan gagal");
  return payload.data;
}

export function MasterDataPage({ entity }: { entity: EntityKey }) {
  const config = configs[entity];
  const entityLabel = config.title.replace(/^Data\s+/, "");
  const [items, setItems] = useState<unknown[]>([]);
  const [refs, setRefs] = useState<Record<string, unknown[]>>(staticOptions);
  const [form, setForm] = useState<Record<string, string | boolean>>(emptyForm(config.fields));
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pendingArchive, setPendingArchive] = useState<unknown | null>(null);
  const { showToast } = useToast();

  const optionSources = useMemo(
    () => [...new Set(config.fields.map((field) => field.optionSource).filter(Boolean))] as string[],
    [config.fields]
  );

  async function loadData() {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (search) query.set("search", search);
      if (showArchived) query.set("includeArchived", "true");
      const data = await fetchJson<unknown[]>(`${config.endpoint}?${query.toString()}`);
      setItems(data);
    } catch (error) {
      showToast({
        description: error instanceof Error ? error.message : "Data gagal dimuat",
        title: "Gagal memuat data",
        tone: "danger",
      });
    } finally {
      setLoading(false);
    }
  }

  async function loadRefs() {
    const nextRefs: Record<string, unknown[]> = { ...staticOptions };
    for (const source of optionSources) {
      if (referenceEndpoints[source]) {
        nextRefs[source] = await fetchJson<unknown[]>(referenceEndpoints[source]);
      }
    }
    setRefs(nextRefs);
  }

  useEffect(() => {
    loadData();
    loadRefs().catch((error) => {
      showToast({
        description: error instanceof Error ? error.message : "Referensi gagal dimuat",
        title: "Referensi gagal dimuat",
        tone: "danger",
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entity, showArchived]);

  function updateField(field: FieldConfig, value: string | boolean) {
    setForm((current) => ({ ...current, [field.name]: value }));
  }

  function startEdit(item: unknown) {
    const next = emptyForm(config.fields);
    config.fields.forEach((field) => {
      if (field.name === "password") {
        next[field.name] = "";
        return;
      }
      const value = getValue(item, field.valuePath || field.name);
      next[field.name] = field.type === "checkbox" ? Boolean(value) : String(value ?? "");
    });
    setEditingId(String(getValue(item, "id")));
    setForm(next);
    setFormOpen(true);
  }

  function startCreate() {
    setEditingId(null);
    setForm(emptyForm(config.fields));
    setFormOpen(true);
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm(config.fields));
    setFormOpen(false);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);

    try {
      const payload = Object.fromEntries(
        Object.entries(form).filter(([, value]) => value !== "")
      );
      const endpoint = editingId ? `${config.endpoint}/${editingId}` : config.endpoint;
      await fetchJson(endpoint, {
        body: JSON.stringify(payload),
        method: editingId ? "PUT" : "POST",
      });
      showToast({
        description: editingId
          ? `${config.title} berhasil diperbarui.`
          : `${config.title} berhasil ditambahkan.`,
        title: editingId ? "Perubahan tersimpan" : "Data berhasil ditambahkan",
        tone: "success",
      });
      resetForm();
      await loadData();
      await loadRefs();
    } catch (error) {
      showToast({
        description: error instanceof Error ? error.message : "Data gagal disimpan",
        title: "Data gagal disimpan",
        tone: "danger",
      });
    } finally {
      setSaving(false);
    }
  }

  async function archiveItem() {
    if (!pendingArchive) return;
    setSaving(true);
    try {
      await fetchJson(`${config.endpoint}/${getValue(pendingArchive, "id")}`, { method: "DELETE" });
      showToast({
        description: `${config.title} berhasil diarsipkan.`,
        title: "Data berhasil diarsipkan",
        tone: "success",
      });
      setPendingArchive(null);
      await loadData();
    } catch (error) {
      showToast({
        description: error instanceof Error ? error.message : "Data gagal diarsipkan",
        title: "Data gagal diarsipkan",
        tone: "danger",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className={styles.stack}>
      <PageHeader
        badge={<RoleBadge tone="info">Admin</RoleBadge>}
        description={config.description}
        title={config.title}
      />

      {entity === "students" ? <StudentImportPanel onImported={loadData} /> : null}

      <Card>
        <div className={styles.stack}>
          <div className={styles.toolbar}>
            <div className={styles.searchField}>
              <DashboardIcon name="search" />
              <Input
                label="Cari data"
                onChange={(event) => setSearch(event.target.value)}
                placeholder={`Cari ${config.title.toLowerCase()}...`}
                value={search}
              />
            </div>
            <label className={styles.filterToggle}>
              <input checked={showArchived} onChange={(event) => setShowArchived(event.target.checked)} type="checkbox" />
              <DashboardIcon name="filter" />
              Tampilkan arsip
            </label>
            <Button disabled={loading} onClick={loadData} variant="outline">
              <DashboardIcon name="filter" />
              Terapkan
            </Button>
            <Button onClick={startCreate}>
              <DashboardIcon name="plus" />
              Tambah {entityLabel}
            </Button>
          </div>

          {loading ? (
            <div className={styles.empty}>Memuat data...</div>
          ) : items.length === 0 ? (
            <div className={styles.empty}>Belum ada data.</div>
          ) : (
            <>
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      {config.columns.map((column) => <th key={column.path}>{column.label}</th>)}
                      <th>Status</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={String(getValue(item, "id"))}>
                        {config.columns.map((column) => <td key={column.path}>{displayValue(item, column.path)}</td>)}
                        <td><Badge tone={getValue(item, "deletedAt") ? "neutral" : "success"}>{getValue(item, "deletedAt") ? "Arsip" : "Aktif"}</Badge></td>
                        <td>
                          <div className={styles.rowActions}>
                            <button
                              aria-label={`Ubah ${entityLabel}`}
                              className={styles.iconButton}
                              onClick={() => startEdit(item)}
                              title="Ubah"
                              type="button"
                            >
                              <DashboardIcon name="edit" />
                            </button>
                            {!getValue(item, "deletedAt") ? (
                              <button
                                aria-label={`Arsipkan ${entityLabel}`}
                                className={`${styles.iconButton} ${styles.dangerIcon}`}
                                onClick={() => setPendingArchive(item)}
                                title="Arsipkan"
                                type="button"
                              >
                                <DashboardIcon name="archive" />
                              </button>
                            ) : null}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className={styles.mobileCards}>
                {items.map((item) => (
                  <div className={styles.mobileCard} key={String(getValue(item, "id"))}>
                    {config.columns.map((column) => (
                      <div key={column.path}><strong>{column.label}:</strong> {displayValue(item, column.path)}</div>
                    ))}
                    <div className={styles.actions}>
                      <Button onClick={() => startEdit(item)} size="sm" variant="outline">
                        <DashboardIcon name="edit" />
                        Ubah
                      </Button>
                      {!getValue(item, "deletedAt") ? (
                        <Button onClick={() => setPendingArchive(item)} size="sm" variant="ghost">
                          <DashboardIcon name="archive" />
                          Arsip
                        </Button>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </Card>

      {formOpen ? (
        <div className={styles.dialogBackdrop} role="presentation">
          <div aria-modal="true" className={styles.formDialog} role="dialog">
            <div className={styles.dialogHeader}>
              <div>
                <span>{editingId ? "Ubah data" : "Tambah data"}</span>
                <h2>{editingId ? `Ubah ${entityLabel}` : `Tambah ${entityLabel}`}</h2>
              </div>
              <button
                aria-label="Tutup form"
                className={styles.iconButton}
                onClick={resetForm}
                type="button"
              >
                <DashboardIcon name="close" />
              </button>
            </div>
            <form className={styles.formStack} onSubmit={handleSubmit}>
              <div className={styles.grid}>
                {config.fields.map((field) => (
                  <FormField
                    field={field}
                    isEditing={Boolean(editingId)}
                    key={field.name}
                    onChange={(value) => updateField(field, value)}
                    refs={refs}
                    value={form[field.name]}
                  />
                ))}
              </div>
              <div className={styles.dialogActions}>
                <Button disabled={saving} type="submit">
                  {saving ? "Menyimpan..." : editingId ? "Simpan Perubahan" : `Tambah ${entityLabel}`}
                </Button>
                <Button disabled={saving} onClick={resetForm} variant="outline">
                  Batal
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {pendingArchive ? (
        <div className={styles.dialogBackdrop} role="presentation">
          <div aria-modal="true" className={styles.dialog} role="dialog">
            <div className={styles.alertIcon}>
              <DashboardIcon name="archive" />
            </div>
            <h2>Arsipkan {entityLabel}?</h2>
            <p>Data akan disembunyikan dari daftar operasional, tetapi tidak dihapus permanen.</p>
            <div className={styles.dialogActions}>
              <Button disabled={saving} onClick={archiveItem} variant="danger">Arsipkan</Button>
              <Button disabled={saving} onClick={() => setPendingArchive(null)} variant="outline">Batal</Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function FormField({
  field,
  isEditing,
  onChange,
  refs,
  value,
}: {
  field: FieldConfig;
  isEditing: boolean;
  onChange: (value: string | boolean) => void;
  refs: Record<string, unknown[]>;
  value: string | boolean;
}) {
  if (field.type === "checkbox") {
    return (
      <label className={styles.checkbox}>
        <input checked={Boolean(value)} onChange={(event) => onChange(event.target.checked)} type="checkbox" />
        {field.label}
      </label>
    );
  }

  if (field.type === "select") {
    const options = field.optionSource ? refs[field.optionSource] || [] : [];
    return (
      <label className={styles.field}>
        <span>{field.label}{field.required ? " *" : ""}</span>
        <select
          onChange={(event) => onChange(event.target.value)}
          required={field.required}
          value={String(value)}
        >
          <option value="">Pilih {field.label}</option>
          {options.map((option) => (
            <option
              key={String(getValue(option, field.optionValue || "id"))}
              value={String(getValue(option, field.optionValue || "id"))}
            >
              {displayValue(option, field.optionLabel || "name")}
            </option>
          ))}
        </select>
      </label>
    );
  }

  if (field.type === "textarea") {
    return (
      <label className={styles.field}>
        <span>{field.label}{field.required ? " *" : ""}</span>
        <textarea
          onChange={(event) => onChange(event.target.value)}
          required={field.required}
          value={String(value)}
        />
      </label>
    );
  }

  return (
    <Input
      label={field.label}
      onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(event.target.value)}
      required={field.required && !(isEditing && field.name === "password")}
      type={field.type || "text"}
      value={String(value)}
    />
  );
}

function StudentImportPanel({ onImported }: { onImported: () => Promise<void> }) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<{
    failed: number;
    rows: { errors: string[]; line: number; valid: boolean; values: Record<string, string> }[];
    success: number;
    total: number;
  } | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  async function previewFile() {
    if (!file) return;
    setSaving(true);
    setMessage(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/v1/admin/master/students/import-preview", {
        body: formData,
        method: "POST",
      });
      const payload = await response.json();
      if (!response.ok || !payload.success) throw new Error(payload.message || "Preview gagal");
      setPreview(payload.data);
    } catch (error) {
      const description = error instanceof Error ? error.message : "Preview import gagal";
      setMessage(description);
      showToast({ description, title: "Preview import gagal", tone: "danger" });
    } finally {
      setSaving(false);
    }
  }

  async function commitImport() {
    if (!preview || preview.failed > 0) return;
    setSaving(true);
    setMessage(null);
    try {
      await fetchJson("/api/v1/admin/master/students/import-commit", {
        body: JSON.stringify({ rows: preview.rows.map((row) => row.values) }),
        method: "POST",
      });
      setMessage("Import siswa berhasil disimpan");
      showToast({
        description: "Data siswa dari CSV berhasil disimpan.",
        title: "Import siswa berhasil",
        tone: "success",
      });
      setPreview(null);
      setFile(null);
      await onImported();
    } catch (error) {
      const description = error instanceof Error ? error.message : "Import gagal disimpan";
      setMessage(description);
      showToast({ description, title: "Import gagal disimpan", tone: "danger" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <div className={styles.stack}>
        <div>
          <h2>Import Siswa CSV</h2>
          <p>Preview wajib dilakukan sebelum data disimpan. File tidak disimpan permanen.</p>
        </div>
        <div className={styles.actions}>
          <Button onClick={() => window.open("/api/v1/admin/master/students/template", "_blank")} variant="outline">Unduh Template</Button>
          <input accept=".csv,text/csv" onChange={(event) => setFile(event.target.files?.[0] || null)} type="file" />
          <Button disabled={!file || saving} onClick={previewFile} variant="secondary">Preview</Button>
        </div>
        {message ? <Badge tone={message.includes("berhasil") ? "success" : "danger"}>{message}</Badge> : null}
        {preview ? (
          <div className={styles.stack}>
            <Badge tone={preview.failed ? "warning" : "success"}>
              {preview.success} valid, {preview.failed} gagal dari {preview.total} baris
            </Badge>
            <div className={styles.importRows}>
              {preview.rows.map((row) => (
                <div className={styles.importRow} key={row.line}>
                  <strong>Baris {row.line}: {row.values.fullName || "-"}</strong>
                  <span>{row.values.nis} / {row.values.nisn} / {row.values.rombelName}</span>
                  {row.valid ? <Badge tone="success">Valid</Badge> : <Badge tone="danger">{row.errors.join(", ")}</Badge>}
                </div>
              ))}
            </div>
            <Button disabled={saving || preview.failed > 0} onClick={commitImport}>Simpan Import</Button>
          </div>
        ) : null}
      </div>
    </Card>
  );
}
