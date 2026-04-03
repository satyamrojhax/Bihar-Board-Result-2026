"use client";

import React, { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Printer,
  RotateCcw,
  Loader2,
  AlertCircle,
  Share2,
  Link2,
  Check,
  Trash2,
  Eye,
  Clock,
  Award,
  X,
  Sparkles,
  Trophy,
  Star,
  Gift,
  PartyPopper,
  Heart,
  Zap,
  Crown,
  Medal,
  Target,
  Flame,
  Rocket,
} from "lucide-react";
import Image from "next/image";
import { generateQRDataURL } from "@/lib/qr";
import { useFirebaseContext } from "@/contexts/FirebaseContext";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
interface Subject {
  sub_code: string;
  sub_name: string;
  theory: string | null;
  project_work: string | null;
  ia_sci: string | null;
  practical: string | null;
  literacy_activity: string | null;
  regulation: string | null;
  cce: string | null;
  sub_group_id: string;
  is_compartmental: string | null;
  sub_total: string;
  sub_result: string | null;
  is_improved_sub: string | null;
}

interface ResultData {
  reg_no: string;
  roll_code: string;
  roll_no: string;
  school_name: string;
  total: string;
  division: string;
  name: string;
  father_name: string;
  bseb_id: string;
  subjects: Subject[];
  status?: string;
  rank?: string;
  dob?: string;
  is_topper: boolean;
  passed_under_regulation: string | null;
  is_improved_result: string | null;
  exam_type: string;
  is_expelled: string | null;
  division_grace_marks: string | null;
  createdAt?: number;
}

function formatMark(value: string | null): string {
  if (!value || value === "null") return "-";
  const n = parseInt(value, 10);
  return isNaN(n) ? "-" : n.toString();
}

function getPassLabel(sub: Subject): { text: string; cls: string } {
  const total = parseInt(sub.sub_total);
  if (isNaN(total) || total < 0) return { text: "-", cls: "" };
  if (sub.is_compartmental === "true")
    return { text: "COMP", cls: "text-[#FF9F0A] font-bold" };
  if (total >= 30) return { text: "PASS", cls: "text-[#34C759] font-bold" };
  return { text: "FAIL", cls: "text-[#FF3B30] font-bold" };
}

