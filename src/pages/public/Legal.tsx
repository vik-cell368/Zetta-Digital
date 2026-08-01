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
                <section>
                  <h2 className="text-3xl font-serif text-white italic mb-6 border-b border-white/10 pb-4">1. Verantwortlicher</h2>
                  <p>
                    Verantwortlicher für die Verarbeitung personenbezogener Daten im Sinne der Datenschutz-Grundverordnung (DSGVO) ist:
                  </p>
                  <div className="bg-white/5 border border-white/10 p-6 rounded-2xl mt-6">
                    <p className="font-bold text-white mb-1">Viktor Labs</p>
                    <p>Inhaber: <span className="text-amber-500">[Vor- und Nachname]</span></p>
                    <p>Anschrift: <span className="text-amber-500">[Geschäftsanschrift]</span></p>
                    <p>E-Mail: <span className="text-amber-500">[E-Mail-Adresse]</span></p>
                    <p>Website: <span className="text-amber-500">[Website]</span></p>
                  </div>
                </section>

                <section>
                  <h2 className="text-3xl font-serif text-white italic mb-6 border-b border-white/10 pb-4">2. Geltungsbereich dieser Datenschutzerklärung</h2>
                  <p>Diese Datenschutzerklärung informiert über die Verarbeitung personenbezogener Daten durch Viktor Labs im Rahmen der gesamten geschäftlichen Tätigkeit.</p>
                  <p className="mt-4">Sie gilt insbesondere für:</p>
                  <ul className="list-disc pl-6 space-y-2 mt-4">
                    <li>den Besuch unserer Website</li>
                    <li>Kontaktaufnahme über digitale Kommunikationswege</li>
                    <li>Terminvereinbarungen über unsere Website</li>
                    <li>Kunden- und Projektanfragen</li>
                    <li>Entwicklung von Websites</li>
                    <li>Entwicklung digitaler Lösungen und KI-gestützter Automatisierungen</li>
                    <li>Vertrags- und Rechnungsverwaltung</li>
                    <li>Kommunikation über soziale Netzwerke</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-3xl font-serif text-white italic mb-6 border-b border-white/10 pb-4">3. Allgemeine Hinweise zur Datenverarbeitung</h2>
                  <p>Personenbezogene Daten sind Informationen, die sich auf eine identifizierte oder identifizierbare Person beziehen.</p>
                  <p className="mt-4">Hierzu gehören beispielsweise:</p>
                  <ul className="list-disc pl-6 space-y-2 mt-4">
                    <li>Name, Adresse, E-Mail-Adresse, Telefonnummer</li>
                    <li>IP-Adresse</li>
                    <li>Vertrags- und Kommunikationsdaten</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-3xl font-serif text-white italic mb-6 border-b border-white/10 pb-4">4. Rechtsgrundlagen der Verarbeitung</h2>
                  <ul className="list-disc pl-6 space-y-2 mt-4">
                    <li><strong>Art. 6 Abs. 1 lit. a DSGVO</strong> – Einwilligung</li>
                    <li><strong>Art. 6 Abs. 1 lit. b DSGVO</strong> – Vertragserfüllung und vorvertragliche Maßnahmen</li>
                    <li><strong>Art. 6 Abs. 1 lit. c DSGVO</strong> – Erfüllung gesetzlicher Verpflichtungen</li>
                    <li><strong>Art. 6 Abs. 1 lit. f DSGVO</strong> – Berechtigte Interessen</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-3xl font-serif text-white italic mb-6 border-b border-white/10 pb-4">5. Datensicherheit</h2>
                  <p>Wir treffen geeignete technische und organisatorische Maßnahmen, um personenbezogene Daten vor Verlust, Missbrauch und unberechtigtem Zugriff zu schützen. Unsere Website nutzt SSL-/TLS-Verschlüsselung.</p>
                </section>

                <section>
                  <h2 className="text-3xl font-serif text-white italic mb-6 border-b border-white/10 pb-4">6. Hosting der Website</h2>
                  <p>Unsere Website wird bei der <strong>IONOS SE</strong> gehostet. Der Hosting-Anbieter verarbeitet technische Daten, die für den sicheren Betrieb der Website erforderlich sind.</p>
                </section>

                <section>
                  <h2 className="text-3xl font-serif text-white italic mb-6 border-b border-white/10 pb-4">7. Server-Log-Dateien</h2>
                  <p>Beim Besuch unserer Website können automatisch folgende Daten verarbeitet werden:</p>
                  <ul className="list-disc pl-6 space-y-2 mt-4">
                    <li>IP-Adresse, Datum und Uhrzeit des Zugriffs</li>
                    <li>Browsertyp und Betriebssystem</li>
                    <li>Referrer-URL und aufgerufene Seiten</li>
                    <li>HTTP-Statuscode</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-3xl font-serif text-white italic mb-6 border-b border-white/10 pb-4">8. Kontaktaufnahme</h2>
                  <p>Wenn Sie uns kontaktieren, verarbeiten wir die von Ihnen übermittelten Daten (Name, E-Mail, Telefon, Nachricht, Projektinfos) zur Bearbeitung Ihrer Anfrage.</p>
                </section>

                <section>
                  <h2 className="text-3xl font-serif text-white italic mb-6 border-b border-white/10 pb-4">9. Terminvereinbarung über die Website</h2>
                  <p>Bei Terminvereinbarungen über unsere Website können Daten wie Name, E-Mail-Adresse, Telefonnummer, Terminwunsch und Projektinformationen verarbeitet werden.</p>
                </section>

                <section>
                  <h2 className="text-3xl font-serif text-white italic mb-6 border-b border-white/10 pb-4">10. Kunden- und Projektdaten</h2>
                  <p>Im Rahmen unserer Dienstleistungen verarbeiten wir Kunden- und Projektdaten zur Erstellung von Websites, digitalen Lösungen und Automatisierungen.</p>
                </section>

                <section>
                  <h2 className="text-3xl font-serif text-white italic mb-6 border-b border-white/10 pb-4">11. Firebase und Google Cloud Firestore</h2>
                  <p>Zur Speicherung und Verwaltung geschäftlicher Daten nutzen wir Google Firebase, insbesondere Google Cloud Firestore. Dabei können Kontaktanfragen, Termine, Kundendaten, Projektinfos sowie Vertrags- und Rechnungsdaten gespeichert werden.</p>
                </section>

                <section>
                  <h2 className="text-3xl font-serif text-white italic mb-6 border-b border-white/10 pb-4">12. Rechnungen und Verträge</h2>
                  <p>Vertrags- und Rechnungsdaten werden zur Durchführung unserer Geschäftsbeziehungen und zur Erfüllung gesetzlicher Pflichten verarbeitet. Die Zahlung erfolgt per Banküberweisung.</p>
                </section>

                <section>
                  <h2 className="text-3xl font-serif text-white italic mb-6 border-b border-white/10 pb-4">13. Lokale Speicherung im Browser</h2>
                  <p>Unsere Anwendung kann technische Daten vorübergehend lokal im Browser speichern (LocalStorage), um die Funktionalität und Stabilität zu gewährleisten.</p>
                </section>

                <section>
                  <h2 className="text-3xl font-serif text-white italic mb-6 border-b border-white/10 pb-4">14. GitHub</h2>
                  <p>Für Entwicklung, Versionsverwaltung und Wartung unserer Software- und Webprojekte nutzen wir GitHub.</p>
                </section>

                <section>
                  <h2 className="text-3xl font-serif text-white italic mb-6 border-b border-white/10 pb-4">15. Google Gemini</h2>
                  <p>Google Gemini wird ausschließlich für interne Prozesse wie die Bearbeitung oder Übersetzung eigener Inhalte genutzt. Es werden keine Kundendaten, Termindaten oder Rechnungsdaten an KI-Systeme übertragen.</p>
                </section>

                <section>
                  <h2 className="text-3xl font-serif text-white italic mb-6 border-b border-white/10 pb-4">16. Social-Media-Präsenzen</h2>
                  <p>Viktor Labs nutzt Social-Media-Plattformen wie Instagram und LinkedIn. Bei der Nutzung können personenbezogene Daten durch die jeweiligen Betreiber verarbeitet werden.</p>
                </section>

                <section>
                  <h2 className="text-3xl font-serif text-white italic mb-6 border-b border-white/10 pb-4">17. Datenübermittlung in Drittländer</h2>
                  <p>Eine Übermittlung personenbezogener Daten außerhalb der EU erfolgt nur unter Einhaltung der gesetzlichen Anforderungen der DSGVO.</p>
                </section>

                <section>
                  <h2 className="text-3xl font-serif text-white italic mb-6 border-b border-white/10 pb-4">18. Speicherdauer</h2>
                  <p>Personenbezogene Daten werden nur so lange gespeichert, wie dies für den jeweiligen Zweck erforderlich ist oder gesetzliche Aufbewahrungspflichten bestehen.</p>
                </section>

                <section>
                  <h2 className="text-3xl font-serif text-white italic mb-6 border-b border-white/10 pb-4">19. Rechte betroffener Personen</h2>
                  <ul className="list-disc pl-6 space-y-2 mt-4">
                    <li>Auskunft, Berichtigung, Löschung</li>
                    <li>Einschränkung der Verarbeitung</li>
                    <li>Datenübertragbarkeit, Widerspruch</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-3xl font-serif text-white italic mb-6 border-b border-white/10 pb-4">20. Widerruf von Einwilligungen</h2>
                  <p>Erteilte Einwilligungen können jederzeit mit Wirkung für die Zukunft widerrufen werden.</p>
                </section>

                <section>
                  <h2 className="text-3xl font-serif text-white italic mb-6 border-b border-white/10 pb-4">21. Beschwerderecht</h2>
                  <p>Sie haben das Recht, sich bei einer Datenschutzaufsichtsbehörde zu beschweren.</p>
                </section>

                <section>
                  <h2 className="text-3xl font-serif text-white italic mb-6 border-b border-white/10 pb-4">22. Keine automatisierte Entscheidungsfindung</h2>
                  <p>Eine automatisierte Entscheidungsfindung gemäß Art. 22 DSGVO findet nicht statt.</p>
                </section>

                <section>
                  <h2 className="text-3xl font-serif text-white italic mb-6 border-b border-white/10 pb-4">23. Änderungen dieser Datenschutzerklärung</h2>
                  <p>Wir behalten uns vor, diese Datenschutzerklärung anzupassen, wenn sich technische oder rechtliche Änderungen ergeben.</p>
                </section>

                <section>
                  <h2 className="text-3xl font-serif text-white italic mb-6 border-b border-white/10 pb-4">24. Kontakt Datenschutz</h2>
                  <div className="bg-white/5 border border-white/10 p-6 rounded-2xl mt-6">
                    <p className="font-bold text-white mb-1">Viktor Labs</p>
                    <p><span className="text-amber-500">[Vor- und Nachname]</span></p>
                    <p><span className="text-amber-500">[Adresse]</span></p>
                    <p><span className="text-amber-500">[E-Mail-Adresse]</span></p>
                  </div>
                </section>

                <div className="text-center text-slate-500 italic pt-20">
                  Stand: 01.08.2026
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
