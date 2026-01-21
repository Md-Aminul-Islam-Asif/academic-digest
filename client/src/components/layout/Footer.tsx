import { motion } from "framer-motion";
import { Github, Mail, Globe } from "lucide-react";

export function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="mt-20 backdrop-blur-md bg-white/5 dark:bg-black/20 border-t border-border/40 text-muted-foreground"
    >
      <div className="max-w-7xl mx-auto px-6 py-12 grid gap-8 md:grid-cols-3 text-sm">
        
        {/* Left */}
        <div>
          <h3 className="font-semibold text-foreground mb-3 text-lg">
            Academic Digest
          </h3>
          <p className="leading-relaxed">
            A modern library management system designed for university
            students and administrators.
          </p>
        </div>

        {/* Center */}
        <div>
          <h3 className="font-semibold text-foreground mb-3 text-lg">
            Quick Links
          </h3>
          <ul className="space-y-2">
            <li>
              <a href="/" className="hover:text-foreground transition">
                Dashboard
              </a>
            </li>
            <li>
              <a href="/books" className="hover:text-foreground transition">
                Books
              </a>
            </li>
            <li>
              <a href="/feedback" className="hover:text-foreground transition">
                Feedback
              </a>
            </li>
            <li>
              <a href="/discounts" className="hover:text-foreground transition">
                Discounts
              </a>
            </li>
          </ul>
        </div>

        {/* Right */}
        <div>
          <h3 className="font-semibold text-foreground mb-3 text-lg">
            Contact
          </h3>

          <a
            href="mailto:aminuulasif20@gmail.com"
            className="flex items-center gap-3 hover:text-foreground transition"
          >
            <Mail className="h-4 w-4" />
            <span>aminuulasif20@gmail.com</span>
          </a>

          <a
            href="https://github.com/Md-Aminul-Islam-Asif"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 mt-3 hover:text-foreground transition"
          >
            <Github className="h-4 w-4" />
            <span>github.com/Md-Aminul-Islam-Asif</span>
          </a>

          <div className="flex items-center gap-3 mt-3">
            <Globe className="h-4 w-4" />
            <span>University Project</span>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="text-center py-4 text-xs border-t border-border/40">
        © {new Date().getFullYear()} Academic Digest. All rights reserved.
      </div>
    </motion.footer>
  );
}
