import React from 'react';
import Link from 'next/link';

export default function UserTerms() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Link 
        href="/terms" 
        className="text-blue-500 hover:text-blue-700 mb-6 inline-block"
      >
        ← Back to Terms
      </Link>
      <h1 className="text-3xl font-bold mb-8">Terms and Conditions (App User)</h1>
      <div className="prose max-w-none space-y-6">
        <p><strong>Ruru App:</strong><br />Terms and Conditions for Users</p>

        <p>Please read these Terms and Conditions ("Terms") carefully before using the Ruru mobile application ("App") provided by Ruru Logistics.</p>

        <p>These Terms govern your access to and use of the App and the logistics services facilitated through it. By accessing or using the App, you agree to be bound by these Terms and our Privacy Policy. If you do not agree with any part of these Terms, you must not use the App.</p>

        <h2 className="mt-10">1. Acceptance of Terms</h2>
        <p>1.1. By downloading, installing, or using the Ruru App, you confirm that you are at least 18 years old and legally capable of entering into a binding agreement.</p>
        <p>1.2. You acknowledge that Ruru acts solely as a platform to connect you with independent third-party dispatch riders ("Riders") for the delivery of your parcels within Nigeria. Ruru does not directly provide delivery services and is not an employer of the Riders.</p>

        <h2 className="mt-10">2. Your Account</h2>
        <p>2.1. To use the App, you must register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.</p>
        <p>2.2. You are responsible for maintaining the confidentiality of your account login credentials and for all activities that occur under your account. You agree to notify Ruru immediately of any unauthorized use of your account.</p>
        <p>2.3. Ruru reserves the right to suspend or terminate your account at its sole discretion if any information provided is found to be inaccurate, untrue, or incomplete, or if you violate these Terms.</p>

        <h2 className="mt-10">3. Booking and Delivery Services</h2>
        <p>3.1. The App allows you to request dispatch services from available Riders. Once a booking is confirmed, you will receive details of the assigned Rider.</p>
        <p>3.2. You are responsible for accurately providing pickup and delivery addresses, contact information, and detailed descriptions of the parcel(s), including size, weight, and contents.</p>
        <p>3.3. <strong>Prohibited Items:</strong> You agree not to send any illegal, hazardous, dangerous, stolen, perishable, fragile (unless adequately packed and declared), or otherwise prohibited items. Ruru and its Riders may refuse to transport such items.</p>
        <p>3.4. <strong>Packaging:</strong> You are solely responsible for adequately packaging your parcel(s). Ruru is not liable for damage caused by insufficient packaging.</p>
        <p>3.5. <strong>Recipient Availability:</strong> You must ensure the recipient is available at the delivery address. Re-delivery or return may incur additional charges.</p>

        <h2 className="mt-10">4. Fees and Payment</h2>
        <p>4.1. The delivery cost is shown in the App before confirmation and is based on distance, parcel size, and demand.</p>
        <p>4.2. Payment must be made using the integrated methods in the App. You agree to pay all charges and applicable taxes.</p>
        <p>4.3. All payments are final and non-refundable unless determined otherwise by Ruru.</p>
        <p>4.4. Disputes about charges must be reported within 48 hours.</p>

        <h2 className="mt-10">5. Cancellations and Refunds</h2>
        <p>5.1. You may cancel a booking through the App. Fees may apply depending on cancellation timing.</p>
        <p>5.2. Ruru may cancel a booking due to unavailability or other issues. Refunds will be issued if applicable.</p>

        <h2 className="mt-10">6. Liability and Indemnification</h2>
        <p>6.1. Ruru connects users to Riders but is not responsible for their actions or omissions.</p>
        <p>6.2. <strong>Limits of Liability:</strong> Ruru’s liability is capped at NGN 10,000 or the declared item value—whichever is lower—unless additional insurance was purchased.</p>
        <p>6.3. Ruru is not liable for indirect or consequential damages, even if advised of the possibility.</p>
        <p>6.4. You agree to indemnify Ruru for claims arising from your use of the App or breach of these Terms.</p>

        <h2 className="mt-10">7. User Conduct</h2>
        <p>7.1. You agree to use the App lawfully and respectfully.</p>
        <p>7.2. Abusive or inappropriate behavior toward Riders will lead to account termination.</p>
        <p>7.3. You must not transmit harmful software through the App.</p>

        <h2 className="mt-10">8. Intellectual Property</h2>
        <p>8.1. All intellectual property in the App is owned by Ruru or its licensors.</p>
        <p>8.2. You are granted a limited, personal license to use the App under these Terms.</p>

        <h2 className="mt-10">9. Privacy</h2>
        <p>9.1. Use of the App is subject to our Privacy Policy, which governs how your data is processed and protected.</p>

        <h2 className="mt-10">10. Modifications to Terms</h2>
        <p>10.1. Ruru may update these Terms. Continued use after changes constitutes your agreement to the updated Terms.</p>

        <h2 className="mt-10">11. Governing Law and Dispute Resolution</h2>
        <p>11.1. These Terms are governed by the laws of Nigeria.</p>
        <p>11.2. Disputes will first be resolved through negotiation, then mediation, and if unresolved, arbitration in Lagos under the Arbitration and Conciliation Act.</p>

        <h2 className="mt-10">12. Severability</h2>
        <p>12.1. If any part of these Terms is deemed unenforceable, the remainder will continue in effect.</p>

        <h2 className="mt-10">13. Contact Information</h2>
        <p>13.1. If you have questions about these Terms, contact us:</p>
        <p>Email: <a href="mailto:supportuser@ruruit.com">supportuser@ruruit.com</a><br />
           Phone: +234-810-600-2643</p>

        <p className="italic text-sm">Important Legal Disclaimer: This document is for informational purposes only. Please consult a qualified legal professional to ensure compliance with Nigerian law.</p>
      </div>
    </div>
  );
}
