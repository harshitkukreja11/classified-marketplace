export default async function PaymentSuccessPage({ searchParams }) {
  const params = await searchParams;
  const sessionId = params?.session_id;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-6">
      <div className="bg-white rounded-2xl shadow p-8 max-w-lg w-full text-center">
        <h1 className="text-3xl font-bold text-green-600 mb-4">
          Payment Successful
        </h1>
        <p className="text-gray-700 mb-3">
          Your payment was completed.
        </p>
        <p className="text-sm text-gray-500 mb-6">
          Your listing will be published after Stripe confirms the payment.
        </p>
        {sessionId && (
          <p className="text-xs text-gray-400 break-all">
            Session: {sessionId}
          </p>
        )}
      </div>
    </div>
  );
}