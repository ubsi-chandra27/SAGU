"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { Badge, Button, Card, Input } from "@/components/ui";
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
  const [items, setItems] = useState<unknown[]>([]);
  const [refs, setRefs] = useState<Record<string, unknown[]>>(staticOptions);
  const [form, setForm] = useState<Record<string, string | boolean>>(emptyForm(config.fields));
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; tone: "danger" | "success" | "info" } | null>(null);
  const [pendingArchive, setPendingArchive] = useState<unknown | null>(null);

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
      setMessage({ tone: "danger", text: error instanceof Error ? error.message : "Data gagal dimuat" });
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
      setMessage({ tone: "danger", text: error instanceof Error ? error.message : "Referensi gagal dimuat" });
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
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm(config.fields));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const payload = Object.fromEntries(
        Object.entries(form).filter(([, value]) => value !== "")
      );
      const endpoint = editingId ? `${config.endpoint}/${editingId}` : config.endpoint;
      await fetchJson(endpoint, {
        body: JSON.stringify(payload),
        method: editingId ? "PUT" : "POST",
      });
      setMessage({ tone: "success", text: editingId ? "Data berhasil diperbarui" : "Data berhasil dibuat" });
      resetForm();
      await loadData();
      await loadRefs();
    } catch (error) {
      setMessage({ tone: "danger", text: error instanceof Error ? error.message : "Data gagal disimpan" });
    } finally {
      setSaving(false);
    }
  }

  async function archiveItem() {
    if (!pendingArchive) return;
    setSaving(true);
    try {
      await fetchJson(`${config.endpoint}/${getValue(pendingArchive, "id")}`, { method: "DELETE" });
      setMessage({ tone: "success", text: "Data berhasil diarsipkan" });
      setPendingArchive(null);
      await loadData();
    } catch (error) {
      setMessage({ tone: "danger", text: error instanceof Error ? error.message : "Data gagal diarsipkan" });
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

      {message ? (
        <Card>
          <div className={styles.message}>
            <Badge tone={message.tone}>{message.text}</Badge>
            <Button onClick={() => setMessage(null)} size="sm" variant="ghost">Tutup</Button>
          </div>
        </Card>
      ) : null}

      <Card>
        <form className={styles.stack} onSubmit={handleSubmit}>
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
          <div className={styles.actions}>
            <Button disabled={saving} type="submit">{saving ? "Menyimpan..." : editingId ? "Simpan Perubahan" : "Tambah"}</Button>
            {editingId ? <Button disabled={saving} onClick={resetForm} variant="outline">Batal</Button> : null}
          </div>
        </form>
      </Card>

      {entity === "students" ? <StudentImportPanel onImported={loadData} /> : null}

      <Card>
        <div className={styles.stack}>
          <div className={styles.toolbar}>
            <Input label="Cari" onChange={(event) => setSearch(event.target.value)} value={search} />
            <label className={styles.checkbox}>
              <input checked={showArchived} onChange={(event) => setShowArchived(event.target.checked)} type="checkbox" />
              Tampilkan arsip
            </label>
            <Button disabled={loading} onClick={loadData} variant="outline">Muat</Button>
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
                          <div className={styles.actions}>
                            <Button onClick={() => startEdit(item)} size="sm" variant="outline">Ubah</Button>
                            {!getValue(item, "deletedAt") ? (
                              <Button onClick={() => setPendingArchive(item)} size="sm" variant="ghost">Arsip</Button>
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
                      <Button onClick={() => startEdit(item)} size="sm" variant="outline">Ubah</Button>
                      {!getValue(item, "deletedAt") ? (
                        <Button onClick={() => setPendingArchive(item)} size="sm" variant="ghost">Arsip</Button>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </Card>

      {pendingArchive ? (
        <div className={styles.dialogBackdrop} role="presentation">
          <div aria-modal="true" className={styles.dialog} role="dialog">
            <h2>Konfirmasi arsip</h2>
            <p>Data akan disembunyikan dari daftar operasional, tetapi tidak dihapus permanen.</p>
            <div className={styles.actions}>
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
      setMessage(error instanceof Error ? error.message : "Preview import gagal");
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
      setPreview(null);
      setFile(null);
      await onImported();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Import gagal disimpan");
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
