"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarCheck, Check, MessageCircle, Pencil } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { useStoreClock } from "@/components/store/useStoreClock";
import { ExternalButton, buttonClass } from "@/components/ui/Button";
import { services } from "@/content/services";
import { site } from "@/content/site";
import { whatsappLink } from "@/lib/format";
import { formatClock, formatDayShort, hoursOn, inStoreTime, slotsFor, upcomingDays } from "@/lib/time";

const bookable = services.filter((s) => s.bookable);

const schema = z.object({
  service: z.string().refine((v) => bookable.some((s) => s.slug === v), "Choose what you'd like to book"),
  date: z.string().min(1, "Pick a day"),
  slot: z.string().min(1, "Pick a time"),
  name: z.string().trim().min(2, "Please enter your name"),
  phone: z
    .string()
    .refine((v) => /^(?:\+?91)?[6-9]\d{9}$/.test(v.replace(/[\s-]/g, "")), "Enter a valid 10-digit mobile number"),
  notes: z.string().max(300, "Please keep notes under 300 characters"),
});

type Booking = z.infer<typeof schema>;

const legend = "mb-3 text-sm font-semibold";
// `relative` keeps the sr-only (absolutely positioned) radio inside its chip, so it can't widen the page
const choice =
  "group relative cursor-pointer rounded-2xl border border-line bg-white/50 transition-colors hover:border-ink/40 has-checked:border-ink has-checked:bg-ink has-checked:text-paper has-focus-visible:ring-2 has-focus-visible:ring-accent";
const input =
  "h-12 w-full rounded-xl border border-line bg-white/60 px-4 text-[16px] outline-none transition-colors focus:border-ink aria-invalid:border-accent";

function FieldError({ message }: { message?: string }) {
  return message ? <p className="mt-2 text-sm text-accent-deep">{message}</p> : null;
}

/**
 * Eye-exam booking. No backend yet: the form validates the request and hands it to
 * WhatsApp; the store confirms the slot in the chat. Nothing is stored by the website.
 */
