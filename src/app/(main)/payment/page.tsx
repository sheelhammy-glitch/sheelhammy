import React from 'react'
import { PaymentHero } from './_components/payment-hero'
import { PaymentMethods } from './_components/payment-methods'
import { PaymentInfo } from './_components/payment-info'


export default function PaymentPage() {
  return (
    <main>
      <PaymentHero />
      <PaymentMethods />
      <PaymentInfo />

    </main>
  )
}
