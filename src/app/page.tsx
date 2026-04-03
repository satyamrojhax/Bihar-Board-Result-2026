"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Search,
  Loader2,
  AlertCircle,
  X,
  ArrowRight,
  Clock,
  Trash2,
  Eye,
  Award,
  History,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useFirebaseContext } from "@/contexts/FirebaseContext";
import type { HistoryItem } from "@/lib/resultService";

export default function Home() {
  const [rollCode, setRollCode] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { history, loading: firebaseLoading, deleteHistoryItem, clearAllHistory } = useFirebaseContext();
  const router = useRouter();

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError("");

      if (!rollCode.trim() || !rollNo.trim()) {
        setError("Please enter both Roll Code and Roll Number");
        return;
      }

      setLoading(true);

      try {
        const response = await fetch(
          `/api/result?roll_code=${encodeURIComponent(rollCode.trim())}&roll_no=${encodeURIComponent(rollNo.trim())}`
        );
        const data = await response.json();

        if (data.success && data.data) {
          sessionStorage.setItem("bseb_result", JSON.stringify(data.data));
          router.push(
            `/result?roll_code=${encodeURIComponent(rollCode.trim())}&roll_no=${encodeURIComponent(rollNo.trim())}`
          );
        } else {
          setError(
            data.error ||
              "Result not found. Please check your Roll Code and Roll Number."
          );
        }
      } catch {
        setError("Network error. Please check your internet connection and try again.");
      } finally {
        setLoading(false);
      }
    },
    [rollCode, rollNo, router]
  );

  const handleViewResult = useCallback(
    (entry: HistoryItem) => {
      router.push(
        `/result?roll_code=${encodeURIComponent(entry.rollCode)}&roll_no=${encodeURIComponent(entry.rollNo)}`
      );
    },
    [router]
  );

  const handleRemoveHistory = useCallback(
    async (e: React.MouseEvent, entry: HistoryItem) => {
      e.stopPropagation();
      try {
        if (entry.id) {
          await deleteHistoryItem(entry.id);
        }
      } catch (error) {
        console.error('Failed to remove history item:', error);
      }
    },
    [deleteHistoryItem]
  );

  const handleClearHistory = useCallback(async () => {
    try {
      await clearAllHistory();
    } catch (error) {
      console.error('Failed to clear history:', error);
    }
  }, [clearAllHistory]);

  const timeAgo = useCallback((timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(timestamp).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F7]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-[#E5E5EA]/50 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div
              className="flex items-center gap-2 sm:gap-3 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => router.push('/')}
            >
              <Image
                src="/bseb-logo.png"
                alt="BSEB Logo"
                width={32}
                height={32}
                className="rounded-lg sm:w-10 sm:h-10"
              />
              <div className="hidden xs:block">
                <h1 className="text-sm sm:text-lg font-semibold text-[#1D1D1F] leading-tight tracking-tight">
                  BSEB Result Portal
                </h1>
                <p className="text-[10px] sm:text-xs text-[#6E6E73] leading-tight">
                  Bihar School Examination Board
                </p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-1 sm:gap-2 text-[10px] sm:text-xs text-[#6E6E73]">
              <div className="px-2 py-1 rounded-full bg-[#E8F9EE] text-[#34C759] font-medium text-[10px]">
                Annual Secondary Examination 2026
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <section className="relative overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0071E3]/[0.03] via-transparent to-transparent" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] sm:w-[800px] h-[300px] sm:h-[400px] bg-[#0071E3]/[0.04] rounded-full blur-3xl" />
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute bottom-0 left-0 right-0 h-32 sm:h-48 bg-gradient-to-t from-white to-transparent z-10" />
            <Image
              src="/bseb-building.jpeg"
              alt="BSEB Building"
              fill
              className="object-cover object-top opacity-[0.07]"
              priority
            />
          </div>

          <div className="relative max-w-[1400px] mx-auto px-3 sm:px-6 lg:px-8 pt-8 sm:pt-12 lg:pt-16 pb-8 sm:pb-12 lg:pb-16">
            {/* Title */}
            <div className="text-center mb-6 sm:mb-10 lg:mb-12 animate-fade-in-up">
              <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[#0071E3]/[0.08] text-[#0071E3] text-xs sm:text-sm font-medium mb-4 sm:mb-6">
                <Image src="/bseb-logo.png" alt="BSEB" width={14} height={14} className="rounded sm:w-5 sm:h-5" />
                <span className="hidden xs:inline sm:inline">Class 10th Matriculation Result</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-[#1D1D1F] tracking-tight leading-tight mb-3 sm:mb-4">
                Check Your Result
              </h2>
              <p className="text-sm sm:text-base lg:text-lg text-[#6E6E73] max-w-md mx-auto leading-relaxed px-4 xs:px-0">
                Enter your Roll Code and Roll Number to get your Bihar Board Class 10th result instantly
              </p>
            </div>{/* ← closes title div */}

            {/* Search Form */}
            <div className="max-w-lg sm:max-w-xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
              <form
                onSubmit={handleSubmit}
                className="bg-white rounded-2xl p-4 sm:p-6 lg:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-shadow duration-300"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mb-5 sm:mb-6">
                  <div className="space-y-2 sm:space-y-2.5">
                    <Label htmlFor="rollCode" className="text-sm font-medium text-[#1D1D1F]">
                      Roll Code
                    </Label>
                    <Input
                      id="rollCode"
                      type="text"
                      placeholder="e.g. 12365"
                      value={rollCode}
                      onChange={(e) => setRollCode(e.target.value)}
                      className="h-11 sm:h-12 text-base rounded-xl border-[#E5E5EA] bg-[#F5F5F7]/50 focus:bg-white focus:border-[#0071E3] focus:ring-[#0071E3]/20 transition-all duration-200 placeholder:text-[#AEAEB2]"
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2 sm:space-y-2.5">
                    <Label htmlFor="rollNo" className="text-sm font-medium text-[#1D1D1F]">
                      Roll Number
                    </Label>
                    <Input
                      id="rollNo"
                      type="text"
                      placeholder="e.g. 2600000"
                      value={rollNo}
                      onChange={(e) => setRollNo(e.target.value)}
                      className="h-11 sm:h-12 text-base rounded-xl border-[#E5E5EA] bg-[#F5F5F7]/50 focus:bg-white focus:border-[#0071E3] focus:ring-[#0071E3]/20 transition-all duration-200 placeholder:text-[#AEAEB2]"
                      disabled={loading}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 text-base font-semibold rounded-xl bg-[#0071E3] hover:bg-[#0077ED] text-white shadow-[0_4px_14px_rgba(0,113,227,0.35)] hover:shadow-[0_6px_20px_rgba(0,113,227,0.45)] transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:hover:translate-y-0 disabled:shadow-none"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Fetching Result...
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5 mr-2" />
                      Get Result
                      <ArrowRight className="w-5 h-5 ml-1" />
                    </>
                  )}
                </Button>

                {error && (
                  <div className="mt-4 flex items-start gap-3 p-4 rounded-xl bg-[#FFEFEE] border border-[#FF3B30]/10 animate-slide-down">
                    <AlertCircle className="w-5 h-5 text-[#FF3B30] shrink-0 mt-0.5" />
                    <p className="text-sm text-[#FF3B30]">{error}</p>
                    <button
                      onClick={() => setError("")}
                      className="shrink-0 ml-auto text-[#FF3B30]/60 hover:text-[#FF3B30] transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </form>
              <p className="text-center text-xs text-[#AEAEB2] mt-4">
                Roll Code and Roll Number are available on your admit card
              </p>
            </div>

            {/* Result History */}
            {history.length > 0 && (
              <div className="max-w-3xl mx-auto mt-8 sm:mt-12 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <History className="w-4 h-4 sm:w-5 sm:h-5 text-[#0071E3]" />
                    <h3 className="text-base sm:text-lg font-semibold text-[#1D1D1F]">
                      Recent Results
                    </h3>
                    <span className="text-xs text-[#6E6E73] bg-[#F5F5F7] px-2 py-0.5 rounded-full">
                      {history.length}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearHistory}
                    className="text-xs text-[#FF3B30] hover:text-[#FF3B30] hover:bg-[#FFEFEE] rounded-lg gap-1 sm:gap-1.5 h-7 sm:h-8"
                  >
                    <Trash2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    <span className="hidden sm:inline">Clear All</span>
                  </Button>
                </div>

                <div className="space-y-2 max-h-[280px] sm:max-h-[340px] overflow-y-auto pr-1">
                  {history.map((entry) => (
                    <div
                      key={entry.id || `${entry.rollCode}-${entry.rollNo}-${entry.createdAt}`}
                      onClick={() => handleViewResult(entry)}
                      className="w-full group bg-white rounded-xl p-3 sm:p-4 shadow-[0_1px_4px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] border border-transparent hover:border-[#0071E3]/20 transition-all duration-200 text-left cursor-pointer"
                    >
                      <div className="flex items-start justify-between gap-2 sm:gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                            <span className="text-sm font-semibold text-[#1D1D1F] truncate">
                              {entry.name}
                            </span>
                            <span
                              className={`text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full shrink-0 ${
                                entry.division?.includes("1st")
                                  ? "bg-[#E8F9EE] text-[#34C759]"
                                  : entry.division?.includes("2nd")
                                    ? "bg-[#EBF5FF] text-[#0071E3]"
                                    : "bg-[#FFF7E5] text-[#FF9F0A]"
                              }`}
                            >
                              {entry.division || 'N/A'}
                            </span>
                          </div>
                          <p className="text-xs text-[#6E6E73] truncate mb-1">
                            {entry.schoolName}
                          </p>
                          <div className="flex items-center gap-3 sm:gap-4 text-xs text-[#6E6E73]">
                            <span className="flex items-center gap-1">
                              <span className="font-medium">{entry.rollCode}</span>
                              <span>•</span>
                              <span>{entry.rollNo}</span>
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {timeAgo(entry.createdAt)}
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => handleRemoveHistory(e, entry)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-[#FF3B30] hover:text-[#FF3B30] hover:bg-[#FFEFEE] rounded-lg h-7 w-7 sm:h-8 sm:w-8 flex-shrink-0"
                        >
                          <X className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* How to check */}
            <div className="mt-16 max-w-3xl mx-auto">
              <h3 className="text-xl sm:text-2xl font-semibold text-[#1D1D1F] mb-2 text-center">
                How to Check Your Result
              </h3>
              <p className="text-sm text-[#6E6E73] text-center mb-8">Follow these simple steps</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                {[
                  { step: 1, title: "Find Roll Code", desc: "Get your 5-digit Roll Code from your admit card" },
                  { step: 2, title: "Enter Roll Number", desc: "Enter your 7-digit Roll Number printed on the admit card" },
                  { step: 3, title: "View Result", desc: "Click 'Get Result' to view your detailed marks sheet" },
                ].map((item) => (
                  <div
                    key={item.step}
                    className="group bg-white rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#0071E3] text-white flex items-center justify-center text-lg font-bold mb-4 group-hover:scale-110 transition-transform duration-300">
                      {item.step}
                    </div>
                    <h4 className="text-base font-semibold text-[#1D1D1F] mb-1.5">{item.title}</h4>
                    <p className="text-sm text-[#6E6E73] leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>{/* ← closes max-w-[1400px] inner wrapper */}
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-auto bg-white border-t border-[#E5E5EA]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Image src="/bseb-logo.png" alt="BSEB" width={24} height={24} className="rounded-md" />
              <span className="text-xs text-[#6E6E73]">Bihar School Examination Board, Patna</span>
            </div>
            <p className="text-xs text-[#AEAEB2]">
              Designed &amp; Developed by <span className="font-medium text-[#0071E3]">Satyam Rojha</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}