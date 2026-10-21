import { Link } from '@tanstack/react-router'
import { CONTACT_EMAIL } from '@/lib/contact'
import { LegalPage } from './LegalPage'

export function TermsPage() {
  return (
    <LegalPage title="Terms of Service" effectiveDate="October 21, 2026">
      <p>
        These Terms of Service ("Terms") are an agreement between you and Mir Sameer Irfan, an
        individual based in Ontario, Canada, who operates MoneyScope ("MoneyScope", "we", "us"). They
        govern your use of money-scope.app and the MoneyScope service (the "Service"). By
        creating an account or using the Service, you agree to these Terms and to our{' '}
        <Link to="/privacy">Privacy Policy</Link>. If you do not agree, do not use the Service.
      </p>

      <h2>1. Early access</h2>
      <p>
        MoneyScope is an early-stage product offered free of charge during early access. It is
        still being built and tested, and it may contain bugs, change, lose features, have
        downtime, or be discontinued at any time, with or without notice. If we ever charge for
        the Service, we will tell you in advance, and you will not be charged unless you agree.
      </p>

      <h2>2. Who can use MoneyScope</h2>
      <p>
        You must be at least 18 years old, or the age of majority where you live if that is
        higher, and able to enter into a binding contract. You must give accurate account
        information, keep your password confidential, and tell us promptly at{' '}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> if you believe your account has
        been used without your permission. You are responsible for everything that happens under
        your account.
      </p>

      <h2>3. What MoneyScope does and does not do</h2>
      <p>
        MoneyScope is an organizational tool. It records the payments you enter and shows when
        they are due. MoneyScope does <strong>not</strong>:
      </p>
      <ul>
        <li>make, schedule, process, or guarantee any payment;</li>
        <li>connect to your bank, card issuer, lender, or any biller, or check that what you entered matches their records;</li>
        <li>give financial, investment, credit, legal, tax, or accounting advice.</li>
      </ul>
      <p>
        Smart add ("Fill in from a bill") uses Claude, an AI model from Anthropic, to suggest
        payment details from a bill you provide. AI suggestions can be incomplete or wrong, so
        check every field against your bill before you save it. Only submit documents you are
        allowed to share.
      </p>
      <p>
        Everything the Service shows, including due dates, statuses, totals, and balances, is
        for information only and is based on what you enter and on automated
        calculations that may be wrong. Consult a qualified professional before making financial
        decisions.
      </p>

      <h2>4. You remain responsible for your payments</h2>
      <p>
        You alone are responsible for the accuracy of the information you enter, for checking due
        dates and amounts against your actual statements, and for paying your bills in full and
        on time. Do not rely on MoneyScope as your only record or reminder. MoneyScope does not
        send payment reminders, and features that fill in or calculate information automatically
        can make mistakes. MoneyScope is not responsible for any late
        fees, interest, penalties, collection costs, service interruptions, damage to your credit
        score, or other consequences of a missed, late, incorrect, or duplicate payment.
      </p>

      <h2>5. Your data</h2>
      <p>
        You keep ownership of the information you enter. You give us permission to store, copy,
        process, and display it only as needed to provide, secure, and improve the Service, as
        described in the <Link to="/privacy">Privacy Policy</Link>. Do not enter full card or
        account numbers, passwords, or other information the Service does not ask for. We do not
        guarantee that your data will be preserved; keep your own records of anything important.
      </p>

      <h2>6. Acceptable use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>use the Service for anything illegal, fraudulent, or harmful, or to store information about other people without their permission;</li>
        <li>access another person's account or data, or try to get around any security, rate limit, or access control;</li>
        <li>disrupt, overload, probe, or scan the Service, or introduce malware;</li>
        <li>create accounts by automated means, or scrape, copy, resell, or commercially exploit the Service;</li>
        <li>reverse engineer the Service, except where the law expressly allows it.</li>
      </ul>
      <p>
        If you find a security problem, please report it to{' '}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> instead of exploiting it.
      </p>

      <h2>7. Third-party services</h2>
      <p>
        The Service relies on third-party providers for hosting, data storage, email delivery,
        error monitoring, and AI processing. We are not responsible for their acts, omissions, or outages. Links
        to third-party websites are provided for convenience only.
      </p>

      <h2>8. Our rights in the Service</h2>
      <p>
        The Service, including its software, design, text, and the MoneyScope name and logo, is
        owned by us or our licensors. These Terms give you a personal, revocable,
        non-transferable, non-exclusive right to use the Service as offered; they do not transfer
        any ownership to you. If you send us feedback or ideas, we may use them without any
        obligation to you.
      </p>

      <h2>9. Disclaimer of warranties</h2>
      <p>
        To the fullest extent permitted by law, the Service is provided "as is" and "as
        available", with all faults and without warranties or conditions of any kind, whether
        express, implied, or statutory, including any implied warranties or conditions of
        merchantable quality, fitness for a particular purpose, accuracy, non-infringement, and
        uninterrupted or error-free operation. We do not warrant that the Service or its
        calculations will be accurate, timely, secure, or available, or that any data will
        be kept or delivered without loss or corruption.
      </p>

      <h2>10. Limitation of liability</h2>
      <p>
        To the fullest extent permitted by law, MoneyScope and its operator will not be liable for
        any indirect, incidental, special, consequential, exemplary, or punitive damages, or for
        any loss of profits, savings, revenue, data, or goodwill, or for late fees, interest,
        penalties, or credit damage, arising out of or related to the Service or these Terms,
        however caused and under any theory of liability, even if we were told such damages were
        possible.
      </p>
      <p>
        To the fullest extent permitted by law, our total liability for all claims arising out of
        or related to the Service or these Terms is limited to the greater of (a) the amount you
        paid us for the Service in the 12 months before the claim arose, and (b) CAD $100.
      </p>

      <h2>11. Indemnity</h2>
      <p>
        To the extent permitted by law, you will defend, indemnify, and hold harmless MoneyScope
        and its operator from any claims, losses, liabilities, damages, costs, and expenses,
        including reasonable legal fees, arising from your misuse of the Service, your breach of
        these Terms, or your violation of any law or the rights of another person.
      </p>

      <h2>12. Ending your use</h2>
      <p>
        You can stop using the Service at any time and ask us to delete your account at{' '}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. We may suspend or close your
        account, or stop offering the Service, at any time, for example if you breach these Terms
        or to protect the Service or its users. Sections 3, 4, 5, and 8 to 14 continue to apply
        after your use ends.
      </p>

      <h2>13. Changes to these Terms</h2>
      <p>
        We may update these Terms. The effective date above shows when they last changed. If a
        change is significant, we will tell you by email or in the app before it takes effect. By
        continuing to use the Service after a change takes effect, you accept the updated Terms.
      </p>

      <h2>14. General</h2>
      <p>
        These Terms are governed by the laws of the Province of Ontario and the federal laws of
        Canada that apply there, without regard to conflict of laws rules. The courts of Ontario
        have jurisdiction over any dispute, unless the consumer protection law that applies to
        you gives you a right to bring proceedings where you live.
      </p>
      <p>
        Nothing in these Terms excludes or limits any right or remedy that cannot be excluded or
        limited under applicable law, including Ontario's Consumer Protection Act, 2002 and the
        consumer protection laws of your own province or territory. If any part of these Terms is found unenforceable, it will be enforced to the
        fullest extent permitted, and the rest of the Terms will remain in effect. Our failure to
        enforce a provision is not a waiver of it. You may not transfer these Terms; we may
        transfer them in connection with a reorganization, incorporation, or sale of the Service.
        These Terms and the Privacy Policy are the entire agreement between you and us about the
        Service.
      </p>

      <h2>15. Contact</h2>
      <p>
        Questions about these Terms: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>
    </LegalPage>
  )
}