/* ------------------------------------------------------------------ */
/*  Share Dialog                                                       */
/* ------------------------------------------------------------------ */
function ShareDialog({
  shareUrl,
  onClose,
}: {
  shareUrl: string;
  onClose: () => void;
}) {
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const nativeShareAvailable = typeof navigator !== "undefined" && "share" in navigator;

  useEffect(() => {
    generateQRDataURL(shareUrl, 220).then(setQrDataUrl);
  }, [shareUrl]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const el = document.createElement("textarea");
      el.value = shareUrl;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [shareUrl]);

  const handleNativeShare = useCallback(async () => {
    try {
      await navigator.share({ title: "BSEB Result", url: shareUrl });
    } catch {
      // User cancelled or not supported
    }
  }, [shareUrl]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Dialog */}
      <div className="relative bg-white rounded-2xl shadow-[0_24px_60px_rgba(0,0,0,0.2)] w-full max-w-sm p-6 animate-scale-in">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#F5F5F7] flex items-center justify-center text-[#6E6E73] hover:text-[#1D1D1F] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <h3 className="text-lg font-semibold text-[#1D1D1F] mb-1">Share Result</h3>
        <p className="text-xs text-[#6E6E73] mb-5">
          Share this link or scan the QR code to view the result
        </p>

        {/* QR Code */}
        {qrDataUrl && (
          <div className="flex justify-center mb-5">
            <div className="p-3 bg-[#F5F5F7] rounded-xl">
              <img
                src={qrDataUrl}
                alt="QR Code"
                width={180}
                height={180}
                className="rounded-lg"
              />
            </div>
          </div>
        )}

        {/* Link input */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex-1 px-3 py-2.5 rounded-xl bg-[#F5F5F7] text-xs text-[#6E6E73] truncate font-mono">
            {shareUrl}
          </div>
          <Button
            size="sm"
            onClick={handleCopy}
            className={`rounded-xl gap-1.5 shrink-0 text-xs font-medium transition-all duration-200 ${
              copied
                ? "bg-[#34C759] hover:bg-[#34C759] text-white"
                : "bg-[#0071E3] hover:bg-[#0077ED] text-white"
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Copied
              </>
            ) : (
              <>
                <Link2 className="w-3.5 h-3.5" />
                Copy
              </>
            )}
          </Button>
        </div>

        {/* Native share button */}
        {nativeShareAvailable && (
          <Button
            onClick={handleNativeShare}
            variant="outline"
            className="w-full rounded-xl gap-2 border-[#E5E5EA] text-[#1D1D1F] hover:bg-[#F5F5F7]"
          >
            <Share2 className="w-4 h-4" />
            Share via...
          </Button>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Loading Animation                                                  */
/* ------------------------------------------------------------------ */
const LOADING_STEPS = [
  { label: "Connecting to BSEB Server", icon: "📡" },
  { label: "Verifying Roll Details", icon: "🔍" },
  { label: "Fetching Marks Sheet", icon: "📋" },
  { label: "Preparing Result Card", icon: "✨" },
];

function LoadingAnimation() {
  const [activeStep, setActiveStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const totalDuration = 4000; // 4 seconds total
    const stepInterval = totalDuration / LOADING_STEPS.length;
    const progressInterval = 50;

    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + (progressInterval / totalDuration) * 100;
        return next >= 95 ? 95 : next; // Stop at 95% until real data arrives
      });
    }, progressInterval);

    const stepTimer = setInterval(() => {
      setActiveStep((prev) => {
        if (prev < LOADING_STEPS.length - 1) return prev + 1;
        return prev;
      });
    }, stepInterval);

    return () => {
      clearInterval(progressTimer);
      clearInterval(stepTimer);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5F5F7] px-4">
      <div className="text-center animate-fade-in w-full max-w-sm">
        {/* Spinning rings with logo */}
        <div className="relative w-28 h-28 mx-auto mb-8">
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full border-[3px] border-[#E5E5EA]" />
          <div
            className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-[#0071E3] animate-spin"
            style={{ animationDuration: "1s" }}
          />
          {/* Middle ring */}
          <div
            className="absolute inset-2 rounded-full border-[3px] border-transparent border-t-[#0071E3]/60 animate-spin"
            style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
          />
          {/* Inner ring */}
          <div
            className="absolute inset-4 rounded-full border-[2px] border-transparent border-b-[#0071E3]/30 animate-spin"
            style={{ animationDuration: "2s" }}
          />
          {/* Logo */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-14 h-14 rounded-xl bg-white shadow-[0_2px_12px_rgba(0,0,0,0.1)] flex items-center justify-center animate-pulse">
              <img
                src="/bseb-logo.png"
                alt="BSEB"
                width={38}
                height={38}
                className="rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-[#1D1D1F] mb-1 tracking-tight">
          Fetching Your Result
        </h3>
        <p className="text-sm text-[#6E6E73] mb-8">
          Please wait while we retrieve your Bihar Board result...
        </p>

        {/* Progress bar */}
        <div className="w-full mb-6">
          <div className="h-1.5 bg-[#E5E5EA] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300 ease-out"
              style={{
                width: `${progress}%`,
                background: `linear-gradient(90deg, #0071E3 0%, #34C759 100%)`,
              }}
            />
          </div>
          <p className="text-xs text-[#AEAEB2] mt-2 font-medium tabular-nums">
            {Math.round(progress)}% complete
          </p>
        </div>

        {/* Step indicators */}
        <div className="w-full space-y-2.5">
          {LOADING_STEPS.map((step, i) => {
            const isActive = i === activeStep;
            const isDone = i < activeStep;
            return (
              <div
                key={i}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-500 ${
                  isActive
                    ? "bg-white shadow-[0_2px_12px_rgba(0,113,227,0.12)] border border-[#0071E3]/20"
                    : isDone
                    ? "bg-white/60 border border-[#34C759]/20"
                    : "bg-transparent border border-transparent"
                }`}
              >
                {/* Status icon */}
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0 transition-all duration-500 ${
                    isActive
                      ? "bg-[#0071E3]/10 scale-110"
                      : isDone
                      ? "bg-[#34C759]/10"
                      : "bg-[#E5E5EA]/50"
                  }`}
                >
                  {isDone ? (
                    <svg
                      className="w-4 h-4 text-[#34C759]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span
                      className={`text-xs ${
                        isActive ? "opacity-100" : "opacity-40"
                      }`}
                    >
                      {step.icon}
                    </span>
                  )}
                </div>

                {/* Label */}
                <span
                  className={`text-sm font-medium transition-all duration-500 ${
                    isActive
                      ? "text-[#0071E3]"
                      : isDone
                      ? "text-[#34C759]"
                      : "text-[#AEAEB2]"
                  }`}
                >
                  {step.label}
                </span>

                {/* Active spinner */}
                {isActive && (
                  <div className="ml-auto">
                    <Loader2 className="w-4 h-4 text-[#0071E3] animate-spin" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/*  Inner component (uses useSearchParams)                              */
/* ------------------------------------------------------------------ */
function ResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { addToHistory: addToFirebaseHistory, saveResult, loading: firebaseLoading } = useFirebaseContext();
  
  const rollCode = searchParams.get("roll_code") || "";
  const rollNo = searchParams.get("roll_no") || "";
  const [result, setResult] = useState<ResultData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cached, setCached] = useState(false);
  const [showShare, setShowShare] = useState(false);
  
  // Celebration states
  const [showCelebration, setShowCelebration] = useState(false);
  const [confettiActive, setConfettiActive] = useState(false);
  const [celebrationPhase, setCelebrationPhase] = useState(0);
  const [studentPercentage, setStudentPercentage] = useState(0);
  
  // Motivation states
  const [showMotivation, setShowMotivation] = useState(false);
  const [motivationPhase, setMotivationPhase] = useState(0);
  
  // Calculate percentage and check for celebration eligibility
  const calculatePercentage = useCallback((total: string) => {
    const totalMarks = parseInt(total) || 0;
    const maxMarks = 500; // Updated to 500 based on 5 compulsory subjects
    return Math.round((totalMarks / maxMarks) * 100);
  }, []);
  
  const shouldCelebrate = useCallback((resultData: ResultData) => {
    const studentPercentage = calculatePercentage(resultData.total);
    const isFirstDivision = resultData.division?.toLowerCase().includes("1st");
    return studentPercentage >= 60 || isFirstDivision;
  }, [calculatePercentage]);
  
  const shouldMotivate = useCallback((resultData: ResultData) => {
    const studentPercentage = calculatePercentage(resultData.total);
    const isFirstDivision = resultData.division?.toLowerCase().includes("1st");
    return studentPercentage < 60 && !isFirstDivision;
  }, [calculatePercentage]);
  
  // Celebration animation function
  const startCelebrationAnimation = useCallback(() => {
    let phase = 0;
    const interval = setInterval(() => {
      phase++;
      setCelebrationPhase(phase);
      if (phase >= 4) {
        clearInterval(interval);
      }
    }, 1000);
  }, []);
  
  // Motivation animation function
  const startMotivationAnimation = useCallback(() => {
    let phase = 0;
    const interval = setInterval(() => {
      phase++;
      setMotivationPhase(phase);
      if (phase >= 4) {
        clearInterval(interval);
      }
    }, 1000);
  }, []);

  /* Fetch result on mount */
  useEffect(() => {
    async function fetchResult() {
      if (!rollCode || !rollNo) {
        setError("Missing Roll Code or Roll Number.");
        setLoading(false);
        return;
      }

      // Check sessionStorage first
      const cached = sessionStorage.getItem("bseb_result");
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (parsed.roll_code === rollCode && parsed.roll_no === rollNo) {
            setResult(parsed);
            // Save to Firebase history only if Firebase is initialized
            if (!firebaseLoading) {
              try {
                await addToFirebaseHistory({
                  rollCode: parsed.roll_code,
                  rollNo: parsed.roll_no,
                  name: parsed.name,
                  fatherName: parsed.father_name,
                  schoolName: parsed.school_name,
                  total: parseInt(parsed.total),
                  division: parsed.division,
                  regNo: parsed.reg_no,
                  bsebId: parsed.bseb_id,
                  createdAt: Date.now()
                });
              } catch (error) {
                console.error('Failed to save to Firebase history:', error);
              }
            }
            setLoading(false);
            return;
          }
        } catch {
          // ignore
        }
      }

      try {
        const res = await fetch(
          `/api/result?roll_code=${encodeURIComponent(rollCode)}&roll_no=${encodeURIComponent(rollNo)}`
        );
        const data = await res.json();
        if (data.success && data.data) {
          setResult(data.data);
          
          // Calculate and set percentage
          const calculatedPercentage = calculatePercentage(data.data.total);
          console.log('Percentage calculation:', { total: data.data.total, calculated: calculatedPercentage });
          setStudentPercentage(calculatedPercentage);
          
          // Check if student should celebrate
          if (shouldCelebrate(data.data)) {
            // Show celebration after 5 seconds
            setTimeout(() => {
              setShowCelebration(true);
              setConfettiActive(true);
              startCelebrationAnimation();
            }, 5000);
          }
          
          // Check if student should be motivated
          if (shouldMotivate(data.data)) {
            // Show motivation after 5 seconds
            setTimeout(() => {
              setShowMotivation(true);
              startMotivationAnimation();
            }, 5000);
          }
          
          // Save to Firebase history only if Firebase is initialized
          if (!firebaseLoading) {
            try {
              await addToFirebaseHistory({
                rollCode: data.data.roll_code,
                rollNo: data.data.roll_no,
                name: data.data.name,
                fatherName: data.data.father_name,
                schoolName: data.data.school_name,
                total: parseInt(data.data.total),
                division: data.data.division,
                regNo: data.data.reg_no,
                bsebId: data.data.bseb_id,
                createdAt: Date.now()
              });
            } catch (error) {
              console.error('Failed to save to Firebase history:', error);
            }
          }
        } else {
          setError(
            data.error ||
              "Result not found. Please check your Roll Code and Roll Number."
          );
        }
      } catch {
        setError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchResult();
  }, [rollCode, rollNo]);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const handleBack = useCallback(() => {
    router.push("/");
  }, [router]);

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/result?roll_code=${encodeURIComponent(rollCode)}&roll_no=${encodeURIComponent(rollNo)}`
      : "";

  /* -------------------------- LOADING ----------------------------- */
  if (loading) {
    return (
      <LoadingAnimation />
    );
  }

  /* -------------------------- ERROR ----------------------------- */
  if (error || !result) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5F5F7] px-4">
        <div className="text-center max-w-md animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-[#FFEFEE] flex items-center justify-center mx-auto mb-5">
            <AlertCircle className="w-8 h-8 text-[#FF3B30]" />
          </div>
          <h3 className="text-xl font-semibold text-[#1D1D1F] mb-2">Result Not Found</h3>
          <p className="text-sm text-[#6E6E73] mb-6">{error || "Something went wrong."}</p>
          <Button
            onClick={handleBack}
            className="h-11 px-6 rounded-xl bg-[#0071E3] hover:bg-[#0077ED] text-white shadow-[0_4px_14px_rgba(0,113,227,0.35)] transition-all duration-200"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  /* -------------------------- RESULT ---------------------------- */
  const totalMarks = parseInt(result.total) || 0;
  const maxMarks = 500; // Updated to 500 based on 5 subjects x 100 marks each
  const percentage = totalMarks > 0 ? ((totalMarks / maxMarks) * 100).toFixed(2) : "0.00";
  
  // For table display - keep original logic
  const compulsorySubjects = result.subjects.filter((s) => s.sub_name !== "ENGLISH");
  const optionalSubject = result.subjects.find((s) => s.sub_name === "ENGLISH");
  const compulsoryFullMarks = compulsorySubjects.length * 100;

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F7]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-[#E5E5EA]/60 no-print">
        <div className="max-w-[1400px] mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
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
            <div className="hidden sm:flex items-center gap-1 sm:gap-2">
              <Button
                variant="outline"
                onClick={handleBack}
                className="rounded-lg gap-1.5 sm:gap-2 text-[#6E6E73] border-[#E5E5EA] hover:bg-[#F5F5F7] hover:text-[#1D1D1F] h-8 sm:h-10 text-xs sm:text-sm"
              >
                <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">New</span>
              </Button>
              <Button
                size="sm"
                onClick={handlePrint}
                className="rounded-lg gap-2 bg-[#0071E3] hover:bg-[#0077ED] text-white shadow-[0_2px_8px_rgba(0,113,227,0.3)]"
              >
                <Printer className="w-4 h-4" />
                <span className="hidden sm:inline">Print</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Result Card */}
      <main className="flex-1 py-4 sm:py-6 lg:py-10">
        <div className="max-w-[900px] mx-auto px-3 sm:px-6 animate-scale-in">
          <div
            id="result-card"
            className="result-card bg-white shadow-[0_4px_24px_rgba(0,0,0,0.08)] rounded-lg overflow-hidden"
          >
            {/* ===== HEADER ===== */}
            <div className="text-center pt-4 sm:pt-6 pb-3 sm:pb-4 px-4 sm:px-6 border-b-2 border-[#1D1D1F]/10">
              <img
                src="/bseb-logo.png"
                alt="BSEB Logo"
                width={48}
                height={48}
                className="mx-auto mb-2 rounded-lg sm:w-14 sm:h-14"
              />
              <h1 className="text-xs sm:text-sm lg:text-base font-semibold text-[#1D1D1F] uppercase tracking-wide leading-tight">
                Bihar School Examination Board
              </h1>
              <h2 className="text-lg sm:text-2xl lg:text-[28px] font-bold text-[#1D1D1F] tracking-tight mt-1 leading-none">
                RESULT
              </h2>
              <p className="text-xs sm:text-sm text-[#6E6E73] mt-1 sm:mt-1.5 tracking-wide uppercase">
                Annual Secondary Examination - 2026
              </p>
            </div>

            {/* ===== STUDENT INFO ===== */}
            <div className="px-3 sm:px-6 py-3 sm:py-4">
              <table className="w-full text-xs sm:text-sm">
                <tbody>
                  <InfoRow label="BSEB Unique Id" value={result.bseb_id} />
                  <InfoRow label="Student Name" value={result.name} bold />
                  <InfoRow label="Father's Name" value={result.father_name} bold />
                  <InfoRow label="School Name" value={result.school_name} />
                  <InfoRow label="Roll Code" value={result.roll_code} />
                  <InfoRow label="Roll Number" value={result.roll_no} />
                  <InfoRow label="Registration Number" value={result.reg_no} />
                </tbody>
              </table>
            </div>

            {/* ===== MARKS TABLE ===== */}
            <div className="px-4 sm:px-6">
              <h3 className="text-sm sm:text-base font-bold text-[#1D1D1F] mb-3 text-center tracking-wide">
                Marks Details
              </h3>
              <div className="overflow-x-auto rounded border border-[#1D1D1F]/15">
                <table className="w-full text-xs sm:text-[13px]">
                  <thead>
                    <tr className="bg-[#1D1D1F] text-white">
                      <Th>Subject</Th>
                      <Th>F.Marks</Th>
                      <Th>P.Marks</Th>
                      <Th>Theory</Th>
                      <Th>INT/PRAC</Th>
                      <Th>Regulation</Th>
                      <Th>Subject Total</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {compulsorySubjects.map((sub, i) => {
                      const pass = getPassLabel(sub);
                      return (
                        <tr
                          key={sub.sub_code}
                          className={`border-b border-[#1D1D1F]/8 last:border-b-0 ${
                            i % 2 === 0 ? "bg-white" : "bg-[#F9F9FB]"
                          }`}
                        >
                          <Td left>{sub.sub_name}</Td>
                          <Td center>100</Td>
                          <Td center>030</Td>
                          <Td center bold>{formatMark(sub.theory)}</Td>
                          <Td center>
                            {formatMark(sub.ia_sci) !== "-" ? formatMark(sub.ia_sci) : formatMark(sub.practical)}
                          </Td>
                          <Td center>
                            <span className={pass.cls}>{pass.text}</span>
                          </Td>
                          <Td center bold>{formatMark(sub.sub_total)}</Td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* ===== OPTIONAL SUBJECT ===== */}
              {optionalSubject && (
                <div className="mt-4">
                  <div className="flex items-center gap-2 mb-2 px-1">
                    <span className="text-xs font-semibold text-[#6E6E73] uppercase tracking-wider">
                      Optional Subject
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FFF7E5] text-[#FF9F0A] font-medium">
                      Not counted in percentage
                    </span>
                  </div>
                  <div className="overflow-x-auto rounded border border-dashed border-[#1D1D1F]/15 bg-[#FDFDFD]">
                    <table className="w-full text-xs sm:text-[13px]">
                      <thead>
                        <tr className="bg-[#6E6E73] text-white">
                          <Th>Subject</Th>
                          <Th>F.Marks</Th>
                          <Th>P.Marks</Th>
                          <Th>Theory</Th>
                          <Th>INT/PRAC</Th>
                          <Th>Regulation</Th>
                          <Th>Subject Total</Th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <Td left>{optionalSubject.sub_name}</Td>
                          <Td center>100</Td>
                          <Td center>030</Td>
                          <Td center bold>{formatMark(optionalSubject.theory)}</Td>
                          <Td center>
                            {formatMark(optionalSubject.ia_sci) !== "-" ? formatMark(optionalSubject.ia_sci) : formatMark(optionalSubject.practical)}
                          </Td>
                          <Td center>
                            <span className={getPassLabel(optionalSubject).cls}>{getPassLabel(optionalSubject).text}</span>
                          </Td>
                          <Td center bold>{formatMark(optionalSubject.sub_total)}</Td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ===== RESULT SUMMARY ===== */}
              <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 px-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-[#6E6E73]">Result / Division:</span>
                  <span className="font-bold text-[#1D1D1F]">{result.division}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#6E6E73]">Total Marks:</span>
                  <span className="font-bold text-[#1D1D1F]">
                    {result.total} / {compulsoryFullMarks}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#6E6E73]">Percentage:</span>
                  <span className="font-bold text-[#1D1D1F]">{percentage}%</span>
                </div>
              </div>
            </div>

            {/* ===== LEGEND ===== */}
            <div className="px-4 sm:px-6 pt-4 pb-5">
              <div className="text-[10px] sm:text-[11px] text-[#6E6E73] leading-relaxed">
                <p>
                  <strong>INT</strong> - Internal Assessment &nbsp;|&nbsp;{" "}
                  <strong>PRAC</strong> - Practical &nbsp;|&nbsp;{" "}
                  <strong>F.Marks</strong> - Full Marks &nbsp;|&nbsp;{" "}
                  <strong>P.Marks</strong> - Passing Marks
                </p>
              </div>
            </div>

            {/* ===== FOOTER ===== */}
            <div className="border-t border-[#1D1D1F]/8 px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] sm:text-[11px] text-[#AEAEB2]">
              <span>Bihar School Examination Board, Patna</span>
              <span>
                Designed &amp; Developed by <strong className="text-[#0071E3]">Satyam Rojha</strong>
              </span>
            </div>

            {/* Print timestamp */}
            <div className="print-timestamp">
              Printed on {new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })} at{" "}
              {new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
            </div>
          </div>{/* ← closes #result-card */}

          {/* Action buttons */}
          <div className="no-print flex flex-col sm:flex-row justify-center gap-2 sm:gap-3 mt-4 sm:mt-6">
            <Button
              variant="outline"
              onClick={handleBack}
              className="rounded-lg gap-1.5 sm:gap-2 text-[#6E6E73] border-[#E5E5EA] hover:bg-[#F5F5F7] hover:text-[#1D1D1F] h-9 sm:h-11 text-sm"
            >
              <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">New</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowShare(true)}
              className="rounded-lg gap-1.5 sm:gap-2 text-[#6E6E73] border-[#E5E5EA] hover:bg-[#F5F5F7] hover:text-[#1D1D1F] h-9 sm:h-11 text-sm"
            >
              <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Share Result</span>
            </Button>
            {/* Celebration Button - Only show if eligible */}
            {shouldCelebrate(result) && !showCelebration && (
              <Button
                onClick={() => {
                  setShowCelebration(true);
                  setConfettiActive(true);
                  startCelebrationAnimation();
                }}
                className="rounded-lg gap-1.5 sm:gap-2 bg-gradient-to-r from-[#FF6B6B] via-[#4ECDC4] to-[#45B7D1] hover:from-[#FF5252] hover:via-[#3DBBB4] hover:to-[#3498DB] text-white shadow-[0_4px_20px_rgba(255,107,107,0.4)] h-9 sm:h-11 text-sm font-bold animate-pulse"
              >
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">🎉 Celebrate!</span>
              </Button>
            )}
            {/* Motivation Button - Only show if needs motivation */}
            {shouldMotivate(result) && !showMotivation && (
              <Button
                onClick={() => {
                  setShowMotivation(true);
                  startMotivationAnimation();
                }}
                className="rounded-lg gap-1.5 sm:gap-2 bg-gradient-to-r from-[#FF9500] via-[#FF6B35] to-[#FBBF24] hover:from-[#E67E22] hover:via-[#EA580C] hover:to-[#F59E0B] text-white shadow-[0_4px_20px_rgba(251,147,0,0.4)] h-9 sm:h-11 text-sm font-bold animate-pulse"
              >
                <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">💪 Get Motivated!</span>
              </Button>
            )}
            <Button
              onClick={handlePrint}
              className="rounded-lg gap-1.5 sm:gap-2 bg-[#0071E3] hover:bg-[#0077ED] text-white shadow-[0_2px_8px_rgba(0,113,227,0.3)] h-9 sm:h-11 text-sm"
            >
              <Printer className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Print Result</span>
            </Button>
          </div>
        </div>{/* ← closes max-w-[900px] wrapper */}
      </main>

      {/* Amazing Celebration Modal */}
      {showCelebration && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="relative max-w-4xl mx-auto p-4 sm:p-8">
            {/* Confetti Background */}
            {confettiActive && (
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(50)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute animate-bounce"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 2}s`,
                      animationDuration: `${2 + Math.random() * 2}s`
                    }}
                  >
                    {['🎉', '🎊', '✨', '🌟', '💫', '🎈', '🎆', '🏆', '👏'][Math.floor(Math.random() * 9)]}
                  </div>
                ))}
              </div>
            )}
            
            {/* Celebration Card */}
            <div className="relative bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto animate-in zoom-in duration-500">
              {/* Close Button */}
              <button
                onClick={() => setShowCelebration(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              
              {/* Celebration Content */}
              <div className="text-center space-y-6">
                {/* Animated Trophy */}
                <div className={`relative inline-block ${celebrationPhase >= 1 ? 'animate-bounce' : ''}`}>
                  <div className="text-6xl sm:text-8xl animate-pulse">
                    {celebrationPhase >= 2 ? '🏆' : celebrationPhase >= 1 ? '🥇' : '🎉'}
                  </div>
                  {celebrationPhase >= 2 && (
                    <div className="absolute -top-2 -right-2 text-2xl animate-spin">✨</div>
                  )}
                </div>
                
                {/* Achievement Title */}
                <div className={`space-y-2 ${celebrationPhase >= 1 ? 'animate-fade-in' : 'opacity-0'}`}>
                  <h2 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-[#FF6B6B] via-[#4ECDC4] to-[#45B7D1] bg-clip-text text-transparent">
                    Congratulations! 🎊
                  </h2>
                  <p className="text-lg sm:text-xl text-gray-700">
                    You've achieved excellence!
                  </p>
                </div>
                
                {/* Student Stats */}
                <div className={`grid grid-cols-1 sm:grid-cols-3 gap-4 ${celebrationPhase >= 2 ? 'animate-fade-in' : 'opacity-0'}`}>
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                    <div className="flex items-center justify-center mb-2">
                      <Star className="w-8 h-8 text-blue-600" />
                    </div>
                    <div className="text-2xl font-bold text-blue-900">{studentPercentage}%</div>
                    <div className="text-sm text-blue-700">Percentage</div>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                    <div className="flex items-center justify-center mb-2">
                      <Medal className="w-8 h-8 text-green-600" />
                    </div>
                    <div className="text-2xl font-bold text-green-900">{result.division}</div>
                    <div className="text-sm text-green-700">Division</div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                    <div className="flex items-center justify-center mb-2">
                      <Target className="w-8 h-8 text-purple-600" />
                    </div>
                    <div className="text-2xl font-bold text-purple-900">{result.total}</div>
                    <div className="text-sm text-purple-700">Total Marks</div>
                  </div>
                </div>
                
                {/* Achievement Badges */}
                <div className={`flex flex-wrap justify-center gap-2 ${celebrationPhase >= 3 ? 'animate-fade-in' : 'opacity-0'}`}>
                  {studentPercentage >= 90 && (
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
                      <Crown className="w-4 h-4" />
                      Outstanding Performer!
                    </div>
                  )}
                  {studentPercentage >= 80 && studentPercentage < 90 && (
                    <div className="bg-gradient-to-r from-blue-400 to-indigo-500 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
                      <Rocket className="w-4 h-4" />
                      Excellent!
                    </div>
                  )}
                  {studentPercentage >= 70 && studentPercentage < 80 && (
                    <div className="bg-gradient-to-r from-green-400 to-teal-500 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
                      <Flame className="w-4 h-4" />
                      Very Good!
                    </div>
                  )}
                  {studentPercentage >= 60 && studentPercentage < 70 && (
                    <div className="bg-gradient-to-r from-purple-400 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
                      <Heart className="w-4 h-4" />
                      Good Job!
                    </div>
                  )}
                </div>
                
                {/* Motivational Message */}
                <div className={`space-y-3 ${celebrationPhase >= 4 ? 'animate-fade-in' : 'opacity-0'}`}>
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200">
                    <h3 className="text-lg font-bold text-indigo-900 mb-2">🌟 Your Achievement 🌟</h3>
                    <p className="text-gray-700 leading-relaxed">
                      Dear <span className="font-bold text-indigo-700">{result.name}</span>, your hard work and dedication have paid off! 
                      Scoring <span className="font-bold text-green-600">{studentPercentage}%</span> with <span className="font-bold text-blue-600">{result.division}</span> division 
                      is truly commendable. Keep reaching for the stars! 🚀
                    </p>
                    <div className="mt-4 flex items-center justify-center gap-2">
                      <Gift className="w-5 h-5 text-pink-500" />
                      <span className="text-sm text-gray-600">A special gift for your achievement!</span>
                    </div>
                  </div>
                  
                  {/* Interactive Celebration Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                      onClick={() => {
                        setConfettiActive(!confettiActive);
                      }}
                      className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white"
                    >
                      <PartyPopper className="w-4 h-4 mr-2" />
                      More Confetti! 🎊
                    </Button>
                    <Button
                      onClick={() => {
                        navigator.clipboard.writeText(`🎉 I scored ${studentPercentage}% in my BSEB exams! ${result.division} division! 🏆`);
                        alert('🎉 Achievement copied to clipboard! Share your success!');
                      }}
                      className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Share Achievement 📢
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Amazing Motivation Modal */}
      {showMotivation && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="relative max-w-4xl mx-auto p-4 sm:p-8">
            {/* Gentle Background Effects */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute animate-pulse"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 3}s`,
                    animationDuration: `${3 + Math.random() * 2}s`
                  }}
                >
                  <div className="text-2xl opacity-30">
                    {['💫', '✨', '🌟', '💪', '🎯', '📚', '🌱', '⭐'][Math.floor(Math.random() * 8)]}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Motivation Card */}
            <div className="relative bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto animate-in zoom-in duration-500">
              {/* Close Button */}
              <button
                onClick={() => setShowMotivation(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              
              {/* Motivation Content */}
              <div className="text-center space-y-6">
                {/* Growing Plant Animation */}
                <div className={`relative inline-block ${motivationPhase >= 1 ? 'animate-bounce' : ''}`}>
                  <div className="text-6xl sm:text-8xl">
                    {motivationPhase >= 2 ? '🌱' : motivationPhase >= 1 ? '🌱' : '📚'}
                  </div>
                  {motivationPhase >= 2 && (
                    <div className="absolute -top-2 -right-2 text-xl animate-pulse">✨</div>
                  )}
                </div>
                
                {/* Encouragement Title */}
                <div className={`space-y-2 ${motivationPhase >= 1 ? 'animate-fade-in' : 'opacity-0'}`}>
                  <h2 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-[#FF9500] via-[#FF6B35] to-[#FBBF24] bg-clip-text text-transparent">
                    Keep Going! 💪
                  </h2>
                  <p className="text-lg sm:text-xl text-gray-700">
                    Every journey starts with a single step!
                  </p>
                </div>
                
                {/* Student Stats with Positive Spin */}
                <div className={`grid grid-cols-1 sm:grid-cols-3 gap-4 ${motivationPhase >= 2 ? 'animate-fade-in' : 'opacity-0'}`}>
                  <div className="bg-gradient-to-br from-orange-50 to-red-100 rounded-xl p-4 border border-orange-200">
                    <div className="flex items-center justify-center mb-2">
                      <Target className="w-8 h-8 text-orange-600" />
                    </div>
                    <div className="text-2xl font-bold text-orange-900">
                      {studentPercentage > 0 ? studentPercentage : calculatePercentage(result.total)}%
                    </div>
                    <div className="text-sm text-orange-700">Current Score</div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-4 border border-blue-200">
                    <div className="flex items-center justify-center mb-2">
                      <Trophy className="w-8 h-8 text-blue-600" />
                    </div>
                    <div className="text-2xl font-bold text-blue-900">
                      {studentPercentage > 0 ? (100 - studentPercentage) : (100 - calculatePercentage(result.total))}%
                    </div>
                    <div className="text-sm text-blue-700">Room to Grow</div>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-4 border border-green-200">
                    <div className="flex items-center justify-center mb-2">
                      <Heart className="w-8 h-8 text-green-600" />
                    </div>
                    <div className="text-2xl font-bold text-green-900">∞</div>
                    <div className="text-sm text-green-700">Potential</div>
                  </div>
                </div>
                
                {/* Motivational Messages */}
                <div className={`space-y-4 ${motivationPhase >= 3 ? 'animate-fade-in' : 'opacity-0'}`}>
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                    <h3 className="text-lg font-bold text-purple-900 mb-3">🌱 Your Growth Journey 🌱</h3>
                    <div className="space-y-3 text-gray-700 leading-relaxed">
                      <p>
                        Dear <span className="font-bold text-purple-700">{result.name}</span>, 
                        scoring <span className="font-bold text-orange-600">
                          {studentPercentage > 0 ? studentPercentage : calculatePercentage(result.total)}%
                        </span> is just the beginning!
                      </p>
                      <p>
                        📚 <strong>Knowledge Gained:</strong> Every mark represents learning and growth
                      </p>
                      <p>
                        🎯 <strong>Next Goal:</strong> Just {
                          studentPercentage > 0 ? (100 - studentPercentage) : (100 - calculatePercentage(result.total))
                        }% more to reach excellence
                      </p>
                      <p>
                        💪 <strong>Remember:</strong> Success is not final, failure is not fatal - it's the courage to continue that counts!
                      </p>
                      <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                        <p className="text-sm font-medium text-yellow-800">
                          🌟 <strong>Inspiration:</strong> "The expert in anything was once a beginner. 
                          Your today's effort is tomorrow's strength!"
                        </p>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
                      <Button
                        onClick={() => {
                          navigator.clipboard.writeText(`📚 I scored ${studentPercentage}% and I'm proud of my progress! Next time I'll aim even higher! 💪`);
                          alert('🌱 Motivational message copied! Share your journey!');
                        }}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                      >
                        <Heart className="w-4 h-4 mr-2" />
                        Share My Journey 📢
                      </Button>
                      <Button
                        onClick={() => {
                          window.open('https://www.youtube.com/results?search_query=BSEB+study+tips+class+10+motivation', '_blank');
                        }}
                        className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white"
                      >
                        <Target className="w-4 h-4 mr-2" />
                        Study Tips 📚
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Share Dialog */}
      {showShare && <ShareDialog shareUrl={shareUrl} onClose={() => setShowShare(false)} />}

      {/* Footer */}
      <footer className="no-print mt-auto bg-white border-t border-[#E5E5EA]">
        <div className="max-w-[1400px] mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Image src="/bseb-logo.png" alt="BSEB" width={20} height={20} className="rounded-md sm:w-6 sm:h-6" />
              <span className="text-[10px] sm:text-xs text-[#6E6E73]">Bihar School Examination Board, Patna</span>
            </div>
            <p className="text-[10px] sm:text-xs text-[#AEAEB2] text-center sm:text-left">
              Designed &amp; Developed by <span className="font-medium text-[#0071E3]">Satyam Rojha</span>
            </p>
          </div>
        </div>
      </footer>
      
      {/* Custom Styles for Celebration */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes zoom-in {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
        
        .animate-in.zoom-in {
          animation: zoom-in 0.5s ease-out forwards;
        }
        
        .animate-bounce {
          animation: bounce 2s infinite;
        }
        
        @keyframes bounce {
          0%, 20%, 53%, 80%, 100% {
            transform: translate3d(0, 0, 0);
          }
          40%, 43% {
            transform: translate3d(0, -30px, 0);
          }
          70% {
            transform: translate3d(0, -15px, 0);
          }
          90% {
            transform: translate3d(0, -4px, 0);
          }
        }
      `}</style>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Table helpers                                                      */
/* ------------------------------------------------------------------ */
function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-1.5 sm:px-2.5 py-1.5 sm:py-2 text-center font-semibold tracking-wide whitespace-nowrap text-xs sm:text-sm">
      {children}
    </th>
  );
}

function Td({ children, center, left, bold }: { children: React.ReactNode; center?: boolean; left?: boolean; bold?: boolean }) {
  return (
    <td
      className={`px-1.5 sm:px-2.5 py-1.5 sm:py-2 whitespace-nowrap text-xs sm:text-sm ${bold ? "font-bold text-[#1D1D1F]" : "text-[#1D1D1F]"} ${
        center ? "text-center" : ""
      } ${left ? "text-left" : ""}`}
    >
      {children}
    </td>
  );
}

function InfoRow({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <tr className="border-b border-[#E5E5EA]/40 last:border-b-0">
      <td className="py-1.5 pr-2 sm:pr-4 text-[10px] sm:text-xs text-[#6E6E73] whitespace-nowrap align-top w-[100px] sm:w-[140px]">{label}</td>
      <td className={`py-1.5 text-[#1D1D1F] text-xs sm:text-sm ${bold ? "font-semibold" : ""}`}>{value}</td>
    </tr>
  );
}

/* ------------------------------------------------------------------ */
/*  Page wrapper with Suspense (required for useSearchParams)           */
/* ------------------------------------------------------------------ */
export default function ResultPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5F5F7]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 text-[#0071E3] animate-spin mx-auto mb-4" />
            <p className="text-sm text-[#6E6E73]">Loading...</p>
          </div>
        </div>
      }
    >
      <ResultContent />
    </Suspense>
  );
}