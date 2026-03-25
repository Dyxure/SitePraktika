import { useEffect, useState } from "react";
import { submitBooking } from "../lib/api";

export type BookingOfferType = "direction" | "workshop" | "course";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  offerType: BookingOfferType | null;
  offerTitle: string;
};

export default function BookingModal({
  isOpen,
  onClose,
  offerType,
  offerTitle,
}: Props) {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setFullName("");
      setPhone("");
      setEmail("");
      setStatus("idle");
      setError("");
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!offerType || !offerTitle.trim()) return;
    setError("");
    setStatus("submitting");
    try {
      await submitBooking({
        fullName: fullName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        offerType,
        offerTitle: offerTitle.trim(),
      });
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Ошибка отправки");
    }
  }

  if (!isOpen || !offerType) return null;

  const kindLabel =
    offerType === "direction"
      ? "Направление"
      : offerType === "workshop"
        ? "Мастер-класс"
        : "Курс";

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="modal-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-modal-title"
        onClick={(ev) => ev.stopPropagation()}
      >
        <button
          type="button"
          className="modal-close"
          onClick={onClose}
          aria-label="Закрыть"
        >
          ×
        </button>
        <h2 id="booking-modal-title" className="modal-title">
          Записаться
        </h2>
        <p className="modal-subtitle">
          {kindLabel}: <strong>{offerTitle}</strong>
        </p>

        {status === "success" ? (
          <p className="modal-success">
            Заявка отправлена. Мы свяжемся с вами по телефону или почте.
          </p>
        ) : (
          <form className="modal-form" onSubmit={handleSubmit}>
            <div className="modal-field">
              <label htmlFor="booking-fio">ФИО</label>
              <input
                id="booking-fio"
                name="fullName"
                type="text"
                autoComplete="name"
                required
                value={fullName}
                onChange={(ev) => setFullName(ev.target.value)}
                placeholder="Иванова Мария Ивановна"
              />
            </div>
            <div className="modal-field">
              <label htmlFor="booking-phone">Телефон</label>
              <input
                id="booking-phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                required
                value={phone}
                onChange={(ev) => setPhone(ev.target.value)}
                placeholder="+7 …"
              />
            </div>
            <div className="modal-field">
              <label htmlFor="booking-email">Электронная почта</label>
              <input
                id="booking-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(ev) => setEmail(ev.target.value)}
                placeholder="name@example.com"
              />
            </div>
            {status === "error" ? (
              <p className="modal-error" role="alert">
                {error || "Не удалось отправить. Попробуйте позже."}
              </p>
            ) : null}
            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-outline"
                onClick={onClose}
              >
                Отмена
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={status === "submitting"}
              >
                {status === "submitting" ? "Отправка…" : "Отправить"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
