import { motion, AnimatePresence } from "motion/react";
import Confetti from "@/components/ui/confetti";
import Marquee from "@/components/ui/marquee";
import { cn } from "@/lib/utils";
import {
  Calendar,
  Clock,
  ChevronDown,
  User,
  MessageCircle,
  Send,
  CheckCircle,
  XCircle,
  HelpCircle,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { formatEventDate } from "@/lib/format-event-date";
import { getGuestName } from "@/lib/invitation-storage";
import { useMotionPreset, staggerContainer, stagger } from "@/lib/motion";
import { useTranslation } from "@/lib/i18n";
import { supabase } from "@/lib/supabase";

const WISH_STORAGE_KEY = "sakeenah_wish_submitted";

export default function Wishes() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const fade = useMotionPreset("fade");
  const fadeUp = useMotionPreset("fadeUp");
  const scaleIn = useMotionPreset("scaleIn");

  const [showConfetti, setShowConfetti] = useState(false);
  const [newWish, setNewWish] = useState("");
  const [guestName, setGuestName] = useState("");
  const [attendance, setAttendance] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isNameFromInvitation, setIsNameFromInvitation] = useState(false);
  const [hasSubmittedWish, setHasSubmittedWish] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedWish, setSelectedWish] = useState(null);

  const dropdownRef = useRef(null);

  // Ambil nama tamu dari ?to=
  useEffect(() => {
    const storedGuestName = getGuestName();

    if (storedGuestName) {
      setGuestName(storedGuestName);
      setIsNameFromInvitation(true);
    }

    const submitted = localStorage.getItem(WISH_STORAGE_KEY);

    if (submitted === "true") {
      setHasSubmittedWish(true);
    }
  }, []);

  // Tutup dropdown jika klik di luar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const options = [
    { value: "hadir", label: t("wishes.attending") },
    { value: "tidak hadir", label: t("wishes.notAttending") },
    { value: "mungkin", label: t("wishes.maybe") },
  ];

  // ==========================
  // FETCH WISHES DARI SUPABASE
  // ==========================
  const {
    data: wishes = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["wishes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("wishes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      return data;
    },
    staleTime: 30000,
  });

  // ==========================
  // REALTIME WISHES
  // ==========================
  useEffect(() => {
    const channel = supabase
      .channel("wishes-channel")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "wishes",
        },
        (payload) => {
          queryClient.setQueryData(["wishes"], (old = []) => {
            if (old.some((item) => item.id === payload.new.id)) {
              return old;
            }

            return [payload.new, ...old];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  // ==========================
  // INSERT WISH KE SUPABASE
  // ==========================
  const createWishMutation = useMutation({
    mutationFn: async (wishData) => {
      const { data, error } = await supabase
        .from("wishes")
        .insert({
          name: wishData.name,
          attendance: wishData.attendance,
          message: wishData.message,
        })
        .select()
        .single();

      if (error) throw error;

      return data;
    },

    onSuccess: (wish) => {
      queryClient.setQueryData(["wishes"], (old = []) => [wish, ...old]);

      localStorage.setItem(WISH_STORAGE_KEY, "true");

      setHasSubmittedWish(true);
      setNewWish("");
      setAttendance("");
      setErrorMessage("");

      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    },

    onError: (err) => {
      console.error(err);

      setErrorMessage("Gagal mengirim ucapan.");

      setTimeout(() => setErrorMessage(""), 5000);
    },
  });

  const handleSubmitWish = (e) => {
    e.preventDefault();

    if (!guestName.trim() || !newWish.trim()) return;

    setErrorMessage("");

    createWishMutation.mutate({
      name: guestName.trim(),
      attendance: attendance || "MAYBE",
      message: newWish.trim(),
    });
  };

  const getAttendanceIcon = (status) => {
    const normalizedStatus = status?.toLowerCase();

    switch (normalizedStatus) {
      case "hadir":
        return (
          <CheckCircle className="w-4 h-4 text-emerald-500" />
        );

      case "tidak hadir":
      case "tidak hadir":
        return <XCircle className="w-4 h-4 text-rose-500" />;

      case "mungkin":
        return <HelpCircle className="w-4 h-4 text-amber-500" />;

      default:
        return null;
    }
  };

  return (
    <>
    <section id="wishes" className="min-h-screen relative overflow-x-hidden overflow-y-visible">
        <Confetti show={showConfetti} />

        <div className="container mx-auto px-4 py-20 relative z-10">
          {/* ===== HEADER ===== */}
          <motion.div
            variants={staggerContainer()}
            initial="hidden"
            animate="visible"
            className="text-center space-y-4 mb-16"
          >
            <motion.span
              variants={fadeUp}
              className="inline-block text-rose-500 font-medium"
            >
              {t("wishes.subTitle")}
            </motion.span>

            <motion.h2
              variants={fadeUp}
              className="text-4xl md:text-5xl font-serif text-gray-800"
            >
              {t("wishes.title")}
            </motion.h2>

            <motion.div
              variants={scaleIn}
              className="flex items-center justify-center gap-4 pt-4"
            >
              <div className="h-px w-12 bg-rose-200" />
              <MessageCircle className="w-5 h-5 text-rose-400" />
              <div className="h-px w-12 bg-rose-200" />
            </motion.div>
          </motion.div>

          {/* ===== LIST UCAPAN ===== */}
          <div className="max-w-2xl mx-auto space-y-6">
            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-rose-500" />
              </div>
            )}

            {error && (
              <div className="text-center py-12 text-rose-600">
                Gagal memuat ucapan.
              </div>
            )}

            {!isLoading && wishes.length === 0 && (
              <div className="text-center py-12">
                <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  {t("wishes.emptyState")}
                </p>
              </div>
            )}

            {!isLoading && wishes.length > 0 && (
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="
                    overflow-x-auto overflow-y-hidden
                    pb-3
                    snap-x snap-mandatory
                    touch-pan-x
                    [-webkit-overflow-scrolling:touch]
                    scrollbar-hide
                  "
                >
                  <div className="flex gap-4 w-max px-1">
                    {wishes.map((wish, index) => (
                      <motion.div
                        key={wish.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={stagger(index, 0.1)}
                        className="
                          group relative
                          w-[300px] h-[160px]
                          flex-shrink-0
                          snap-start
                          cursor-pointer
                        "
                        onClick={() => setSelectedWish(wish)}
                      >
                        {/* Background */}
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-rose-100/60 to-pink-100/60" />

                        {/* Card */}
                        <div className="relative h-full rounded-2xl border border-rose-100 bg-white/90 p-4 shadow-md flex flex-col">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center text-white font-semibold">
                              {wish.name[0].toUpperCase()}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold truncate">{wish.name}</h4>
                                {getAttendanceIcon(wish.attendance)}
                              </div>

                              <div className="flex items-center gap-1 text-xs text-gray-400">
                                <Clock className="w-3 h-3 flex-shrink-0" />
                                <span className="truncate">
                                  {formatEventDate(wish.created_at, "short")}
                                </span>
                              </div>
                            </div>
                          </div>

                          <p className="text-sm text-gray-600 line-clamp-3">
                            {wish.message}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            )}
          </div>

          {/* ===== MODAL DETAIL UCAPAN ===== */}
          <AnimatePresence>
            {selectedWish && (
              <motion.div
                variants={fade}
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={() => setSelectedWish(null)}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-2xl font-serif">
                        {selectedWish.name}
                      </h3>

                      <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                        <Clock className="w-4 h-4" />
                        {formatEventDate(
                          selectedWish.created_at,
                          "full",
                          true
                        )}
                      </div>

                      <div className="mt-3 flex items-center gap-2">
                        {getAttendanceIcon(selectedWish.attendance)}
                        <span className="text-sm">
                          {selectedWish.attendance}
                        </span>
                      </div>
                    </div>

                    <button onClick={() => setSelectedWish(null)}>
                      <XCircle className="w-6 h-6 text-gray-400" />
                    </button>
                  </div>

                  <div className="mt-6 whitespace-pre-wrap text-gray-700 leading-relaxed">
                    {selectedWish.message}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ===== FORM UCAPAN ===== */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="max-w-2xl mx-auto mt-12"
          >
            {hasSubmittedWish ? (
              <div className="bg-white/80 rounded-2xl border border-emerald-100 p-8 text-center shadow-lg">
                <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                <h3 className="text-2xl font-serif text-gray-800">
                  {t("wishes.thankYou")}
                </h3>

                <p className="text-gray-600 mt-2">
                  {t("wishes.successMessage")}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitWish}>
                <div className="bg-white/80 rounded-2xl border border-rose-100 p-6 shadow-lg space-y-4">

                  {errorMessage && (
                    <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 flex items-center gap-2 text-rose-700">
                      <AlertCircle className="w-5 h-5" />
                      {errorMessage}
                    </div>
                  )}

                  {/* Nama */}
                  <div>
                    <label className="text-sm text-gray-500 flex items-center gap-2 mb-2">
                      <User className="w-4 h-4" />
                      {t("wishes.nameLabel")}
                    </label>

                    <input
                      type="text"
                      value={guestName}
                      disabled={isNameFromInvitation}
                      onChange={(e) => {
                        setGuestName(e.target.value);
                        setIsNameFromInvitation(false);
                      }}
                      className="w-full rounded-xl border border-rose-100 px-4 py-3"
                      required
                    />
                  </div>

                  {/* Kehadiran */}
                  <div ref={dropdownRef}>
                    <label className="text-sm text-gray-500 flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4" />
                      {t("wishes.attendanceLabel")}
                    </label>

                    <button
                      type="button"
                      onClick={() => setIsOpen(!isOpen)}
                      className="w-full rounded-xl border border-rose-100 px-4 py-3 flex justify-between items-center"
                    >
                      {attendance
                        ? options.find((o) => o.value === attendance)?.label
                        : t("wishes.attendancePlaceholder")}

                      <ChevronDown className="w-5 h-5" />
                    </button>

                    {isOpen && (
                      <div className="mt-2 rounded-xl border border-rose-100 bg-white overflow-hidden shadow-lg">
                        {options.map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => {
                              setAttendance(option.value);
                              setIsOpen(false);
                            }}
                            className="block w-full text-left px-4 py-3 hover:bg-rose-50"
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Pesan */}
                  <div>
                    <label className="text-sm text-gray-500 flex items-center gap-2 mb-2">
                      <MessageCircle className="w-4 h-4" />
                      {t("wishes.wishLabel")}
                    </label>

                    <textarea
                      value={newWish}
                      onChange={(e) => setNewWish(e.target.value)}
                      className="w-full h-32 rounded-xl border border-rose-100 p-4 resize-none"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={createWishMutation.isPending}
                    className="w-full bg-rose-500 hover:bg-rose-600 text-white rounded-xl py-3 flex items-center justify-center gap-2 disabled:bg-gray-400"
                  >
                    {createWishMutation.isPending ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}

                    {createWishMutation.isPending
                      ? t("wishes.sending")
                      : t("wishes.sendButton")}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </section>
    </>
  );
}
