import { Metadata } from "next";
import {
  Mail,
  MapPin,
  MessageCircle,
  PhoneCall,
  Send,
  Timer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const metadata: Metadata = {
  title: "Contact Aura Shop",
  description:
    "Reach Aura Shop support for orders, partnerships, or product questions. We respond within hours, not days.",
};

const channels = [
  {
    icon: <PhoneCall className="h-5 w-5" />,
    label: "Call us",
    value: "+1 (800) 555-0199",
    helper: "9am – 7pm EST, Mon–Sat",
  },
  {
    icon: <Mail className="h-5 w-5" />,
    label: "Email",
    value: "support@aurashop.com",
    helper: "We reply in under 4 business hours",
  },
  {
    icon: <MessageCircle className="h-5 w-5" />,
    label: "Chat",
    value: "Live chat (beta)",
    helper: "Tap the chat bubble on any product page",
  },
];

const office = {
  address: "210 Market Street, Suite 405, San Francisco, CA",
  hours: "Monday – Saturday, 9:00am to 7:00pm",
};

export default function ContactPage() {
  return (
    <div className="flex flex-col gap-14 pb-16">
      <section className="container px-4 md:px-6">
        <div className="rounded-3xl border bg-gradient-to-r from-secondary/50 via-background to-background p-10 md:p-14 flex flex-col gap-6">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold text-primary">
            <Timer className="h-4 w-4" /> Average response: 4 hours
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-(--primary)">
            Contact our team—real people, ready to help.
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Whether you need order support, product guidance, or partnership
            info, we keep replies fast and clear. Share a few details and we
            will get back shortly.
          </p>
        </div>
      </section>

      <section className="container px-4 md:px-6 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <div className="space-y-1 mb-6">
              <h2 className="text-2xl font-bold text-(--primary)">
                Send us a note
              </h2>
              <p className="text-sm text-muted-foreground">
                Fill this form and we will route it to the right specialist.
              </p>
            </div>
            <form className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Input placeholder="Full name" required />
                <Input type="email" placeholder="Email address" required />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <Input placeholder="Order ID (optional)" />
                <Input placeholder="Topic (e.g., shipping, returns, sizing)" />
              </div>
              <Textarea rows={4} placeholder="How can we help?" required />
              <Button type="submit" className="px-6">
                Send message <Send className="ml-2 h-4 w-4" />
              </Button>
            </form>
            <p className="text-xs text-muted-foreground mt-3">
              By submitting, you agree to receive updates about your request. We
              never share your email.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border bg-card p-5 shadow-sm space-y-4">
            <h3 className="text-lg font-semibold text-(--primary)">
              Quick links
            </h3>
            <div className="grid gap-3">
              {channels.map((item) => (
                <div
                  key={item.label}
                  className="flex gap-3 rounded-xl border bg-background p-4"
                >
                  <div className="mt-1 text-primary">{item.icon}</div>
                  <div>
                    <div className="font-medium text-(--primary)">
                      {item.label}
                    </div>
                    <div className="text-sm">{item.value}</div>
                    <div className="text-xs text-muted-foreground">
                      {item.helper}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border bg-muted/30 p-5 shadow-sm space-y-3">
            <h3 className="text-lg font-semibold text-(--primary)">Visit us</h3>
            <div className="flex items-start gap-3 text-sm">
              <MapPin className="h-4 w-4 text-primary mt-0.5" />
              <div>
                <div className="font-medium">{office.address}</div>
                <div className="text-muted-foreground">{office.hours}</div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Showroom visits are by appointment so we can prep samples and
              sizing.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
