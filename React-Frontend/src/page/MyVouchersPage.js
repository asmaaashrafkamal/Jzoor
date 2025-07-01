import React from 'react';

export function MyVouchersPage() {
  const vouchers = [
    {
      id: 'welcome25',
      title: 'Flat $25 off*',
      code: 'Welcome25',
      description: 'Save $25 on your first order',
      terms: 'Minimum purchase: $150',
      color: '#af926a', // Approximate color from image
      dotColor: '#740000',
    },
    {
      id: 'save10',
      title: 'Flat $10 off*',
      code: 'SAVE10',
      terms: 'Minimum purchase: $150',


      description: 'Save $10 on all orders above $100',
      color: '#A8C686', // Approximate color from image
      dotColor: 'bg-green',
    },
    {
      id: 'green15',
      title: 'Flat $15 off*',
      code: 'GREEN15',
      description: 'Enjoy 15% off',
      terms: 'Valid on planters, tools, and accessories. Min spend: $50',
      color: '#A8C686', // Approximate color from image
      dotColor: 'bg-green',
    },
    {
      id: 'finfirst25',
      title: 'Flat $25 off*',
      code: 'FINFIRST25',
      description: 'Get Flat $25 off',
      terms: 'Save $25 on all transactions above $250.',
      color: '#af926a', // Approximate color from image
      dotColor: '#740000',
    },
  ];

  const handleApplyCode = (code) => {
    // In a real application, you'd integrate this with your backend
    // to apply the voucher code. For now, we'll just log it.
    alert(`Applying voucher code: ${code}`);
    console.log(`Voucher code ${code} applied!`);
  };

  return (
    <div className="  min-h-screen font-sans">
      <div className=" mx-auto">
        <h1 className="text-2xl font-bold text-black mb-8">My Vouchers</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-2 md:p-12 ">
          {vouchers.map((voucher) => (
            <div
              key={voucher.id}
              className={`relative rounded-lg shadow-md overflow-hidden border border-gray-200`}
              style={{
                backgroundColor: voucher.color // Convert Tailwind bg class to hex for direct background color
                // Manually add the "ticket tear" effect with pseudo-elements if needed,
                // but for simplicity, we'll mimic the rounded cutouts with padding/margin adjustments.
              }}
            >
              {/* Top rounded cutouts - simulated with divs */}
              <div className="absolute top-0 left-0 w-4 h-4 bg-gray-100 transform -translate-x-1/2 -translate-y-1/2 rounded-full"></div>
              <div className="absolute top-0 right-0 w-4 h-4 bg-gray-100 transform translate-x-1/2 -translate-y-1/2 rounded-full"></div>

              <div className="p-6 text-white">
                <div className="flex items-center mb-4">
                  <div className={`w-3 h-3 rounded-full mr-2 ${voucher.dotColor}`}></div>
                  <span className="text-sm font-semibold">{voucher.title}</span>
                </div>
                <h2 className="text-2xl font-bold mb-4">{voucher.code}</h2>
              </div>

              <div className="bg-white p-6 rounded-b-lg">
                {/* Bottom rounded cutouts - simulated with divs */}
                <div className="absolute bottom-0 left-0 w-4 h-4 bg-gray-100 transform -translate-x-1/2 translate-y-1/2 rounded-full"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 bg-gray-100 transform translate-x-1/2 translate-y-1/2 rounded-full"></div>
                <p className="text-gray-800 text-sm mb-2">{voucher.description}</p>
                {voucher.terms && (
                  <p className="text-gray-600 text-xs mb-4">{voucher.terms}</p>
                )}
                <p className="text-purple-600 text-xs mb-4">
                  *Terms & conditions applicable
                </p>
                <button
                  className="w-full border border-gray-300 text-gray-700 py-2 rounded-md font-medium hover:bg-gray-50 transition-colors"
                  onClick={() => handleApplyCode(voucher.code)}
                >
                  Apply Code
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MyVouchersPage;