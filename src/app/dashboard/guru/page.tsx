import DashboardLayout from "@/components/dashboard/dashboard-layout";

export default function GuruDashboardPage() {
  return (
    <DashboardLayout role="guru">
      <div>
        <h1 style={{ marginBottom: "1rem" }}>Dashboard Guru</h1>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem",
          marginTop: "1.5rem",
        }}>
          <div style={{ backgroundColor: "#fff", padding: "1.5rem", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
            <h3 style={{ color: "#4a5568" }}>Mata Pelajaran</h3>
            <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#2b6cb0" }}>1</p>
          </div>
          <div style={{ backgroundColor: "#fff", padding: "1.5rem", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
            <h3 style={{ color: "#4a5568" }}>Rombel</h3>
            <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#2b6cb0" }}>1</p>
          </div>
          <div style={{ backgroundColor: "#fff", padding: "1.5rem", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
            <h3 style={{ color: "#4a5568" }}>Pertemuan</h3>
            <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#2b6cb0" }}>2</p>
          </div>
          <div style={{ backgroundColor: "#fff", padding: "1.5rem", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
            <h3 style={{ color: "#4a5568" }}>Siswa</h3>
            <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#2b6cb0" }}>1</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
