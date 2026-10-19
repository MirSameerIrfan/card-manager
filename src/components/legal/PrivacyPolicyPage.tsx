import { Link } from '@tanstack/react-router'
import { CONTACT_EMAIL } from '@/lib/contact'
import { LegalPage } from './LegalPage'

// Keep the "Who we share it with" list in step with the services the app
// actually sends data to.
export function PrivacyPolicyPage() {
  return (
    <LegalPage title="Privacy Policy" effectiveDate="October 19, 2026">
      <p>
        MoneyScope ("MoneyScope", "we", "us") is a bill and payment tracker operated by Mir
        Sameer Irfan, an individual based in Canada. This policy explains what personal
        information MoneyScope collects, why, who it is shared with, and the choices you have.
        It applies to money-scope.app and the MoneyScope service. Questions:{' '}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>

      <h2>What we collect</h2>
      <ul>
        <li>
          <strong>Account information:</strong> your name, email address, and password. Your
          password is stored only as a salted hash; we cannot read it.
        </li>
        <li>
          <strong>What you enter:</strong> the credit cards, loans, and recurring bills you add,
          such as their names, providers or last four digits, amounts, due dates, balances,
          categories, and the payments you mark as paid. Do not enter full card or account
          numbers; MoneyScope does not need them.
        </li>
        <li>
          <strong>Settings:</strong> whether you receive payment reminder emails.
        </li>
        <li>
          <strong>Technical information:</strong> the IP address and browser details of each
          signed-in session, short-lived counters keyed by IP address that limit repeated sign-in
          attempts, and server logs kept by our hosting provider. When the app hits an error, a
          report with technical details of the error and the page address is sent to our error
          monitoring service; these reports do not include your cookies, passwords, or the
          contents of forms.
        </li>
      </ul>
      <p>
        MoneyScope does not connect to your bank, does not make payments, and does not collect
        payment card numbers.
      </p>

      <h2>How we use it</h2>
      <ul>
        <li>To provide the service: store your payments, show your dashboard, and keep you signed in.</li>
        <li>To send account emails: email verification, password resets, and, unless you turn them off, payment reminders.</li>
        <li>To keep the service secure and working: prevent abuse, limit repeated sign-in attempts, and find and fix errors.</li>
      </ul>
      <p>
        We do not sell your personal information, use it for advertising, or share it with
        anyone for their own marketing.
      </p>

      <h2>Who we share it with</h2>
      <p>
        Only with the service providers that run MoneyScope for us, and only as needed for the
        service:
      </p>
      <ul>
        <li><strong>Netlify</strong> hosts the website and runs the app.</li>
        <li><strong>Supabase</strong> hosts the database that stores your account and payments.</li>
        <li><strong>Resend</strong> delivers our emails.</li>
        <li><strong>Sentry</strong> receives the error reports described above.</li>
      </ul>
      <p>
        We may also disclose information if the law requires it, or to protect the rights,
        property, or safety of MoneyScope, its users, or others.
      </p>

      <h2>Where it is stored</h2>
      <p>
        These providers store and process information in the United States. It is protected
        under our agreements with them, but it may be accessible to courts and authorities there
        under the laws of the United States.
      </p>

      <h2>Cookies</h2>
      <p>
        MoneyScope uses only cookies that keep you signed in. It does not use advertising or
        analytics cookies.
      </p>

      <h2>How long we keep it</h2>
      <p>
        We keep your information while your account exists. A payment you delete is deleted
        straight away. To delete your account and everything in it, email us from the address on
        the account; we will do it within 30 days. Copies in our providers' backups and logs are
        removed on their normal schedules.
      </p>

      <h2>Security</h2>
      <p>
        Information is encrypted in transit (HTTPS) and at rest by our database provider,
        passwords are hashed, sign-in attempts are rate limited, and only the app can read the
        database. No system is perfectly secure, so we cannot guarantee that your information
        will never be accessed without permission. If a breach creates a real risk of
        significant harm to you, we will tell you as the law requires.
      </p>

      <h2>Your choices and rights</h2>
      <p>
        You can see and edit your payments and your name and email address in the app, and turn
        reminder emails off in your profile settings. You can also ask us for access to, a copy
        of, correction of, or deletion of your personal information, or withdraw your consent,
        by emailing <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. Withdrawing consent
        may mean we can no longer provide the service. If you are not satisfied with our answer,
        you can complain to the{' '}
        <a href="https://www.priv.gc.ca" target="_blank" rel="noopener noreferrer">
          Office of the Privacy Commissioner of Canada
        </a>
        .
      </p>

      <h2>Children</h2>
      <p>
        MoneyScope is not intended for anyone under 18, and we do not knowingly collect
        information from them.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        We may update this policy. The effective date above shows when it last changed, and we
        will email you before any change that significantly affects how your information is used.
        See also our <Link to="/terms">Terms of Service</Link>.
      </p>
    </LegalPage>
  )
}
