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
              <div className="space-y-16">
                <section>
                  <h2 className="text-3xl font-serif text-white italic mb-6 border-b border-white/10 pb-4">Angaben gemäß § 5 Digitale-Dienste-Gesetz (DDG)</h2>
                  <p>
                    <strong>Viktor Labs</strong><br />
                    Rechtsform: <span className="text-amber-500">[Einzelunternehmen / UG / GmbH]</span><br />
                    Vertreten durch:<br />
                    <span className="text-amber-500">[Vor- und Nachname des Inhabers bzw. Geschäftsführers]</span>
                  </p>
                </section>
                
                <section>
                  <h2 className="text-3xl font-serif text-white italic mb-6 border-b border-white/10 pb-4">Geschäftsanschrift</h2>
                  <p>
                    <span className="text-amber-500">[Straße und Hausnummer]</span><br />
                    <span className="text-amber-500">[PLZ Ort]</span><br />
                    Deutschland
                  </p>
                </section>

                <section>
                  <h2 className="text-3xl font-serif text-white italic mb-6 border-b border-white/10 pb-4">Kontakt</h2>
                  <p>
                    E-Mail: <a href="mailto:contact@viktorlabs.dev" className="text-cyan-500 hover:text-cyan-400">contact@viktorlabs.dev</a><br />
                    Telefon: <span className="text-amber-500">[Telefonnummer]</span><br />
                    Website: <a href="https://viktor-labs.vercel.app" target="_blank" rel="noopener noreferrer" className="text-cyan-500">https://viktor-labs.vercel.app</a><br />
                    <em className="text-xs text-slate-500 mt-2 block">(Nach Erwerb einer eigenen Domain wird diese entsprechend ersetzt.)</em>
                  </p>
                </section>

                <section>
                  <h2 className="text-3xl font-serif text-white italic mb-6 border-b border-white/10 pb-4">Registereintrag</h2>
                  <p>
                    Handelsregister: <span className="text-amber-500">[Registergericht]</span><br />
                    Registernummer: <span className="text-amber-500">[HRB/HRA]</span><br />
                    <em className="text-xs text-slate-500 mt-2 block">(Hinweis: Nur auszufüllen, sofern eine Eintragung im Handelsregister vorliegt. Bei einem nicht im Handelsregister eingetragenen Einzelunternehmen entfällt dieser Block.)</em>
                  </p>
                </section>

                <section>
                  <h2 className="text-3xl font-serif text-white italic mb-6 border-b border-white/10 pb-4">Umsatzsteuer</h2>
                  <p>
                    Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG:<br />
                    <span className="text-amber-500">[USt-IdNr.]</span><br />
                    <em className="text-xs text-slate-500 mt-2 block">(Falls vorhanden. Kleinunternehmer nach § 19 UStG haben in der Regel keine USt-IdNr. und lassen diesen Punkt frei oder ergänzen den Hinweis.)</em>
                  </p>
                </section>

                <section>
                  <h2 className="text-3xl font-serif text-white italic mb-6 border-b border-white/10 pb-4">Verantwortlichkeit für Inhalte</h2>
                  <p>
                    Als Diensteanbieter ist Viktor Labs gemäß den gesetzlichen Vorschriften für eigene Inhalte auf diesen Seiten verantwortlich. Trotz sorgfältiger Erstellung aller Inhalte übernehmen wir jedoch keine Gewähr für deren Vollständigkeit, Richtigkeit oder Aktualität.
                  </p>
                  <p className="mt-4">
                    Eine Verpflichtung zur Überwachung übermittelter oder gespeicherter fremder Informationen besteht nur im Rahmen der gesetzlichen Vorschriften. Sobald konkrete Rechtsverletzungen bekannt werden, werden entsprechende Inhalte unverzüglich entfernt.
                  </p>
                </section>

                <section>
                  <h2 className="text-3xl font-serif text-white italic mb-6 border-b border-white/10 pb-4">Haftung für Links</h2>
                  <p>
                    Unsere Website enthält gegebenenfalls Links zu externen Websites Dritter. Auf deren Inhalte haben wir keinen Einfluss. Deshalb übernehmen wir für diese fremden Inhalte keine Gewähr. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Betreiber verantwortlich.
                  </p>
                  <p className="mt-4">
                    Zum Zeitpunkt der Verlinkung wurden die Seiten auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zu diesem Zeitpunkt nicht erkennbar. Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist ohne konkrete Anhaltspunkte einer Rechtsverletzung jedoch nicht zumutbar.
                  </p>
                </section>

                <section>
                  <h2 className="text-3xl font-serif text-white italic mb-6 border-b border-white/10 pb-4">Urheberrecht</h2>
                  <p>
                    Alle auf dieser Website veröffentlichten Inhalte, Texte, Grafiken, Logos, Bilder, Softwarebestandteile sowie sonstige Werke unterliegen – sofern nicht anders gekennzeichnet – dem Urheberrecht.
                  </p>
                  <p className="mt-4">
                    Jede Vervielfältigung, Bearbeitung, Verbreitung oder sonstige Nutzung außerhalb der Grenzen des Urheberrechts bedarf der vorherigen schriftlichen Zustimmung von Viktor Labs bzw. des jeweiligen Rechteinhabers.
                  </p>
                  <p className="mt-4">
                    Downloads und Kopien dieser Website sind ausschließlich für den privaten und nicht kommerziellen Gebrauch gestattet, sofern gesetzlich nichts anderes vorgesehen ist.
                  </p>
                </section>

                <section>
                  <h2 className="text-3xl font-serif text-white italic mb-6 border-b border-white/10 pb-4">Streitbeilegung</h2>
                  <p>
                    Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS-Plattform) bereit: 
                    <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" className="text-cyan-500 ml-1">https://ec.europa.eu/consumers/odr/</a>.
                  </p>
                  <p className="mt-4">
                    Viktor Labs ist weder verpflichtet noch bereit, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen, sofern keine gesetzliche Verpflichtung besteht.
                  </p>
                </section>

                <section>
                  <h2 className="text-3xl font-serif text-white italic mb-6 border-b border-white/10 pb-4">Geltungsbereich</h2>
                  <p>
                    Dieses Impressum gilt für sämtliche Online-Angebote von Viktor Labs, insbesondere für die Unternehmenswebsite, Kundenportale, Webanwendungen sowie die offiziellen Social-Media-Profile, soweit dort gesetzlich erforderlich.
                  </p>
                </section>
              </div>
            ) : (
              <div className="space-y-16">
                <section id="allgemeines">
                  <h2 className="text-3xl font-serif text-white italic mb-6 border-b border-white/10 pb-4">Allgemeines</h2>
                  <h3 className="text-xl font-display font-bold text-slate-200 mt-8 mb-4">1. Einleitung</h3>
                  <p>Der Schutz Ihrer personenbezogenen Daten ist für Viktor Labs ein zentrales Anliegen. Im Rahmen unserer Tätigkeit als Agentur für digitale Lösungen und KI-Automatisierung verarbeiten wir Daten mit höchster Sorgfalt. Diese Erklärung informiert Sie umfassend über die Verarbeitung Ihrer Daten im gesamten Geschäftsbetrieb.</p>

                  <h3 className="text-xl font-display font-bold text-slate-200 mt-8 mb-4">2. Verantwortlicher</h3>
                  <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                    <p className="font-bold text-white mb-1">Viktor Labs</p>
                    <p>Inhaber: Viktor</p>
                    <p>Anschrift: Virtuelles Büro Hannover, Niedersachsen, Deutschland</p>
                    <p>E-Mail: <a href="mailto:contact@viktorlabs.dev" className="text-cyan-500">contact@viktorlabs.dev</a></p>
                  </div>

                  <h3 className="text-xl font-display font-bold text-slate-200 mt-8 mb-4">3. Rechtsgrundlagen</h3>
                  <p>Die Verarbeitung erfolgt auf Basis der DSGVO (Art. 6 Abs. 1 lit. a, b, c, f). Wir erheben Daten zur Vertragserfüllung, aufgrund rechtlicher Verpflichtungen oder zur Wahrung unserer berechtigten Interessen an einem sicheren Geschäftsbetrieb.</p>
                </section>

                <section id="infrastruktur">
                  <h2 className="text-3xl font-serif text-white italic mb-6 border-b border-white/10 pb-4">Website und technische Infrastruktur</h2>
                  <h3 className="text-xl font-display font-bold text-slate-200 mt-8 mb-4">1. Hosting (Vercel)</h3>
                  <p>Unsere Website wird bei <strong>Vercel Inc.</strong> (USA) gehostet. Vercel stellt die Infrastruktur bereit. Die Übermittlung in die USA ist durch EU-Standardvertragsklauseln abgesichert.</p>
                  
                  <h3 className="text-xl font-display font-bold text-slate-200 mt-8 mb-4">2. Vercel Analytics</h3>
                  <p>Wir nutzen Vercel Analytics zur Performance-Optimierung. Dabei werden technische Nutzungsdaten und aggregierte Analyseinformationen verarbeitet, um die Stabilität der Seite zu messen.</p>

                  <h3 className="text-xl font-display font-bold text-slate-200 mt-8 mb-4">3. Consent-Management</h3>
                  <p>Wir nutzen ein Consent-Management-System zur Verwaltung Ihrer Einwilligungen. Technisch notwendige Cookies werden sofort gesetzt; Analyse-Cookies erst nach Ihrer aktiven Zustimmung.</p>
                </section>

                <section id="dienste">
                  <h2 className="text-3xl font-serif text-white italic mb-6 border-b border-white/10 pb-4">Eingesetzte Dienste & KI-Infrastruktur</h2>
                  <div className="bg-cyan-500/10 border-l-4 border-cyan-500 p-6 rounded-r-2xl my-8">
                    <p className="text-cyan-400 font-bold mb-2">Hinweis zur KI-Nutzung:</p>
                    <p className="text-slate-300">Wir verwenden soweit möglich API-basierte Dienste. Nach den jeweiligen Anbieterbedingungen werden über diese Schnittstellen übermittelte Kundendaten <strong>nicht</strong> für das Training öffentlicher Modelle verwendet.</p>
                  </div>
                  
                  <h3 className="text-xl font-display font-bold text-slate-200 mt-8 mb-4">1. KI-Sprachmodelle</h3>
                  <p>Wir setzen Modelle von <strong>OpenAI, Anthropic (Claude) und Google (Gemini)</strong> ein. Sensible Daten wie Passwörter werden aktiv von der KI-Verarbeitung ausgeschlossen.</p>

                  <h3 className="text-xl font-display font-bold text-slate-200 mt-8 mb-4">2. Backend (Supabase & Make)</h3>
                  <p>Wir nutzen <strong>Supabase</strong> zur Datenverwaltung im Kunden-Dashboard (E-Mail und Passwort-Hashes) sowie <strong>Make</strong> zur Workflow-Automatisierung.</p>
                </section>

                <section id="projekte">
                  <h2 className="text-3xl font-serif text-white italic mb-6 border-b border-white/10 pb-4">Dienstleistungen und Projektabwicklung</h2>
                  <h3 className="text-xl font-display font-bold text-slate-200 mt-8 mb-4">1. Kontaktaufnahme & WhatsApp</h3>
                  <p>Bei einer Kontaktaufnahme über WhatsApp werden personenbezogene Daten übermittelt. Dabei erfolgt eine Verarbeitung durch WhatsApp Ireland Limited (Meta). Für vertrauliche Informationen empfehlen wir alternative Kontaktwege.</p>

                  <h3 className="text-xl font-display font-bold text-slate-200 mt-8 mb-4">2. Kunden-Dashboard</h3>
                  <p>Im geschützten Kundenbereich verarbeiten wir Login-Daten, technisch notwendige Session-Cookies sowie Ihre Projektdokumente. Der Zugriff ist auf autorisierte Nutzer beschränkt.</p>

                  <h3 className="text-xl font-display font-bold text-slate-200 mt-8 mb-4">3. KI-Verarbeitung im Projektalltag</h3>
                  <p>KI unterstützt uns bei der Strukturierung von Projektinfos. Alle wesentlichen KI-generierten Ergebnisse werden durch uns menschlich geprüft (Human-in-the-loop).</p>
                </section>

                <section id="socialmedia">
                  <h2 className="text-3xl font-serif text-white italic mb-6 border-b border-white/10 pb-4">Social Media & Externe Präsenzen</h2>
                  <p>Wir unterhalten Profile auf LinkedIn und Instagram. Für bestimmte Verarbeitungsvorgänge können gemeinsame Verantwortlichkeiten mit den Plattformbetreibern bestehen. Daten, die Sie uns per Privatnachricht senden, verarbeiten wir zur Kommunikation mit Ihnen.</p>
                </section>

                <section id="rechte">
                  <h2 className="text-3xl font-serif text-white italic mb-6 border-b border-white/10 pb-4">Ihre Rechte und Sicherheit</h2>
                  <p>Sie haben das Recht auf <strong>Auskunft, Berichtigung, Löschung, Einschränkung, Datenübertragbarkeit</strong> sowie das Recht auf <strong>Widerspruch</strong> (Art. 21 DSGVO).</p>
                  
                  <h3 className="text-xl font-display font-bold text-slate-200 mt-8 mb-4">1. Keine automatisierte Entscheidungsfindung</h3>
                  <p>Es findet keine automatisierte Entscheidungsfindung einschließlich Profiling gemäß Art. 22 DSGVO statt.</p>

                  <h3 className="text-xl font-display font-bold text-slate-200 mt-8 mb-4">2. Aufbewahrungsfristen</h3>
                  <p>Wir speichern Projektdaten für die Dauer der Zusammenarbeit. Gesetzliche Aufbewahrungspflichten (z. B. 10 Jahre gemäß AO/HGB für Rechnungen) bleiben unberührt.</p>

                  <p className="mt-12 text-slate-300">Bei Fragen zum Datenschutz wenden Sie sich bitte an: <a href="mailto:contact@viktorlabs.dev" className="text-cyan-500 font-bold">contact@viktorlabs.dev</a></p>
                </section>
                
                <div className="text-center text-slate-500 italic pt-20">
                  Stand: 30. Juli 2026
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