export function ExamBookingWidget() {
  const clock = useStoreClock();
  const [request, setRequest] = useState<{ message: string; service: string; when: string } | null>(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<Booking>({
    resolver: zodResolver(schema),
    defaultValues: { service: bookable[0].slug, date: "", slot: "", name: "", phone: "", notes: "" },
  });

  const selectedDate = useWatch({ control, name: "date" });
  const now = clock ? inStoreTime(clock) : null;
  const days = clock && now ? upcomingDays(14, clock).filter((d) => hoursOn(d.weekday)) : [];
  const day = days.find((d) => d.ymd === selectedDate);
  const slots = day && now ? slotsFor(day, now) : [];

  const onSubmit = (data: Booking) => {
    const service = bookable.find((s) => s.slug === data.service)!.title;
    const chosen = days.find((d) => d.ymd === data.date);
    const when = `${chosen ? formatDayShort(chosen.date) : data.date}, ${formatClock(Number(data.slot))}`;
    const message = [
      `Hi ${site.shortName}! I'd like to book an appointment.`,
      `• ${service}`,
      `• ${when}`,
      `• Name: ${data.name.trim()}`,
      `• Phone: ${data.phone}`,
      data.notes.trim() ? `• Notes: ${data.notes.trim()}` : null,
    ]
      .filter(Boolean)
      .join("\n");
    setRequest({ message, service, when });
  };

  return (
    <div className="rounded-[2rem] border border-line bg-paper p-5 shadow-[0_30px_80px_-40px_rgba(23,24,27,0.35)] sm:p-8">
      <AnimatePresence mode="wait" initial={false}>
        {request ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="py-4 text-center"
          >
            <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-whatsapp/15 text-whatsapp">
              <Check className="size-7" />
            </span>
            <h3 className="mt-4 font-display text-3xl">One last step</h3>
            <p className="mx-auto mt-2 max-w-sm text-ink-soft">
              Send your request on WhatsApp. We&apos;ll reply to confirm your slot.
            </p>
            <div className="mx-auto mt-6 max-w-sm rounded-2xl bg-ink/5 p-4 text-left text-sm">
              <p className="font-medium">{request.service}</p>
              <p className="text-ink-soft">{request.when}</p>
            </div>
            <div className="mx-auto mt-6 flex max-w-sm flex-col gap-3">
              <ExternalButton variant="whatsapp" href={whatsappLink(request.message)}>
                <MessageCircle className="size-5" /> Send on WhatsApp
              </ExternalButton>
              <button type="button" onClick={() => setRequest(null)} className={buttonClass("ghost")}>
                <Pencil className="size-4" /> Edit details
              </button>
            </div>
            <p className="mt-4 text-xs text-muted">
              Prefer to call?{" "}
              <a href={`tel:${site.phoneE164}`} className="underline underline-offset-2">
                {site.phone}
              </a>
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="space-y-7"
          >
            <fieldset className="min-w-0">
              <legend className={legend}>1. What would you like to book?</legend>
              <div className="grid gap-2 sm:grid-cols-3">
                {bookable.map((s) => (
                  <label key={s.slug} className={`${choice} px-4 py-3`}>
                    <input type="radio" value={s.slug} className="sr-only" {...register("service")} />
                    <span className="block font-medium">{s.shortTitle}</span>
                    <span className="block text-xs text-muted group-has-checked:text-paper/70">{s.duration}</span>
                  </label>
                ))}
              </div>
              <FieldError message={errors.service?.message} />
            </fieldset>

            <fieldset className="min-w-0">
              <legend className={legend}>2. Pick a day</legend>
              <div className="-mx-5 flex snap-x gap-2 overflow-x-auto px-5 pb-1 sm:-mx-8 sm:px-8">
                {clock
                  ? days.map((d, i) => {
                      const [weekday, dayNum, month] = formatDayShort(d.date).replace(",", "").split(" ");
                      return (
                        <label key={d.ymd} className={`${choice} w-[4.5rem] shrink-0 snap-start py-2.5 text-center`}>
                          <input
                            type="radio"
                            value={d.ymd}
                            className="sr-only"
                            {...register("date", { onChange: () => setValue("slot", "") })}
                          />
                          <span className="block text-[11px] tracking-wide text-muted uppercase group-has-checked:text-paper/70">
                            {i === 0 && d.ymd === now?.ymd ? "Today" : weekday}
                          </span>
                          <span className="block font-display text-2xl leading-tight">{dayNum}</span>
                          <span className="block text-[11px] text-muted group-has-checked:text-paper/70">{month}</span>
                        </label>
                      );
                    })
                  : Array.from({ length: 6 }, (_, i) => (
                      <span key={i} className="h-[76px] w-[4.5rem] shrink-0 animate-pulse rounded-2xl bg-ink/5" />
                    ))}
              </div>
              <FieldError message={errors.date?.message} />
            </fieldset>

            <fieldset className="min-w-0">
              <legend className={legend}>3. Pick a time</legend>
              {!day ? (
                <p className="rounded-2xl border border-dashed border-line px-4 py-5 text-center text-sm text-muted">
                  Choose a day to see available times
                </p>
              ) : slots.length ? (
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {slots.map((t) => (
                    <label key={t} className={`${choice} py-2.5 text-center text-sm`}>
                      <input type="radio" value={String(t)} className="sr-only" {...register("slot")} />
                      {formatClock(t)}
                    </label>
                  ))}
                </div>
              ) : (
                <p className="rounded-2xl border border-dashed border-line px-4 py-5 text-center text-sm text-muted">
                  No slots left today — please pick another day.
                </p>
              )}
              <FieldError message={errors.slot?.message} />
            </fieldset>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="booking-name" className={legend + " block"}>
                  Your name
                </label>
                <input
                  id="booking-name"
                  autoComplete="name"
                  aria-invalid={!!errors.name}
                  className={input}
                  {...register("name")}
                />
                <FieldError message={errors.name?.message} />
              </div>
              <div>
                <label htmlFor="booking-phone" className={legend + " block"}>
                  Mobile number
                </label>
                <div className="relative">
                  <span className="absolute top-1/2 left-4 -translate-y-1/2 text-muted">+91</span>
                  <input
                    id="booking-phone"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel-national"
                    aria-invalid={!!errors.phone}
                    className={`${input} pl-13`}
                    {...register("phone")}
                  />
                </div>
                <FieldError message={errors.phone?.message} />
              </div>
            </div>

            <div>
              <label htmlFor="booking-notes" className={legend + " block"}>
                Anything we should know? <span className="font-normal text-muted">(optional)</span>
              </label>
              <textarea
                id="booking-notes"
                rows={3}
                placeholder="e.g. current power, headaches, booking for a child aged 8"
                aria-invalid={!!errors.notes}
                className={`${input} h-auto py-3`}
                {...register("notes")}
              />
              <FieldError message={errors.notes?.message} />
            </div>

            <div>
              <button type="submit" className={buttonClass("primary", "w-full")}>
                <CalendarCheck className="size-4" /> Continue
              </button>
              <p className="mt-3 text-center text-xs text-muted">
                Your slot is confirmed when we reply on WhatsApp. Nothing you enter is stored on this website.
              </p>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
