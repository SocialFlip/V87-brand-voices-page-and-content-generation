import React from 'react';

export default function Pricing() {
  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-5xl font-bold text-secondary mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Choose the perfect plan to supercharge your social media content creation
          </p>
        </div>

        {/* Stripe Pricing Table */}
        <div className="max-w-5xl mx-auto">
          <stripe-pricing-table 
            pricing-table-id="prctbl_1QfUdRAPsY1QdyG2KTIGje7u"
            publishable-key="pk_live_51JCyNOAPsY1QdyG2Podkafhttx6RfcJOixVSN3SD8aQOab7UXviKAMe2yMtaqexlyz7UmKepzpvgr4xnClKqncEb00pPS0Xoqf">
          </stripe-pricing-table>
        </div>
      </div>
    </div>
  );
}