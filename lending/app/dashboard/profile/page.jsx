"use client";

import { useState, useEffect } from "react";
import styles from "./profile.module.css";

const HOME_OWNERSHIP_OPTIONS = [
  { value: 0, label: "Rent" },
  { value: 1, label: "Own" },
  { value: 2, label: "Mortgage" },
  { value: 3, label: "Other" },
];

export default function ProfilePage() {
  const [form, setForm] = useState({
    name: "",
    bio: "",
    age: "",
    income: "",
    home_ownership: 0,
    employment_duration: "",
    prev_default: false,
    cred_hist_length: "",
    lender_status: false,
    max_amount: "",
    min_lender_interest_rate: "",
    max_lender_interest_rate: "",
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isExistingProfile, setIsExistingProfile] = useState(false);
  const [status, setStatus] = useState({ success: false, message: "", error: "" });

  // Load existing profile if any
  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch("/api/profile");
        const data = await res.json();
        if (res.ok && data.profile) {
          const p = data.profile;
          setIsExistingProfile(true);
          setForm({
            name: p.name || "",
            bio: p.bio || "",
            age: p.age ?? "",
            income: p.income ?? "",
            home_ownership: p.home_ownership ?? 0,
            employment_duration: p.employment_duration ?? "",
            prev_default: p.prev_default ?? false,
            cred_hist_length: p.cred_hist_length ?? "",
            lender_status: p.lender_status ?? false,
            max_amount: p.max_amount ?? "",
            min_lender_interest_rate: p.min_lender_interest_rate ?? "",
            max_lender_interest_rate: p.max_lender_interest_rate ?? "",
          });
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: parseInt(value, 10),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus({ success: false, message: "", error: "" });

    // Client-side validation
    const ageNum = parseInt(form.age, 10);
    const incomeNum = parseFloat(form.income);
    const empDurNum = parseInt(form.employment_duration, 10);
    const credHistNum = parseInt(form.cred_hist_length, 10);

    if (isNaN(ageNum) || ageNum < 18 || ageNum > 120) {
      setStatus({ success: false, message: "", error: "Please enter a valid age (18 or older)." });
      setSubmitting(false);
      return;
    }

    if (isNaN(incomeNum) || incomeNum < 0) {
      setStatus({ success: false, message: "", error: "Please enter a valid positive income." });
      setSubmitting(false);
      return;
    }

    if (isNaN(empDurNum) || empDurNum < 0) {
      setStatus({ success: false, message: "", error: "Please enter a valid employment duration." });
      setSubmitting(false);
      return;
    }

    if (isNaN(credHistNum) || credHistNum < 0) {
      setStatus({ success: false, message: "", error: "Please enter a valid credit history length." });
      setSubmitting(false);
      return;
    }

    if (form.lender_status) {
      const maxAmt = parseFloat(form.max_amount);
      const minRate = parseFloat(form.min_lender_interest_rate);
      const maxRate = parseFloat(form.max_lender_interest_rate);

      if (isNaN(maxAmt) || maxAmt <= 0) {
        setStatus({ success: false, message: "", error: "Please enter a valid maximum loan amount offer." });
        setSubmitting(false);
        return;
      }

      if (isNaN(minRate) || minRate < 0 || minRate > 100) {
        setStatus({ success: false, message: "", error: "Please enter a valid minimum interest rate (0% - 100%)." });
        setSubmitting(false);
        return;
      }

      if (isNaN(maxRate) || maxRate < 0 || maxRate > 100) {
        setStatus({ success: false, message: "", error: "Please enter a valid maximum interest rate (0% - 100%)." });
        setSubmitting(false);
        return;
      }

      if (minRate > maxRate) {
        setStatus({ success: false, message: "", error: "Minimum interest rate cannot exceed the maximum interest rate." });
        setSubmitting(false);
        return;
      }
    }

    try {
      const res = await fetch("/api/profile", {
        method: isExistingProfile ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to save profile.");
      }

      setIsExistingProfile(true);
      setStatus({ success: true, message: data.message || "Profile saved successfully!", error: "" });
    } catch (err) {
      setStatus({ success: false, message: "", error: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center text-[#6B5E45] font-semibold animate-pulse">
          Loading Profile Information...
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 px-4 py-8 bg-[#F8F5F0]">
      <div className={styles.profileContainer}>
        
        {/* Header Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-[#16120A] tracking-tight">
            User Profile
          </h1>
          <p className="text-sm text-[#6B5E45]">
            Configure your personal details and financial metrics to align with borrowing or lending parameters.
          </p>
        </div>

        <div className={styles.profileCard}>
          <form onSubmit={handleSubmit}>
            
            {/* Warning Message */}
            <div className="mb-6 p-4 rounded-xl border border-amber-200 bg-amber-50 text-amber-900 text-xs font-medium flex items-start gap-2">
              <span className="text-amber-500 text-sm mt-0.5">⚠️</span>
              <div>
                <strong>Important:</strong> Please fill out all profile details carefully. Some fields may not be editable in the future due to risk scoring and validation rules.
              </div>
            </div>

            {/* ── SECTION: PERSONAL DETAILS ── */}
            <h2 className={styles.sectionTitle}>
              <i className="bi bi-person-fill text-[#C8841A]"></i> Personal Details
            </h2>
            <div className={styles.formGrid}>
              
              <div className={`${styles.fieldGroup} ${styles.fullWidth}`}>
                <label htmlFor="name" className={styles.formLabel}>Full Name</label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className={styles.formControl}
                  required
                />
                <span className={styles.descriptor}>Your name as it appears on official documents.</span>
              </div>

              <div className={styles.fieldGroup}>
                <label htmlFor="age" className={styles.formLabel}>Age (in Years)</label>
                <input
                  id="age"
                  type="number"
                  name="age"
                  min="18"
                  max="120"
                  value={form.age}
                  onChange={handleChange}
                  placeholder="e.g. 28"
                  className={styles.formControl}
                  required
                />
                <span className={styles.descriptor}>You must be 18 years or older to participate.</span>
              </div>

              <div className={`${styles.fieldGroup} ${styles.fullWidth}`}>
                <label htmlFor="bio" className={styles.formLabel}>Bio / Description</label>
                <textarea
                  id="bio"
                  name="bio"
                  value={form.bio}
                  onChange={handleChange}
                  placeholder="Tell us a bit about your borrowing/lending needs..."
                  className={styles.formControl}
                  rows="3"
                  required
                />
                <span className={styles.descriptor}>A short summary to help other members understand your profile.</span>
              </div>

            </div>

            {/* ── SECTION: FINANCIAL METRICS ── */}
            <h2 className={styles.sectionTitle}>
              <i className="bi bi-wallet2 text-[#C8841A]"></i> Financial Metrics
            </h2>
            <div className={styles.formGrid}>

              <div className={styles.fieldGroup}>
                <label htmlFor="income" className={styles.formLabel}>Annual Income (INR)</label>
                <input
                  id="income"
                  type="number"
                  name="income"
                  min="0"
                  step="any"
                  value={form.income}
                  onChange={handleChange}
                  placeholder="e.g. 600000"
                  className={styles.formControl}
                  required
                />
                <span className={styles.descriptor}>Your total gross annual earnings.</span>
              </div>

              <div className={styles.fieldGroup}>
                <label htmlFor="home_ownership" className={styles.formLabel}>Home Ownership</label>
                <select
                  id="home_ownership"
                  name="home_ownership"
                  value={form.home_ownership}
                  onChange={handleSelectChange}
                  className={styles.formControl}
                  required
                >
                  {HOME_OWNERSHIP_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <span className={styles.descriptor}>Your current residential status.</span>
              </div>

              <div className={styles.fieldGroup}>
                <label htmlFor="employment_duration" className={styles.formLabel}>Employment Duration (Months)</label>
                <input
                  id="employment_duration"
                  type="number"
                  name="employment_duration"
                  min="0"
                  value={form.employment_duration}
                  onChange={handleChange}
                  placeholder="e.g. 24"
                  className={styles.formControl}
                  required
                />
                <span className={styles.descriptor}>How long you have worked in your current employment (in months).</span>
              </div>

              <div className={styles.fieldGroup}>
                <label htmlFor="cred_hist_length" className={styles.formLabel}>Credit History Length (Years)</label>
                <input
                  id="cred_hist_length"
                  type="number"
                  name="cred_hist_length"
                  min="0"
                  value={form.cred_hist_length}
                  onChange={handleChange}
                  placeholder="e.g. 5"
                  className={styles.formControl}
                  required
                />
                <span className={styles.descriptor}>Number of years since your first credit account was opened.</span>
              </div>

              <div className={`${styles.fieldGroup} ${styles.fullWidth}`}>
                <div className={styles.switchWrapper}>
                  <div className={styles.switchText}>
                    <span className={styles.switchTitle}>Previous Defaults</span>
                    <span className={styles.switchDesc}>Toggle if you have ever defaulted on a loan in the past.</span>
                  </div>
                  <input
                    type="checkbox"
                    name="prev_default"
                    checked={form.prev_default}
                    onChange={handleChange}
                    className={styles.switchInput}
                    disabled={isExistingProfile}
                  />
                </div>
              </div>

            </div>

            {/* ── SECTION: LENDER SETTINGS ── */}
            <h2 className={styles.sectionTitle}>
              <i className="bi bi-bank text-[#C8841A]"></i> Lending Options
            </h2>
            <div className={styles.fieldGroup}>
              <div className={styles.switchWrapper}>
                <div className={styles.switchText}>
                  <span className={styles.switchTitle}>Lender Status</span>
                  <span className={styles.switchDesc}>Enable this if you wish to list offers and lend money to other users.</span>
                </div>
                <input
                  type="checkbox"
                  name="lender_status"
                  checked={form.lender_status}
                  onChange={handleChange}
                  className={styles.switchInput}
                />
              </div>
            </div>

            {form.lender_status && (
              <div className={`${styles.formGrid} ${styles.expandArea} mt-4`}>
                <div className={`${styles.fieldGroup} ${styles.fullWidth}`}>
                  <label htmlFor="max_amount" className={styles.formLabel}>Maximum Loan Amount Offer (INR)</label>
                  <input
                    id="max_amount"
                    type="number"
                    name="max_amount"
                    min="1"
                    step="any"
                    value={form.max_amount}
                    onChange={handleChange}
                    placeholder="e.g. 500000"
                    className={styles.formControl}
                    required={form.lender_status}
                  />
                  <span className={styles.descriptor}>The absolute maximum amount you are willing to offer as a loan.</span>
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor="min_lender_interest_rate" className={styles.formLabel}>Min Lender Interest Rate (%)</label>
                  <input
                    id="min_lender_interest_rate"
                    type="number"
                    name="min_lender_interest_rate"
                    min="0"
                    max="100"
                    step="0.01"
                    value={form.min_lender_interest_rate}
                    onChange={handleChange}
                    placeholder="e.g. 5.5"
                    className={styles.formControl}
                    required={form.lender_status}
                  />
                  <span className={styles.descriptor}>Minimum interest rate you are willing to offer.</span>
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor="max_lender_interest_rate" className={styles.formLabel}>Max Lender Interest Rate (%)</label>
                  <input
                    id="max_lender_interest_rate"
                    type="number"
                    name="max_lender_interest_rate"
                    min="0"
                    max="100"
                    step="0.01"
                    value={form.max_lender_interest_rate}
                    onChange={handleChange}
                    placeholder="e.g. 15.0"
                    className={styles.formControl}
                    required={form.lender_status}
                  />
                  <span className={styles.descriptor}>Maximum interest rate you are willing to offer.</span>
                </div>
              </div>
            )}

            {/* Error Message */}
            {status.error && (
              <div role="alert" className="p-3 text-xs font-semibold text-red-800 bg-red-50 border border-red-200 rounded-lg mt-6">
                ⚠️ {status.error}
              </div>
            )}

            {/* Success Message */}
            {status.success && (
              <div role="status" className="p-3 text-xs font-semibold text-green-800 bg-green-50 border border-green-200 rounded-lg mt-6">
                🎉 {status.message}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className={styles.btnSubmit}
            >
              {submitting ? "Saving Profile..." : "Save Profile Details"}
            </button>

          </form>
        </div>

      </div>
    </div>
  );
}
