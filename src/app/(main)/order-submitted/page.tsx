'use client';

import { OrderSuccess } from '@/src/features/order/order-success/ui/order-success';
import { useSearchParams } from 'next/navigation';

const OrderSubmitted = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  return <OrderSuccess orderId={orderId!} />;
};

export default OrderSubmitted;
