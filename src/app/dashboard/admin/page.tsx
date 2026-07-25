import DashboardLayout from "@/components/dashboard/dashboard-layout";

export default function AdminDashboardPage() {
  return (
    <DashboardLayout role="admin">
      <div>
        <h1 style={{ marginBottom: "1rem" }}>Dashboard Admin</h1>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem",
          marginTop: "1.5rem",
        }}>
          <div style={{ backgroundColor: "#fff", padding: "1.5rem", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
            <h3 style={{ color: "#4a5568" }}>Total Pengguna</h3>
            <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#2b6cb0" }}>5</p>
          </div>
          <div style={{ backgroundColor: "#fff", padding: "1.5rem", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
            <h3 style={{ color: "#4a5568" }}>Total Siswa</h3>
            <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#2b6cb0" }}>1</p>
          </div>
          <div style={{ backgroundColor: "#fff", padding: "1.5rem", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
            <h3 style={{ color: "#4a5568" }}>Total Guru</h3>
            <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#2b6cb0" }}>1</p>
          </div>
          <div style={{ backgroundColor: "#fff", padding: "1.5rem", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
            <h3 style={{ color: "#4a5568" }}>Rombel Aktif</h3>
            <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#2b6cb0" }}>1</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
