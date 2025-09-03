// src/components/doctor/PrescriptionForm.jsx
import React, { useState } from "react";
import api from "../../services/api";

export default function PrescriptionForm({ appointmentId, onDone }) {
  const [title, setTitle] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [advice, setAdvice] = useState("");
  const [meds, setMeds] = useState([
    { name: "", dose: "", frequency: "", duration: "", notes: "" },
  ]);
  const [attachments, setAttachments] = useState([{ url: "", name: "" }]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  const setMed = (i, key, val) => {
    const copy = meds.slice();
    copy[i][key] = val;
    setMeds(copy);
  };

  const addMed = () =>
    setMeds([
      ...meds,
      { name: "", dose: "", frequency: "", duration: "", notes: "" },
    ]);
  const delMed = (i) => setMeds(meds.filter((_, idx) => idx !== i));

  const setAtt = (i, key, val) => {
    const copy = attachments.slice();
    copy[i][key] = val;
    setAttachments(copy);
  };
  const addAtt = () => setAttachments([...attachments, { url: "", name: "" }]);
  const delAtt = (i) =>
    setAttachments(attachments.filter((_, idx) => idx !== i));

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setOk("");
    try {
      setBusy(true);
      await api.post("/prescriptions", {
        appointmentId,
        title,
        diagnosis,
        meds: meds.filter((m) => m.name?.trim()),
        advice,
        attachments: attachments.filter((a) => a.url?.trim()),
      });
      setOk("Prescription saved ✅");
      if (onDone) onDone();
      // optional: reset
      // setTitle(""); setDiagnosis(""); setAdvice(""); setMeds([...]); setAttachments([...]);
    } catch (e) {
      setErr(
        e.response?.data?.message || e.message || "Failed to save prescription"
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4 bg-white p-2 sm:p-4 rounded-xl border">
      <div className="font-semibold">Write Prescription</div>

      {err && <div className="text-red-600 text-sm">{err}</div>}
      {ok && <div className="text-emerald-700 text-sm">{ok}</div>}

      <div>
        <label className="block text-sm mb-1">Title</label>
        <input
          className="w-full border rounded px-3 py-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Flu Prescription"
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Diagnosis</label>
        <textarea
          className="w-full border rounded px-3 py-2"
          rows={3}
          value={diagnosis}
          onChange={(e) => setDiagnosis(e.target.value)}
        />
      </div>

      <div>
        <div className="text-sm font-medium mb-2">Medicines</div>
        <div className="space-y-3">
          {meds.map((m, i) => (
            <div key={i} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2">
              <input
                className="border rounded px-2 py-2"
                placeholder="Name"
                value={m.name}
                onChange={(e) => setMed(i, "name", e.target.value)}
              />
              <input
                className="border rounded px-2 py-2"
                placeholder="Dose (e.g., 500mg)"
                value={m.dose}
                onChange={(e) => setMed(i, "dose", e.target.value)}
              />
              <input
                className="border rounded px-2 py-2"
                placeholder="Frequency (e.g., 2x/day)"
                value={m.frequency}
                onChange={(e) => setMed(i, "frequency", e.target.value)}
              />
              <input
                className="border rounded px-2 py-2"
                placeholder="Duration (e.g., 5 days)"
                value={m.duration}
                onChange={(e) => setMed(i, "duration", e.target.value)}
              />
              <div className="flex gap-2">
                <input
                  className="border rounded px-2 py-2 flex-1"
                  placeholder="Notes"
                  value={m.notes}
                  onChange={(e) => setMed(i, "notes", e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => delMed(i)}
                  className="px-3 rounded border"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addMed}
          className="mt-2 text-sm underline"
        >
          + Add medicine
        </button>
      </div>

      <div>
        <div className="text-sm font-medium mb-2">Attachments (optional)</div>
        {attachments.map((a, i) => (
          <div key={i} className="grid md:grid-cols-2 gap-2 mb-2">
            <input
              className="border rounded px-2 py-2"
              placeholder="URL"
              value={a.url}
              onChange={(e) => setAtt(i, "url", e.target.value)}
            />
            <div className="flex gap-2">
              <input
                className="border rounded px-2 py-2 flex-1"
                placeholder="Name (optional)"
                value={a.name}
                onChange={(e) => setAtt(i, "name", e.target.value)}
              />
              <button
                type="button"
                onClick={() => delAtt(i)}
                className="px-3 rounded border"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
        <button type="button" onClick={addAtt} className="text-sm underline">
          + Add attachment
        </button>
      </div>

      <div>
        <label className="block text-sm mb-1">Advice</label>
        <textarea
          className="w-full border rounded px-3 py-2"
          rows={3}
          value={advice}
          onChange={(e) => setAdvice(e.target.value)}
        />
      </div>

      <button
        disabled={busy}
        className="px-4 py-2 rounded bg-emerald-600 text-white disabled:opacity-60"
      >
        {busy ? "Saving…" : "Save Prescription"}
      </button>
    </form>
  );
}
