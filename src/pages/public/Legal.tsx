import React from 'react';
import { motion } from 'motion/react';
import { useLocation } from 'react-router-dom';

export default function Legal() {
  const { pathname } = useLocation();
  const isImprint = pathname === '/imprint';

  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-7xl font-serif text-white mb-12 tracking-tight italic">
            {isImprint ? 'Impressum' : 'Datenschutz'}
          </h1>

          <div className="prose prose-invert max-w-none text-gray-400 font-light leading-relaxed space-y-12">
            {isImprint ? (
              <>
                <section>
                  <h3 className="text-2xl font-serif text-slate-50 italic mb-4">Angaben gemäß § 5 TMG</h3>
                  <p>
                    Viktor Labs<br />
                    Musterstraße 123<br />
                    10115 Berlin
                  </p>
                </section>

                <section>
                  <h3 className="text-2xl font-serif text-slate-50 italic mb-4">Kontakt</h3>
                  <p>
                    Telefon: +49 (0) 123 456 789 0<br />
                    E-Mail: hello@viktor-labs.ai
                  </p>
                </section>

                <section>
                  <h3 className="text-2xl font-serif text-white italic mb-4">Umsatzsteuer-ID</h3>
                  <p>
                    Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:<br />
                    DE 123 456 789
                  </p>
                </section>

                <section>
                  <h3 className="text-2xl font-serif text-white italic mb-4">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h3>
                  <p>
                    Max Mustermann<br />
                    Musterstraße 123<br />
                    10115 Berlin
                  </p>
                </section>
              </>
            ) : (
              <>
                <section>
                  <h3 className="text-2xl font-serif text-white italic mb-4">1. Datenschutz auf einen Blick</h3>
                  <p>
                    Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.
                  </p>
                </section>

                <section>
                  <h3 className="text-2xl font-serif text-white italic mb-4">2. Datenerfassung auf unserer Website</h3>
                  <p>
                    Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten können Sie dem Impressum dieser Website entnehmen. Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen. Hierbei kann es sich z. B. um Daten handeln, die Sie in ein Kontaktformular eingeben.
                  </p>
                </section>

                <section>
                  <h3 className="text-2xl font-serif text-white italic mb-4">3. Analyse-Tools und Tools von Drittanbietern</h3>
                  <p>
                    Beim Besuch dieser Website kann Ihr Surf-Verhalten statistisch ausgewertet werden. Das geschieht vor allem mit Cookies und mit sogenannten Analyseprogrammen. Die Analyse Ihres Surf-Verhaltens erfolgt in der Regel anonym; das Surf-Verhalten kann nicht zu Ihnen zurückverfolgt werden.
                  </p>
                </section>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
