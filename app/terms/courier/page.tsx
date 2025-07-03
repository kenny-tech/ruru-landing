import React from 'react';
import Link from 'next/link';

export default function CourierTerms() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Link 
        href="/terms" 
        className="text-blue-500 hover:text-blue-700 mb-6 inline-block"
      >
        ← Back to Terms
      </Link>
      <h1 className="text-3xl font-bold mb-8">Terms and Conditions (Courier Company)</h1>
      <div className="prose max-w-none space-y-6">
        <p><strong>Ruru App:</strong><br />Terms and Conditions for Onboard Courier Companies</p>

        <p>These Terms and Conditions ("Terms") govern the relationship between Ruru Logistics ("Ruru,") and your Organization onboarded to the Ruru mobile application ("App"). By registering and operating on the Ruru App, you agree to be bound by these Terms.</p>

        <h2 className="mt-10">1. Acceptance of Terms</h2>
        <p>1.1. By registering your Courier Company on the Ruru App, you affirm that you have the legal authority to enter into this agreement and that your company is duly registered and authorized to operate courier and logistics services within Nigeria.</p>
        <p>1.2. You acknowledge that Ruru acts solely as a technology platform connecting you with users seeking parcel delivery services. Ruru is not a logistics or courier service provider itself and does not employ your riders.</p>

        <h2 className="mt-10">2. Registration and Onboarding</h2>
        <p>2.1. You agree to provide accurate, complete, and current information during the registration and onboarding process, including but not limited to company registration details, operational licenses, fleet information, and rider details.</p>
        <p>2.2. You must promptly update any changes to your company information, rider details, or operational capabilities.</p>
        <p>2.3. Ruru reserves the right to approve or reject any Courier Company's application at its sole discretion, or to suspend or terminate an existing account if any information provided is found to be false, misleading, or incomplete, or if you violate these Terms.</p>

        <h2 className="mt-10">3. Service Standards and Performance</h2>
        <p><strong>3.1. Parcel Handling and Safety:</strong> You are solely responsible for the safe and secure handling, transportation, and delivery of all parcels accepted through the Ruru App.</p>
        <p><strong>3.2. Timely Deliveries:</strong> You commit to accepting and completing delivery requests in a timely and efficient manner.</p>
        <p><strong>3.3. Proof of Delivery:</strong> You must ensure your riders confirm verifiable proof of delivery as required by the App.</p>
        <p><strong>3.4. Prohibited Items:</strong> You and your riders must strictly adhere to Ruru’s list of prohibited items.</p>
        <p><strong>3.5. Operational Hours:</strong> You will clearly communicate your operational hours and service availability through the App.</p>

        <h2 className="mt-10">4. Rider Management and Training</h2>
        <p><strong>4.1. Rider Vetting:</strong> You are responsible for conducting background checks and verifying all rider documentation.</p>
        <p><strong>4.2. Training:</strong> Riders must be trained in safety, handling, customer service, and using the App effectively.</p>
        <p><strong>4.3. Rider Conduct:</strong> You are responsible for your riders’ professionalism and lawful behavior.</p>
        <p><strong>4.4. Compliance:</strong> Ensure compliance with all applicable laws and regulations.</p>

        <h2 className="mt-10">5. Financials and Payments</h2>
        <p><strong>5.1. Service Fees:</strong> Ruru deducts service fees from each successful delivery.</p>
        <p><strong>5.2. Payment Cycles:</strong> Payouts are processed within 48 hours after delivery completion.</p>
        <p><strong>5.3. Disputes:</strong> Report any discrepancies within 48 hours of transaction.</p>

        <h2 className="mt-10">6. Insurance and Liability</h2>
        <p><strong>6.1. Your Primary Liability:</strong> You are responsible for parcels while in your custody.</p>
        <p><strong>6.2. Insurance:</strong> You must maintain valid insurance (liability, goods-in-transit, vehicle).</p>
        <p><strong>6.3. Indemnification:</strong> You agree to indemnify Ruru against claims arising from your services or breaches of these Terms.</p>

        <h2 className="mt-10">7. Use of Ruru App and Data</h2>
        <p><strong>7.1. App Usage:</strong> License is granted solely for delivery fulfillment purposes.</p>
        <p><strong>7.2. Data Privacy:</strong> You must comply with the NDPA and Ruru’s Privacy Policy.</p>
        <p><strong>7.3. Confidentiality:</strong> Non-public information must remain confidential.</p>

        <h2 className="mt-10">8. Termination</h2>
        <p><strong>8.1. By Ruru:</strong> Ruru may terminate access for any breach, without prior notice.</p>
        <p><strong>8.2. By Courier Company:</strong> You may terminate with 14 days' written notice and no pending obligations.</p>
        <p><strong>8.3. Effect:</strong> Upon termination, App access ceases, and financial obligations become due.</p>

        <h2 className="mt-10">9. Governing Law and Dispute Resolution</h2>
        <p><strong>9.1.</strong> Nigerian law governs these Terms.</p>
        <p><strong>9.2.</strong> Disputes will be resolved by negotiation, then mediation, and finally arbitration in Lagos, Nigeria, per the Arbitration and Conciliation Act.</p>

        <h2 className="mt-10">10. Miscellaneous</h2>
        <p><strong>10.1. Entire Agreement:</strong> These Terms supersede prior agreements.</p>
        <p><strong>10.2. Severability:</strong> Invalid provisions will not affect enforceability of others.</p>
        <p><strong>10.3. No Partnership:</strong> These Terms do not create any agency, employment, or joint venture relationship.</p>

        <p className="mt-6"><strong>Effective Date:</strong> [Your sign-on date]</p>
      </div>
    </div>
  );
}
