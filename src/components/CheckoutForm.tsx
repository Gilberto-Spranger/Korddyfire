'use client';
import { useState } from 'react';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';

type CheckoutProps = {
  amount: number;
  buyerId: string;
  sellerId: string;
};

// Helper para extrair mensagens de erro de um unknown
const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return 'Erro desconhecido';
};

export default function CheckoutForm({ amount, buyerId, sellerId }: CheckoutProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (!stripe || !elements) {
        setMessage('Stripe ainda não carregou.');
        return;
      }

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        setMessage('Cartão inválido.');
        return;
      }

      if (!amount || !buyerId || !sellerId) {
        setMessage('Dados incompletos. Verifique sellerId e buyerId.');
        return;
      }

      const res = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, buyer_id: buyerId, seller_id: sellerId }),
      });

      const { clientSecret, error } = await res.json();

      if (error || !clientSecret) {
        setMessage('Erro ao obter clientSecret.');
        return;
      }

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement },
      });

      if (result.error) {
        setMessage(result.error.message || 'Pagamento falhou.');
      } else if (result.paymentIntent?.status === 'succeeded') {
        setMessage('✅ Pagamento realizado com sucesso!');
      } else {
        setMessage('Algo inesperado aconteceu.');
      }
    } catch (err: unknown) {
      console.error(err);
      setMessage('Erro: ' + getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-4 bg-white shadow-md rounded"
    >
      <CardElement className="p-2 border border-gray-300 w-full" />
      <button
        type="submit"
        disabled={!stripe || loading}
        className="mt-4 w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 cursor-pointer"
      >
        {loading ? 'Processando...' : 'Pagar'}
      </button>
      {message && (
        <p
          className={`mt-2 text-center text-sm ${
            message.startsWith('✅') ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {message}
        </p>
      )}
    </form>
  );
}