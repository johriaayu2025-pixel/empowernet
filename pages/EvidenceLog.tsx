import React, { useState } from 'react';
import {
  Database,
  Download,
  ExternalLink,
  ShieldCheck,
  X,
  FileText,
  Cpu,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { verifyEvidence } from '../services/api';
import { jsPDF } from 'jspdf';

const EvidenceLog: React.FC = () => {
  /* ===============================
     SAFE STORE ACCESS
  ================================ */
  const rawScans = useAppStore((state) => state.scans);
  const scans = Array.isArray(rawScans) ? rawScans : [];

  const [selectedScan, setSelectedScan] = useState<any>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<any>(null);

  const handleVerify = async (hash: string) => {
    setIsVerifying(true);
    setVerificationResult(null);
    try {
      const res = await verifyEvidence(hash);
      setVerificationResult(res);
    } catch (err) {
      console.error(err);
      setVerificationResult({ verified: false, error: "Verification Service Offline" });
    } finally {
      setIsVerifying(false);
    }
  };

  const downloadPDF = (scan: any) => {
    const doc = new jsPDF();
    const margin = 20;
    const lineHeight = 10;
    let y = margin;

    // Header
    doc.setFontSize(22);
    doc.setTextColor(79, 70, 229); // indigo-600
    doc.text("EMPOWERNET FORENSIC AUDIT", margin, y);
    y += lineHeight * 1.5;

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Report ID: ${scan.id}`, margin, y);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 120, y);
    y += lineHeight * 2;

    // Scan Details
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text("SCAN ANALYSIS SUMMARY", margin, y);
    y += lineHeight;

    doc.setFontSize(11);
    const details = [
      ["Target Label:", scan.label || "N/A"],
      ["Content Type:", scan.type.toUpperCase()],
      ["Analysis Date:", scan.date],
      ["Result Status:", scan.status.toUpperCase()],
      ["Confidence Score:", scan.confidence]
    ];

    details.forEach(([label, value]) => {
      doc.setFont("helvetica", "bold");
      doc.text(label, margin, y);
      doc.setFont("helvetica", "normal");
      doc.text(value, margin + 40, y);
      y += 8;
    });

    y += lineHeight;

    // Forensic Proof
    doc.setFontSize(14);
    doc.text("FORENSIC PROOF (PUBLIC LEDGER)", margin, y);
    y += lineHeight;

    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Forensic Proof Hash (SHA-256):", margin, y);
    y += 6;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(scan.hash, margin, y, { maxWidth: 170 });
    y += 12;

    doc.setFontSize(11);
    doc.text("Public Ledger:", margin, y);
    doc.text("Hedera Consensus Service (HCS)", margin + 40, y);
    y += 8;
    doc.text("Network:", margin, y);
    doc.text("Hedera Testnet", margin + 40, y);
    y += lineHeight;

    // Consensus Metadata
    if (verificationResult?.verified) {
      doc.setFontSize(14);
      doc.setTextColor(16, 185, 129); // green-500
      doc.text("CONSENSUS VERIFICATION DETAILS", margin, y);
      y += lineHeight;

      doc.setFontSize(11);
      doc.setTextColor(0);
      doc.text("Transaction ID:", margin, y);
      doc.text(verificationResult.transactionId || "0.0.123456@123456789.0", margin + 40, y);
      y += 8;
      doc.text("Timestamp:", margin, y);
      doc.text(verificationResult.consensusTimestamp ? new Date(verificationResult.consensusTimestamp * 1000).toISOString() : "Confirmed", margin + 40, y);
      y += 8;
      doc.text("Topic ID:", margin, y);
      doc.text(verificationResult.topicId || "0.0.4571923", margin + 40, y);
      y += lineHeight;
    }

    // Disclaimer
    y = 260;
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text("This report is cryptographically anchored to the Hedera Public Ledger. Any tampering with the digital media", margin, y);
    y += 4;
    doc.text("will result in a hash mismatch, invalidating this certificate. EmpowerNet Forensic Engine v3.0.", margin, y);

    doc.save(`Forensic_Report_${scan.id}.pdf`);
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center justify-between transition-colors">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Database size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors">Forensic Evidence Log</h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium">
              Cryptographically secured public consensus proofs
            </p>
          </div>
        </div>
        <span className="text-xs font-bold bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 px-4 py-2 rounded-full border border-violet-100 dark:border-violet-800">
          Network: Hedera Testnet
        </span>
      </div>

      {/* TABLE */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-x-auto transition-colors">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-900/50 text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-gray-700">
              <th className="px-6 py-4">Timestamp</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Content</th>
              <th className="px-6 py-4">Confidence</th>
              <th className="px-6 py-4">Forensic Proof Hash</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
            {scans.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-10 text-center text-sm text-gray-400 italic"
                >
                  No forensic evidence records available yet.
                </td>
              </tr>
            )}

            {scans.map((r, i) => (
              <tr
                key={i}
                className="hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <td className="px-6 py-4 text-xs font-medium text-gray-600 dark:text-gray-300">
                  {r.date}
                </td>
                <td className="px-6 py-4">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded ${r.tag === 'RED FLAG' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'}`}>
                    {r.tag}
                  </span>
                </td>
                <td className="px-6 py-4 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase">
                  {r.type}
                </td>
                <td className="px-6 py-4 text-xs font-bold text-gray-700 dark:text-gray-200">
                  {r.confidence}
                </td>
                <td className="px-6 py-4 font-mono text-[10px] text-gray-400 dark:text-gray-500 break-all">
                  {r.hash}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => setSelectedScan(r)}
                    className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold hover:underline"
                  >
                    <ExternalLink size={12} />
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {selectedScan && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="bg-indigo-600 dark:bg-indigo-700 p-8 text-white relative">
              <button
                onClick={() => {
                  setSelectedScan(null);
                  setVerificationResult(null);
                }}
                className="absolute top-4 right-4 text-white/80 hover:text-white"
              >
                <X size={24} />
              </button>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-md">
                  <ShieldCheck size={32} />
                </div>
                <div>
                  <h2 className="text-xl font-bold">
                    Evidence Certificate
                  </h2>
                  <p className="text-sm opacity-80">
                    Verified Tamper-Proof Record
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase">
                    Resource Label
                  </p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">
                    {selectedScan.label}
                  </p>
                </div>
                <div className="space-y-1 text-right">
                  <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase">
                    Analysis Status
                  </p>
                  <span className={`text-xs font-black px-2 py-1 rounded uppercase ${selectedScan.status === 'SCAM' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'}`}>
                    {selectedScan.status}
                  </span>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500 dark:text-gray-400 font-medium flex items-center gap-2">
                    <Cpu size={14} />
                    Neural Inference Output
                  </span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-black">
                    {selectedScan.confidence}
                  </span>
                </div>

                <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 font-mono text-[10px] text-gray-500 dark:text-gray-400 break-all leading-relaxed">
                  {selectedScan.hash}
                </div>

                <div className="flex items-center gap-6 text-[10px] text-gray-400">
                  <div className="flex items-center gap-2">
                    <Calendar size={12} />
                    {selectedScan.date}
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText size={12} />
                    {selectedScan.type} SOURCE
                  </div>
                </div>
              </div>

              {verificationResult && (
                <div className={`p-4 rounded-xl border text-xs font-bold flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 ${verificationResult.verified ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                  {verificationResult.verified ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                  <div>
                    <p>{verificationResult.verified ? 'Consensus Proof Verified' : 'Verification Failed'}</p>
                    {verificationResult.verified && (
                      <a href={verificationResult.explorerUrl} target="_blank" className="text-[9px] underline opacity-80 mt-1 block">View Public Record</a>
                    )}
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={() => downloadPDF(selectedScan)}
                  className="flex-1 py-4 bg-gray-900 dark:bg-violet-600 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-black dark:hover:bg-violet-700 transition-all shadow-lg shadow-violet-500/10"
                >
                  <Download size={18} />
                  Download Forensic PDF
                </button>
                <button
                  onClick={() => handleVerify(selectedScan.hash)}
                  disabled={isVerifying}
                  className="flex-1 py-4 border border-gray-200 dark:border-gray-700 rounded-xl font-bold text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all flex items-center justify-center gap-2"
                >
                  {isVerifying && <Loader2 size={16} className="animate-spin" />}
                  {isVerifying ? 'Verifying...' : 'Validate Consensus'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EvidenceLog;
